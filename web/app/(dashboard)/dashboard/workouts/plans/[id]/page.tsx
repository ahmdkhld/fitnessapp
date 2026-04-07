import { authedFetch } from '@/lib/server-fetch';
import { WorkoutPlan } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function load(id: string) {
  try {
    const res = await authedFetch(`/workout-plans/${id}`);
    return { plan: (await res.json()) as WorkoutPlan, error: null as string | null };
  } catch (e) {
    return { plan: null, error: (e as Error).message };
  }
}

const dayName = (d: number | null) =>
  d == null ? '' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1];

export default async function WorkoutPlanDetail({
  params,
}: {
  params: { id: string };
}) {
  const { plan, error } = await load(params.id);
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{plan?.name ?? 'Workout plan'}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      {plan && (
        <>
          <p style={{ color: 'var(--muted)' }}>
            {[plan.splitType, `${plan.daysPerWeek ?? '-'} days/week`, plan.goal]
              .filter(Boolean)
              .join(' · ')}
          </p>
          <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
            {plan.days.map((d) => (
              <div
                key={d.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '1.25rem',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>
                      {d.name}
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {[
                        dayName(d.dayOfWeek),
                        d.estimatedDurationMin
                          ? `${d.estimatedDurationMin} min`
                          : null,
                        `${d.exercises.length} exercises`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.25rem' }}>
                  {d.exercises.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div>{e.exercise.name}</div>
                      <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                        {e.targetSets}×{e.targetReps ?? '?'}
                        {e.targetWeightKg != null && ` @ ${e.targetWeightKg}kg`}
                        {e.restSeconds != null && ` · rest ${e.restSeconds}s`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
