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
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>Your active plan, recent records, and session history.</p>
      </div>

      {/* Sub-nav pills */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          marginTop: '-1rem',
        }}
      >
        <Link href="/dashboard/workouts/templates" className="btn-outline">{t('templates')}</Link>
        <Link href="/dashboard/workouts/plans" className="btn-outline">{t('myPlans')}</Link>
        <Link href="/dashboard/workouts/sessions" className="btn-outline">{t('history')}</Link>
        <Link href="/dashboard/workouts/library" className="btn-outline">{t('library')}</Link>
        <Link href="/dashboard/workouts/analytics" className="btn-outline">{t('analytics')}</Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Active plan callout */}
      {active ? (
        <div className="glass-card">
          <div className="form-label">{t('activePlan')}</div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              marginTop: 6,
              color: 'var(--fg)',
            }}
          >
            {active.name}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>
            {[active.splitType, `${active.daysPerWeek} ${t('daysPerWeek')}`, active.goal]
              .filter(Boolean)
              .join(' · ')}
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-state__title">{t('noActivePlan')}</p>
          <p className="empty-state__body">
            Pick a starter template, then customize the days and exercises to match your week.
          </p>
          <Link
            href="/dashboard/workouts/templates"
            className="btn-primary empty-state__cta"
          >
            {t('browseTemplates')}
          </Link>
        </div>
      )}

      {/* Recent PRs */}
      <h2 className="section-title">{t('recentPRs')}</h2>
      {prs.length === 0 ? (
        <p style={{ color: 'var(--muted)', margin: 0 }}>{t('logSessionForPR')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {prs.slice(0, 5).map((pr) => (
            <div key={pr.id} className="list-card">
              <div style={{ fontWeight: 500 }}>{pr.exercise.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                {pr.recordType.replace(/_/g, ' ')} ·{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    color: 'var(--fg)',
                    fontFeatureSettings: "'tnum'",
                  }}
                >
                  {pr.value} {pr.unit}
                </span>
              </div>
            </div>
          ))}
          {prs.length > 5 && (
            <Link
              href="/dashboard/workouts/analytics"
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                marginTop: 4,
                textAlign: 'right',
              }}
            >
              View all PRs →
            </Link>
          )}
        </div>
      )}

      {/* Recent sessions */}
      <h2 className="section-title">{t('recentSessions')}</h2>
      {history.length === 0 ? (
        <p style={{ color: 'var(--muted)', margin: 0 }}>{t('noSessionsYet')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {history.slice(0, 5).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/workouts/sessions/${s.id}`}
              className="list-card"
              style={{ color: 'inherit', display: 'block', textDecoration: 'none' }}
            >
              <div style={{ fontWeight: 500 }}>{s.day?.name ?? t('freeform')}</div>
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 13,
                  marginTop: 2,
                  fontFeatureSettings: "'tnum'",
                }}
              >
                {s.date.slice(0, 10)} · {s.sets.length} {t('sets')} · {s.durationMin ?? 0} {t('min')}
              </div>
            </Link>
          ))}
          {history.length > 5 && (
            <Link
              href="/dashboard/workouts/sessions"
              style={{
                fontSize: 13,
                color: 'var(--muted)',
                marginTop: 4,
                textAlign: 'right',
              }}
            >
              View all sessions →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
