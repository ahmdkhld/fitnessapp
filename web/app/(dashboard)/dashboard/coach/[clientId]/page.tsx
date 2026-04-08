import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

interface ClientSummary {
  client: {
    id: string;
    email: string;
    fullName: string | null;
    goal: string | null;
  } | null;
  profile: {
    heightCm: number | null;
    weightKg: number | null;
    bodyFatPct: number | null;
  } | null;
  summary: {
    adherencePct: number;
    totalItems: number;
    completedItems: number;
    workoutSessions: number;
    personalRecords: number;
  };
  recentSessions: Array<{
    id: string;
    date: string;
    name: string;
    durationMin: number | null;
  }>;
  recentPRs: Array<{
    exercise: string;
    recordType: string;
    value: number;
    unit: string;
    achievedAt: string;
  }>;
}

async function load(clientId: string) {
  try {
    const res = await authedFetch(`/coach/clients/${clientId}/summary`);
    return {
      data: (await res.json()) as ClientSummary,
      error: null as string | null,
    };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.25rem',
  borderRadius: 12,
};

export default async function ClientSummaryPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { data, error } = await load(params.clientId);
  const t = await getTranslations('coach');
  const tc = await getTranslations('common');
  const tw = await getTranslations('workouts');
  if (error) return <p style={{ color: '#e07b5f' }}>{error}</p>;
  if (!data?.client) return <p>{tc('notFound')}</p>;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>
        {data.client.fullName ?? data.client.email}
      </h1>
      <p style={{ color: 'var(--muted)' }}>
        {data.client.goal ?? '—'} · {t('readOnlyView')}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <div style={card}>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('adherence14d')}</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            {data.summary.adherencePct}%
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>
            {data.summary.completedItems}/{data.summary.totalItems} {t('items')}
          </div>
        </div>
        <div style={card}>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('workouts14d')}</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            {data.summary.workoutSessions}
          </div>
        </div>
        <div style={card}>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>{t('prs14d')}</div>
          <div style={{ fontSize: 28, fontWeight: 600 }}>
            {data.summary.personalRecords}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>{t('recentSessions')}</h2>
      {data.recentSessions.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noRecentSessions')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.recentSessions.map((s) => (
            <div
              key={s.id}
              style={{ ...card, padding: '0.75rem 1rem' }}
            >
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {s.date.slice(0, 10)} · {s.durationMin ?? 0} {tw('min')}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>{t('recentPRs')}</h2>
      {data.recentPRs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noRecentPRs')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.recentPRs.map((pr, i) => (
            <div key={i} style={{ ...card, padding: '0.75rem 1rem' }}>
              <div style={{ fontWeight: 600 }}>{pr.exercise}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {pr.recordType.replace(/_/g, ' ')} · {pr.value} {pr.unit} ·{' '}
                {pr.achievedAt.slice(0, 10)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
