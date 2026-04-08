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
    return { data: (await res.json()) as ClientSummary, error: null as string | null };
  } catch (e) {
    return { data: null, error: (e as Error).message };
  }
}

export default async function ClientSummaryPage({
  params,
}: {
  params: { clientId: string };
}) {
  const { data, error } = await load(params.clientId);
  const t = await getTranslations('coach');
  const tc = await getTranslations('common');
  const tw = await getTranslations('workouts');
  if (error) return <div className="error-banner">{error}</div>;
  if (!data?.client) return <p style={{ color: 'var(--muted)' }}>{tc('notFound')}</p>;

  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-user" style={{ marginRight: 10, color: 'var(--accent)' }} />{data.client.fullName ?? data.client.email}</h1>
        <p>{data.client.goal ?? '\u2014'} · {t('readOnlyView')}</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <div className="stat-card">
          <div className="stat-accent" style={{ background: 'var(--green)' }} />
          <div className="stat-label">{t('adherence14d')}</div>
          <div className="stat-value" style={{ color: 'var(--green)' }}>{data.summary.adherencePct}%</div>
          <div className="stat-sub">{data.summary.completedItems}/{data.summary.totalItems} {t('items')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: 'var(--accent)' }} />
          <div className="stat-label">{t('workouts14d')}</div>
          <div className="stat-value">{data.summary.workoutSessions}</div>
        </div>
        <div className="stat-card">
          <div className="stat-accent" style={{ background: 'var(--purple)' }} />
          <div className="stat-label">{t('prs14d')}</div>
          <div className="stat-value">{data.summary.personalRecords}</div>
        </div>
      </div>

      <h2 className="section-title"><i className="fa-solid fa-dumbbell" style={{ marginRight: 8, color: 'var(--accent)' }} />{t('recentSessions')}</h2>
      {data.recentSessions.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noRecentSessions')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.recentSessions.map((s) => (
            <div key={s.id} className="list-card">
              <div style={{ fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {s.date.slice(0, 10)} · {s.durationMin ?? 0} {tw('min')}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title"><i className="fa-solid fa-trophy" style={{ marginRight: 8, color: 'var(--green)' }} />{t('recentPRs')}</h2>
      {data.recentPRs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noRecentPRs')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {data.recentPRs.map((pr, i) => (
            <div key={i} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{pr.exercise}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {pr.recordType.replace(/_/g, ' ')} · {pr.value} {pr.unit}
                </div>
              </div>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>{pr.achievedAt.slice(0, 10)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
