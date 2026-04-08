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
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-chart-pie" style={{ marginRight: 10, color: 'var(--green)' }} />{t('title')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {chart.length > 0 && (
        <div className="glass-card" style={{ marginTop: '1rem' }}>
          <WeeklyAdherenceChart data={chart} />
        </div>
      )}
      <h2 className="section-title">
        <i className="fa-solid fa-lightbulb" style={{ marginRight: 8, color: 'var(--purple)' }} />
        {t('insights')}
      </h2>
      {insights.length === 0 && !error && (
        <p style={{ color: 'var(--muted)' }}>{t('noInsights')}</p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
        {insights.map((i, idx) => (
          <div
            key={idx}
            className="insight-card"
            style={{ borderLeftColor: severityColor[i.severity] ?? 'var(--border)' }}
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
