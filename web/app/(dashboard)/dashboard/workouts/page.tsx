import Link from 'next/link';
import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { PersonalRecord, WorkoutPlan, WorkoutSession } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const [plansRes, prsRes, historyRes] = await Promise.all([
      authedFetch('/workout-plans'),
      authedFetch('/workout-analytics/prs'),
      authedFetch('/workout-sessions'),
    ]);
    return {
      plans: (await plansRes.json()) as WorkoutPlan[],
      prs: (await prsRes.json()) as PersonalRecord[],
      history: (await historyRes.json()) as WorkoutSession[],
      error: null as string | null,
    };
  } catch (e) {
    return { plans: [], prs: [], history: [], error: (e as Error).message };
  }
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.25rem',
  borderRadius: 12,
};

export default async function WorkoutsHomePage() {
  const { plans, prs, history, error } = await load();
  const t = await getTranslations('workouts');
  const active = plans.find((p) => p.isActive);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href="/dashboard/workouts/templates"
            style={{
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            {t('templates')}
          </Link>
          <Link
            href="/dashboard/workouts/plans"
            style={{
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            {t('myPlans')}
          </Link>
          <Link
            href="/dashboard/workouts/sessions"
            style={{
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            {t('history')}
          </Link>
          <Link
            href="/dashboard/workouts/library"
            style={{
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            {t('library')}
          </Link>
          <Link
            href="/dashboard/workouts/analytics"
            style={{
              padding: '0.4rem 0.9rem',
              border: '1px solid var(--border)',
              borderRadius: 6,
            }}
          >
            {t('analytics')}
          </Link>
        </div>
      </div>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      <div style={{ ...card, marginTop: '1.5rem' }}>
        {active ? (
          <>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t('activePlan')}</div>
            <div style={{ fontSize: 22, fontWeight: 600 }}>{active.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>
              {[active.splitType, `${active.daysPerWeek} ${t('daysPerWeek')}`, active.goal]
                .filter(Boolean)
                .join(' · ')}
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 18, marginBottom: 8 }}>
              {t('noActivePlan')}
            </div>
            <Link
              href="/dashboard/workouts/templates"
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                background: 'var(--accent)',
                color: '#fff',
                borderRadius: 6,
              }}
            >
              {t('browseTemplates')}
            </Link>
          </>
        )}
      </div>

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>{t('recentPRs')}</h2>
      {prs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('logSessionForPR')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {prs.slice(0, 5).map((pr) => (
            <div key={pr.id} style={{ ...card, padding: '0.75rem 1rem' }}>
              <div style={{ fontWeight: 600 }}>{pr.exercise.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {pr.recordType.replace(/_/g, ' ')} · {pr.value} {pr.unit}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>{t('recentSessions')}</h2>
      {history.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noSessionsYet')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {history.slice(0, 5).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/workouts/sessions/${s.id}`}
              style={{ ...card, padding: '0.75rem 1rem', color: 'inherit' }}
            >
              <div style={{ fontWeight: 600 }}>{s.day?.name ?? t('freeform')}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {s.date.slice(0, 10)} · {s.sets.length} {t('sets')} · {s.durationMin ?? 0} {t('min')}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
