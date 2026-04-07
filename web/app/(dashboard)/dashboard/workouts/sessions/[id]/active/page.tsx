import { authedFetch } from '@/lib/server-fetch';
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

    // If the session is tied to a workout day, load the parent plan so we
    // can render the prescribed exercise list with targets.
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

const input: React.CSSProperties = {
  padding: '0.45rem 0.55rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
  fontSize: 13,
  width: '80px',
};

const button: React.CSSProperties = {
  padding: '0.5rem 0.85rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontSize: 13,
};

export default async function ActiveSessionPage({
  params,
}: {
  params: { id: string };
}) {
  const { session, day, error } = await load(params.id);
  if (error) return <p style={{ color: '#e07b5f' }}>{error}</p>;
  if (!session) return <p>Not found</p>;

  const setsByExercise = new Map<string, typeof session.sets>();
  for (const s of session.sets) {
    if (!setsByExercise.has(s.exerciseId)) setsByExercise.set(s.exerciseId, []);
    setsByExercise.get(s.exerciseId)!.push(s);
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h1 style={{ marginTop: 0 }}>
          {day?.name ?? session.day?.name ?? 'Freeform workout'}
        </h1>
        <form action={completeSessionAction.bind(null, session.id)}>
          <button type="submit" style={button}>
            Finish workout
          </button>
        </form>
      </div>
      <p style={{ color: 'var(--muted)' }}>
        Started {session.date.slice(0, 10)} · {session.sets.length} sets logged
      </p>

      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {(day?.exercises ?? []).map((px) => {
          const logged = setsByExercise.get(px.exerciseId) ?? [];
          const isCardio = px.exercise.isCardio;
          const nextSetNumber = logged.length + 1;
          return (
            <div
              key={px.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '1rem 1.25rem',
                borderRadius: 10,
              }}
            >
              <div style={{ fontWeight: 600 }}>{px.exercise.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                Target {px.targetSets} × {px.targetReps ?? '?'}
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
                    <span style={{ fontWeight: 600, width: 30 }}>
                      #{s.setNumber}
                    </span>
                    <span>
                      {[
                        s.weightKg != null ? `${s.weightKg} kg` : null,
                        s.reps != null ? `${s.reps} reps` : null,
                        s.durationSec != null ? `${s.durationSec}s` : null,
                        s.distanceKm != null ? `${s.distanceKm} km` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                    <div style={{ flex: 1 }} />
                    <form action={deleteSetAction.bind(null, session.id, s.id)}>
                      <button
                        type="submit"
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#e07b5f',
                          cursor: 'pointer',
                        }}
                      >
                        ×
                      </button>
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
                    <input
                      name="durationSec"
                      type="number"
                      placeholder="Duration s"
                      style={{ ...input, width: 120 }}
                    />
                    <input
                      name="distanceKm"
                      type="number"
                      step="0.01"
                      placeholder="Distance km"
                      style={{ ...input, width: 120 }}
                    />
                  </>
                ) : (
                  <>
                    <input
                      name="weightKg"
                      type="number"
                      step="0.5"
                      placeholder="kg"
                      defaultValue={px.targetWeightKg ?? ''}
                      style={input}
                    />
                    <input
                      name="reps"
                      type="number"
                      placeholder="reps"
                      style={input}
                    />
                    <input
                      name="rpe"
                      type="number"
                      step="0.5"
                      placeholder="RPE"
                      style={input}
                    />
                  </>
                )}
                <button type="submit" style={button}>
                  Log set #{nextSetNumber}
                </button>
              </form>
            </div>
          );
        })}
      </div>
    </div>
  );
}
