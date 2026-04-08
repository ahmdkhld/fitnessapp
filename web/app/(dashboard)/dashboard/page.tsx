import { api, AdherenceSummary } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui';

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
    },
    { label: t('currentStreak'), value: streak ? `${streak} ${t('days')}` : `0 ${t('days')}` },
    {
      label: t('completed7d'),
      value: summary ? `${summary.completed} / ${summary.total}` : '—',
    },
    {
      label: t('skipped7d'),
      value: summary ? `${summary.skipped}` : '—',
    },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('overview')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('snapshot')}
      </p>
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: '#3a1f1f',
            border: '1px solid #6a2a2a',
            borderRadius: 8,
            marginBottom: '1.5rem',
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {cards.map((c) => (
          <Card key={c.label} padding="1.25rem" style={{ borderRadius: 12 }}>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>
              {c.value}
            </div>
          </Card>
        ))}
      </div>
      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{t('byCategory')}</h2>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            {summary.perType.map((pt) => (
              <Card
                key={pt.type}
                padding="0.75rem 1rem"
                style={{ borderRadius: 8 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{pt.type}</span>
                  <span>
                    {pt.completed}/{pt.total} · {pt.percentage}%
                  </span>
                </div>
                <div
                  style={{
                    height: 6,
                    background: 'var(--border)',
                    borderRadius: 3,
                  }}
                >
                  <div
                    style={{
                      width: `${pt.percentage}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
