import Link from 'next/link';
import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { WorkoutSession } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const res = await authedFetch('/workout-sessions');
    return { sessions: (await res.json()) as WorkoutSession[], error: null as string | null };
  } catch (e) {
    return { sessions: [], error: (e as Error).message };
  }
}

export default async function SessionsPage() {
  const { sessions, error } = await load();
  const t = await getTranslations('workouts');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('workoutHistory')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
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
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '1rem 1.25rem',
                borderRadius: 10,
                color: 'inherit',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {s.day?.name ?? t('freeform')}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {s.date.slice(0, 10)} · {s.sets.length} {t('sets')} ·{' '}
                    {s.durationMin ?? 0} {t('min')}
                  </div>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
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
