import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { WorkoutSession, WorkoutPlan } from '@/lib/api';
import {
  completeSessionAction,
  deleteSetAction,
  logSetAction,
} from './actions';

export const dynamic = 'force-dynamic';

interface ActiveSessionData {
  session: WorkoutSession | null;
  day: WorkoutPlan['days'][number] | null;
  error: string | null;
}

async function load(id: string): Promise<ActiveSessionData> {
  try {
    const res = await authedFetch(`/workout-sessions/${id}`);
    const session = (await res.json()) as WorkoutSession & {
      day?: { id: string; plan: { id: string } } | null;
    };

    let day: ActiveSessionData['day'] = null;
    const sessionDay = session.day as
      | { id: string; plan: { id: string } }
      | null
      | undefined;
    if (sessionDay?.plan?.id) {
      const planRes = await authedFetch(`/workout-plans/${sessionDay.plan.id}`);
      const plan = (await planRes.json()) as WorkoutPlan;
      day = plan.days.find((d) => d.id === sessionDay.id) ?? null;
    }
    return { session, day, error: null };
  } catch (e) {
    return { session: null, day: null, error: (e as Error).message };
  }
}

export default async function ActiveSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const { session, day, error } = await load(params.id);
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');
  if (error) return <div className="error-banner">{error}</div>;
  if (!session) return <p style={{ color: 'var(--muted)' }}>{tc('notFound')}</p>;

  const setsByExercise = new Map<string, typeof session.sets>();
  for (const s of session.sets) {
    if (!setsByExercise.has(s.exerciseId)) setsByExercise.set(s.exerciseId, []);
    setsByExercise.get(s.exerciseId)!.push(s);
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div className="page-header">
          <h1>
            
            {day?.name ?? session.day?.name ?? t('freeformWorkout')}
          </h1>
          <p>
            {t('started', { date: session.date.slice(0, 10) })} · {t('setsLogged', { count: session.sets.length })}
          </p>
        </div>
        <form action={completeSessionAction.bind(null, session.id)}>
          <button type="submit" className="btn-success" style={{ padding: '0.6rem 1.25rem' }}>
            {t('finishWorkout')}
          </button>
        </form>
      </div>

      {!day && session.sets.length === 0 && (
        <div className="glass-card" style={{ marginTop: '1.5rem', color: 'var(--muted)' }}>
          {t('freeformNote')}
        </div>
      )}

      {!day && session.sets.length > 0 && (
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
          {[...setsByExercise.entries()].map(([exId, sets]) => (
            <div key={exId} className="glass-card">
              <div style={{ fontWeight: 600 }}>{sets[0].exercise?.name ?? exId}</div>
              {sets.map((s) => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    gap: 12,
                    fontSize: 13,
                    padding: '0.3rem 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <span style={{ width: 30, fontWeight: 600 }}>#{s.setNumber}</span>
                  <span>
                    {[
                      s.weightKg != null ? `${s.weightKg} kg` : null,
                      s.reps != null ? `${s.reps} ${t('reps').toLowerCase()}` : null,
                      s.durationSec != null ? `${s.durationSec}s` : null,
                      s.distanceKm != null ? `${s.distanceKm} km` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {(day?.exercises ?? []).map((px) => {
          const logged = setsByExercise.get(px.exerciseId) ?? [];
          const isCardio = px.exercise.isCardio;
          const nextSetNumber = logged.length + 1;
          return (
            <div key={px.id} className="glass-card">
              <div style={{ fontWeight: 600 }}>
                
                {px.exercise.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                {t('target')} {px.targetSets} x {px.targetReps ?? '?'}
                {px.targetWeightKg != null && ` @ ${px.targetWeightKg}kg`}
                {px.restSeconds != null && ` · rest ${px.restSeconds}s`}
              </div>

              <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.25rem' }}>
                {logged.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      padding: '0.4rem 0',
                      borderBottom: '1px solid var(--border)',
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 600, width: 30 }}>#{s.setNumber}</span>
                    <span>
                      {[
                        s.weightKg != null ? `${s.weightKg} kg` : null,
                        s.reps != null ? `${s.reps} ${t('reps').toLowerCase()}` : null,
                        s.durationSec != null ? `${s.durationSec}s` : null,
                        s.distanceKm != null ? `${s.distanceKm} km` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <div style={{ flex: 1 }} />
                    <form action={deleteSetAction.bind(null, session.id, s.id)}>
                      <button type="submit" className="btn-danger btn-sm">x</button>
                    </form>
                  </div>
                ))}
              </div>

              <form
                action={logSetAction.bind(null, session.id)}
                style={{
                  marginTop: '0.75rem',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <input type="hidden" name="exerciseId" value={px.exerciseId} />
                <input type="hidden" name="setNumber" value={nextSetNumber} />
                {isCardio ? (
                  <>
                    <input name="durationSec" type="number" placeholder={`${t('duration')} s`} className="input-field" style={{ width: 120 }} />
                    <input name="distanceKm" type="number" step="0.01" placeholder={`${t('distance')} km`} className="input-field" style={{ width: 120 }} />
                  </>
                ) : (
                  <>
                    <input name="weightKg" type="number" step="0.5" placeholder="kg" defaultValue={px.targetWeightKg ?? ''} className="input-field" style={{ width: 80 }} />
                    <input name="reps" type="number" placeholder={t('reps').toLowerCase()} className="input-field" style={{ width: 80 }} />
                    <input name="rpe" type="number" step="0.5" placeholder="RPE" className="input-field" style={{ width: 80 }} />
                  </>
                )}
                <button type="submit" className="btn-primary">
                  {t('logSet', { number: nextSetNumber })}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
