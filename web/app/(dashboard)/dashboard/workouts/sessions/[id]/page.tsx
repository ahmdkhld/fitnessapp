import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { WorkoutSession } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function load(id: string) {
  try {
    const res = await authedFetch(`/workout-sessions/${id}`);
    return { session: (await res.json()) as WorkoutSession, error: null as string | null };
  } catch (e) {
    return { session: null, error: (e as Error).message };
  }
}

export default async function SessionDetail({
  params,
}: {
  params: { id: string };
}) {
  const { session, error } = await load(params.id);
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');
  if (error) return <div className="error-banner">{error}</div>;
  if (!session) return <p style={{ color: 'var(--muted)' }}>{tc('notFound')}</p>;

  const byExercise = new Map<string, WorkoutSession['sets']>();
  for (const s of session.sets) {
    if (!byExercise.has(s.exerciseId)) byExercise.set(s.exerciseId, []);
    byExercise.get(s.exerciseId)!.push(s);
  }

  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-dumbbell" style={{ marginRight: 10, color: 'var(--accent)' }} />{session.day?.name ?? t('freeformWorkout')}</h1>
        <p>
          {session.date.slice(0, 10)} · {session.durationMin ?? 0} {t('min')} ·{' '}
          {session.sets.length} {t('sets')}
        </p>
      </div>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {[...byExercise.entries()].map(([exId, sets]) => (
          <div key={exId} className="glass-card">
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              {sets[0].exercise?.name ?? exId}
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t('weight')}</th>
                  <th>{t('reps')}</th>
                  <th>{t('duration')}</th>
                  <th>{t('distance')}</th>
                </tr>
              </thead>
              <tbody>
                {sets.map((s) => (
                  <tr key={s.id}>
                    <td>{s.setNumber}</td>
                    <td>{s.weightKg != null ? `${s.weightKg} kg` : '\u2014'}</td>
                    <td>{s.reps ?? '\u2014'}</td>
                    <td>{s.durationSec != null ? `${s.durationSec}s` : '\u2014'}</td>
                    <td>{s.distanceKm != null ? `${s.distanceKm} km` : '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
