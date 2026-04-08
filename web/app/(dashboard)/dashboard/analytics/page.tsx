import { api, Insight } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
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
  info: 'var(--success)',
  warn: 'var(--warning)',
  critical: 'var(--danger)',
};

export default async function AnalyticsPage() {
  const { insights, chart, error } = await load();
  const t = await getTranslations('analytics');
  return (
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>Weekly adherence and computed insights from your last 7 days.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {chart.length > 0 && (
        <div className="glass-card">
          <WeeklyAdherenceChart data={chart} />
        </div>
      )}

      <h2 className="section-title">{t('insights')}</h2>

      {insights.length === 0 && !error && (
        <div className="empty-state">
          <p className="empty-state__title">{t('noInsights')}</p>
          <p className="empty-state__body">
            Insights appear once you have at least a few days of logged meals,
            workouts, or supplements.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {insights.map((i, idx) => (
          <div
            key={idx}
            className="insight-card reveal"
            style={{
              animationDelay: `${idx * 0.05}s`,
              borderLeftColor: severityColor[i.severity] ?? 'var(--border)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              {i.title}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6, lineHeight: 1.55 }}>
              {i.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
