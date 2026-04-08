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
      <div className="page-header">
        <h1>{plan?.name ?? t('workoutPlan')}</h1>
        {plan && (
          <p>
            {[plan.splitType, `${plan.daysPerWeek ?? '-'} ${t('daysPerWeek')}`, plan.goal]
              .filter(Boolean)
              .join(' · ')}
          </p>
        )}
      </div>
      {error && <div className="error-banner">{error}</div>}
      {plan && (
        <>
          <form
            action={addDay.bind(null, plan.id)}
            className="glass-card"
            style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', marginBottom: '1.5rem' }}
          >
            <input name="name" placeholder={t('dayName')} required className="input-field" style={{ flex: 1 }} />
            <select name="dayOfWeek" className="input-field" style={{ width: 'auto', flex: 'none' }}>
              <option value="">{t('flexible')}</option>
              <option value="1">Mon</option>
              <option value="2">Tue</option>
              <option value="3">Wed</option>
              <option value="4">Thu</option>
              <option value="5">Fri</option>
              <option value="6">Sat</option>
              <option value="7">Sun</option>
            </select>
            <button type="submit" className="btn-primary">{t('addDay')}</button>
          </form>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {plan.days.map((d) => (
              <div key={d.id} className="glass-card" style={{ borderRadius: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{d.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                      {[
                        dayName(d.dayOfWeek),
                        d.estimatedDurationMin ? `${d.estimatedDurationMin} ${t('min')}` : null,
                        `${d.exercises.length} ${t('exercises')}`,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <form action={startSession.bind(null, d.id)}>
                      <button type="submit" className="btn-success">
                        <i className="fa-solid fa-play" style={{ marginRight: 6 }} />{tc('start')}
                      </button>
                    </form>
                    <form action={removeDay.bind(null, plan.id, d.id)}>
                      <button type="submit" className="btn-danger">{t('removeDay')}</button>
                    </form>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', display: 'grid', gap: '0.25rem' }}>
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
                          {e.progressionKg > 0 && ` · +${e.progressionKg}kg auto`}
                        </div>
                      </div>
                      <form action={removeDayExercise.bind(null, plan.id, e.id)}>
                        <button type="submit" className="btn-danger btn-sm">x</button>
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
                  <select name="exerciseId" required className="input-field">
                    <option value="">{t('pickExercise')}</option>
                    {library.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                  <input name="targetSets" type="number" placeholder={t('sets')} defaultValue={3} className="input-field" />
                  <input name="targetReps" placeholder={t('reps')} defaultValue="8-12" className="input-field" />
                  <input name="targetWeightKg" type="number" step="0.5" placeholder="kg" className="input-field" />
                  <input name="restSeconds" type="number" placeholder="Rest s" defaultValue={90} className="input-field" />
                  <input name="supersetGroup" placeholder="SS" maxLength={2} className="input-field" />
                  <input name="progressionKg" type="number" step="0.5" placeholder="+kg" className="input-field" />
                  <button type="submit" className="btn-primary">{tc('add')}</button>
                </form>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
