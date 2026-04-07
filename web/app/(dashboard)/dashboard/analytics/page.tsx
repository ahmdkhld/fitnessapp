import { api, Insight } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { WeeklyAdherenceChart } from '@/components/WeeklyAdherenceChart';

export const dynamic = 'force-dynamic';

async function load(): Promise<{
  insights: Insight[];
  chart: { date: string; percentage: number }[];
  error: string | null;
}> {
  const token = getToken();
  if (!token) return { insights: [], chart: [], error: 'Not signed in' };
  const to = new Date().toISOString().slice(0, 10);
  const from = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  try {
    const [insights, report] = await Promise.all([
      api.insights(token),
      api.exportReport(token, from, to),
    ]);
    return {
      insights,
      chart: (report.dailyAdherence ?? []).map((d) => ({
        date: d.date.slice(5),
        percentage: d.percentage,
      })),
      error: null,
    };
  } catch (e) {
    return { insights: [], chart: [], error: (e as Error).message };
  }
}

const severityColor: Record<string, string> = {
  info: '#4a9d7e',
  warn: '#d8a24a',
  critical: '#e07b5f',
};

export default async function AnalyticsPage() {
  const { insights, chart, error } = await load();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Analytics & insights</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}
      {chart.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <WeeklyAdherenceChart data={chart} />
        </div>
      )}
      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>Insights</h2>
      {insights.length === 0 && !error && (
        <p style={{ color: 'var(--muted)' }}>
          No insights yet — keep logging for at least a week.
        </p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {insights.map((i, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--card)',
              border: `1px solid ${severityColor[i.severity] ?? 'var(--border)'}`,
              borderLeftWidth: 4,
              padding: '1rem 1.25rem',
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>{i.title}</div>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
              {i.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
