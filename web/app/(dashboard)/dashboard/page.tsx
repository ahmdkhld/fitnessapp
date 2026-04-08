import { api, AdherenceSummary } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function loadSummary(): Promise<{
  summary: AdherenceSummary | null;
  streak: number;
  error: string | null;
}> {
  const token = getToken();
  if (!token) {
    return { summary: null, streak: 0, error: 'Not signed in' };
  }
  try {
    const [summary, streak] = await Promise.all([
      api.adherence(token),
      api.streak(token),
    ]);
    return { summary, streak: streak.currentStreak, error: null };
  } catch (e) {
    return { summary: null, streak: 0, error: (e as Error).message };
  }
}

export default async function DashboardOverviewPage() {
  const { summary, streak, error } = await loadSummary();
  const t = await getTranslations('dashboard');

  const cards = [
    {
      label: t('adherence7d'),
      value: summary ? `${summary.overallPercentage}%` : '—',
      icon: '📊',
      accentColor: '#22C55E',
    },
    {
      label: t('currentStreak'),
      value: streak ? `${streak} ${t('days')}` : `0 ${t('days')}`,
      icon: '🔥',
      accentColor: '#A020F0',
    },
    {
      label: t('completed7d'),
      value: summary ? `${summary.completed} / ${summary.total}` : '—',
      icon: '✅',
      accentColor: '#0000FF',
    },
    {
      label: t('skipped7d'),
      value: summary ? `${summary.skipped}` : '—',
      icon: '⏭',
      accentColor: '#666666',
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginTop: 0, marginBottom: 4, fontSize: '1.75rem', fontWeight: 700 }}>
            {t('overview')}
          </h1>
          <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
            {t('snapshot')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            padding: '0.4rem 0.75rem',
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--muted)',
            fontSize: 13,
          }}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Stat cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            {/* Accent circle in top-right */}
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: `${c.accentColor}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
            }}>
              {c.icon}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#FFF' }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      {/* Category breakdown */}
      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
            {t('byCategory')}
          </h2>
          <div className="glass-card">
            <div style={{ display: 'grid', gap: '1rem' }}>
              {summary.perType.map((pt) => (
                <div key={pt.type}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontSize: 14,
                    }}
                  >
                    <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{pt.type}</span>
                    <span style={{ color: 'var(--muted)' }}>
                      {pt.completed}/{pt.total} &middot; {pt.percentage}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pt.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
