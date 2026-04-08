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
      history: await historyRes.json().then((b: any) => Array.isArray(b) ? b : (b.data ?? [])) as WorkoutSession[],
      error: null as string | null,
    };
  } catch (e) {
    return { plans: [], prs: [], history: [], error: (e as Error).message };
  }
}

export default async function WorkoutsHomePage() {
  const { plans, prs, history, error } = await load();
  const t = await getTranslations('workouts');
  const active = plans.find((p) => p.isActive);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div className="page-header">
          <h1><i className="fa-solid fa-dumbbell" style={{ marginRight: 10, color: 'var(--accent)' }} />{t('title')}</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link href="/dashboard/workouts/templates" className="btn-outline">{t('templates')}</Link>
          <Link href="/dashboard/workouts/plans" className="btn-outline">{t('myPlans')}</Link>
          <Link href="/dashboard/workouts/sessions" className="btn-outline">{t('history')}</Link>
          <Link href="/dashboard/workouts/library" className="btn-outline">{t('library')}</Link>
          <Link href="/dashboard/workouts/analytics" className="btn-outline">{t('analytics')}</Link>
        </div>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="glass-card" style={{ marginTop: '1.5rem' }}>
        {active ? (
          <>
            <div className="form-label">{t('activePlan')}</div>
            <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>{active.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
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
            <Link href="/dashboard/workouts/templates" className="btn-primary" style={{ display: 'inline-block' }}>
              {t('browseTemplates')}
            </Link>
          </>
        )}
      </div>

      <h2 className="section-title"><i className="fa-solid fa-trophy" style={{ marginRight: 8, color: 'var(--green)' }} />{t('recentPRs')}</h2>
      {prs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('logSessionForPR')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {prs.slice(0, 5).map((pr) => (
            <div key={pr.id} className="list-card" style={{ padding: '0.75rem 1rem' }}>
              <div style={{ fontWeight: 600 }}>{pr.exercise.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {pr.recordType.replace(/_/g, ' ')} · {pr.value} {pr.unit}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title"><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 8, color: 'var(--purple)' }} />{t('recentSessions')}</h2>
      {history.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noSessionsYet')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {history.slice(0, 5).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/workouts/sessions/${s.id}`}
              className="list-card"
              style={{ color: 'inherit', display: 'block', padding: '0.75rem 1rem' }}
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
