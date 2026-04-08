import Link from 'next/link';
import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { WorkoutSession } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const res = await authedFetch('/workout-sessions');
    const body = await res.json();
    return { sessions: (Array.isArray(body) ? body : (body.data ?? [])) as WorkoutSession[], error: null as string | null };
  } catch (e) {
    return { sessions: [], error: (e as Error).message };
  }
}

export default async function SessionsPage() {
  const { sessions, error } = await load();
  const t = await getTranslations('workouts');
  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-clock-rotate-left" style={{ marginRight: 10, color: 'var(--purple)' }} />{t('workoutHistory')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {sessions.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('nothingYet')}</p>}
      <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
        {sessions.map((s) => {
          const volume = s.sets.reduce(
            (sum, set) =>
              set.weightKg != null && set.reps != null
                ? sum + set.weightKg * set.reps
                : sum,
            0,
          );
          return (
            <Link
              key={s.id}
              href={`/dashboard/workouts/sessions/${s.id}`}
              className="list-card"
              style={{ color: 'inherit', display: 'block' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    <i className="fa-solid fa-dumbbell" style={{ marginRight: 8, color: 'var(--accent)', fontSize: 12 }} />
                    {s.day?.name ?? t('freeform')}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 22 }}>
                    {s.date.slice(0, 10)} · {s.sets.length} {t('sets')} ·{' '}
                    {s.durationMin ?? 0} {t('min')}
                  </div>
                </div>
                <div style={{ color: 'var(--green)', fontSize: 14, fontWeight: 600 }}>
                  {Math.round(volume)} kg
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
