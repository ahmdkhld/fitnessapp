import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { Exercise, WorkoutPlan } from '@/lib/api';
import {
  addDay,
  addExerciseToDay,
  removeDay,
  removeDayExercise,
  startSession,
} from './actions';

export const dynamic = 'force-dynamic';

async function load(id: string) {
  try {
    const [planRes, libraryRes] = await Promise.all([
      authedFetch(`/workout-plans/${id}`),
      authedFetch('/exercises'),
    ]);
    return {
      plan: (await planRes.json()) as WorkoutPlan,
      library: (await libraryRes.json()) as Exercise[],
      error: null as string | null,
    };
  } catch (e) {
    return { plan: null, library: [], error: (e as Error).message };
  }
}

const dayName = (d: number | null) =>
  d == null ? 'Flexible' : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][d - 1];

const input: React.CSSProperties = {
  padding: '0.5rem 0.6rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
  fontSize: 13,
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

export default async function WorkoutPlanDetail({
  params,
}: {
  params: { id: string };
}) {
  const { plan, library, error } = await load(params.id);
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{plan?.name ?? t('workoutPlan')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      {plan && (
        <>
          <p style={{ color: 'var(--muted)' }}>
            {[plan.splitType, `${plan.daysPerWeek ?? '-'} ${t('daysPerWeek')}`, plan.goal]
              .filter(Boolean)
              .join(' · ')}
          </p>

          <form
            action={addDay.bind(null, plan.id)}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1rem',
              borderRadius: 10,
              display: 'flex',
              gap: '0.5rem',
              marginTop: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <input name="name" placeholder={t('dayName')} required style={input} />
            <select name="dayOfWeek" style={input}>
              <option value="">{t('flexible')}</option>
              <option value="1">Mon</option>
              <option value="2">Tue</option>
              <option value="3">Wed</option>
              <option value="4">Thu</option>
              <option value="5">Fri</option>
              <option value="6">Sat</option>
              <option value="7">Sun</option>
            </select>
            <button type="submit" style={button}>
              {t('addDay')}
            </button>
          </form>

          <div style={{ display: 'grid', gap: '1rem' }}>
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
                          ? `${d.estimatedDurationMin} ${t('min')}`
                          : null,
                        `${d.exercises.length} ${t('exercises')}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <form action={startSession.bind(null, d.id)}>
                      <button type="submit" style={button}>
                        {tc('start')}
                      </button>
                    </form>
                    <form action={removeDay.bind(null, plan.id, d.id)}>
                      <button
                        type="submit"
                        style={{
                          ...button,
                          background: 'transparent',
                          color: '#e07b5f',
                          border: '1px solid #6a2a2a',
                        }}
                      >
                        {t('removeDay')}
                      </button>
                    </form>
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'grid',
                    gap: '0.25rem',
                  }}
                >
                  {d.exercises.map((e) => (
                    <div
                      key={e.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <div>
                        <div>{e.exercise.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                          {e.targetSets}x{e.targetReps ?? '?'}
                          {e.targetWeightKg != null && ` @ ${e.targetWeightKg}kg`}
                          {e.restSeconds != null && ` · rest ${e.restSeconds}s`}
                          {e.supersetGroup && ` · SS ${e.supersetGroup}`}
                          {e.progressionKg > 0 &&
                            ` · +${e.progressionKg}kg auto`}
                        </div>
                      </div>
                      <form
                        action={removeDayExercise.bind(null, plan.id, e.id)}
                      >
                        <button
                          type="submit"
                          style={{
                            padding: '4px 10px',
                            background: 'transparent',
                            color: '#e07b5f',
                            border: '1px solid #6a2a2a',
                            borderRadius: 6,
                            fontSize: 12,
                            cursor: 'pointer',
                          }}
                        >
                          x
                        </button>
                      </form>
                    </div>
                  ))}
                </div>

                <form
                  action={addExerciseToDay.bind(null, plan.id, d.id)}
                  style={{
                    marginTop: '0.75rem',
                    display: 'grid',
                    gridTemplateColumns: '2fr 60px 80px 80px 80px 60px 80px auto',
                    gap: '0.5rem',
                  }}
                >
                  <select name="exerciseId" required style={input}>
                    <option value="">{t('pickExercise')}</option>
                    {library.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.name}
                      </option>
                    ))}
                  </select>
                  <input
                    name="targetSets"
                    type="number"
                    placeholder={t('sets')}
                    defaultValue={3}
                    style={input}
                  />
                  <input
                    name="targetReps"
                    placeholder={t('reps')}
                    defaultValue="8-12"
                    style={input}
                  />
                  <input
                    name="targetWeightKg"
                    type="number"
                    step="0.5"
                    placeholder="kg"
                    style={input}
                  />
                  <input
                    name="restSeconds"
                    type="number"
                    placeholder="Rest s"
                    defaultValue={90}
                    style={input}
                  />
                  <input
                    name="supersetGroup"
                    placeholder="SS"
                    maxLength={2}
                    style={input}
                  />
                  <input
                    name="progressionKg"
                    type="number"
                    step="0.5"
                    placeholder="+kg"
                    style={input}
                  />
                  <button type="submit" style={button}>
                    {tc('add')}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
