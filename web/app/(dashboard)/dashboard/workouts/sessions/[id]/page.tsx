import { authedFetch } from '@/lib/server-fetch';
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
  if (error) return <p style={{ color: '#e07b5f' }}>{error}</p>;
  if (!session) return <p>Not found</p>;

  const byExercise = new Map<string, WorkoutSession['sets']>();
  for (const s of session.sets) {
    if (!byExercise.has(s.exerciseId)) byExercise.set(s.exerciseId, []);
    byExercise.get(s.exerciseId)!.push(s);
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{session.day?.name ?? 'Freeform workout'}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {session.date.slice(0, 10)} · {session.durationMin ?? 0} min ·{' '}
        {session.sets.length} sets
      </p>
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {[...byExercise.entries()].map(([exId, sets]) => (
          <div
            key={exId}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              borderRadius: 10,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {sets[0].exercise?.name ?? exId}
            </div>
            <table style={{ width: '100%', marginTop: 8, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ color: 'var(--muted)', fontSize: 12 }}>
                  <th style={{ textAlign: 'left' }}>#</th>
                  <th style={{ textAlign: 'left' }}>Weight</th>
                  <th style={{ textAlign: 'left' }}>Reps</th>
                  <th style={{ textAlign: 'left' }}>Duration</th>
                  <th style={{ textAlign: 'left' }}>Distance</th>
                </tr>
              </thead>
              <tbody>
                {sets.map((s) => (
                  <tr key={s.id}>
                    <td>{s.setNumber}</td>
                    <td>{s.weightKg != null ? `${s.weightKg} kg` : '—'}</td>
                    <td>{s.reps ?? '—'}</td>
                    <td>{s.durationSec != null ? `${s.durationSec}s` : '—'}</td>
                    <td>{s.distanceKm != null ? `${s.distanceKm} km` : '—'}</td>
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
