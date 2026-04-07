import { api, AdherenceSummary } from '@/lib/api';
import { getToken } from '@/lib/auth';

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

  const cards = [
    {
      label: 'Adherence (7d)',
      value: summary ? `${summary.overallPercentage}%` : '—',
    },
    { label: 'Current streak', value: streak ? `${streak} days` : '0 days' },
    {
      label: 'Completed (7d)',
      value: summary ? `${summary.completed} / ${summary.total}` : '—',
    },
    {
      label: 'Skipped (7d)',
      value: summary ? `${summary.skipped}` : '—',
    },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Overview</h1>
      <p style={{ color: 'var(--muted)' }}>
        Snapshot of your weekly adherence and progress.
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
          <div
            key={c.label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              borderRadius: 12,
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
      {summary && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem' }}>By category</h2>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            {summary.perType.map((t) => (
              <div
                key={t.type}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{t.type}</span>
                  <span>
                    {t.completed}/{t.total} · {t.percentage}%
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
                      width: `${t.percentage}%`,
                      height: '100%',
                      background: 'var(--accent)',
                      borderRadius: 3,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
