import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { PersonalRecord } from '@/lib/api';
import {
  VolumePoint,
  WorkoutVolumeChart,
} from '@/components/WorkoutVolumeChart';

export const dynamic = 'force-dynamic';

async function load() {
  const from = new Date(Date.now() - 56 * 864e5).toISOString();
  const to = new Date().toISOString();
  try {
    const [volRes, prRes] = await Promise.all([
      authedFetch(`/workout-analytics/volume?from=${from}&to=${to}`),
      authedFetch('/workout-analytics/prs'),
    ]);
    return {
      volume: (await volRes.json()) as VolumePoint[],
      prs: (await prRes.json()) as PersonalRecord[],
      error: null as string | null,
    };
  } catch (e) {
    return { volume: [], prs: [], error: (e as Error).message };
  }
}

export default async function WorkoutAnalyticsPage() {
  const { volume, prs, error } = await load();
  const t = await getTranslations('workouts');

  const topPrs = prs.slice(0, 15);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('workoutAnalytics')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      <WorkoutVolumeChart data={volume} />

      <h2 style={{ fontSize: '1.1rem', marginTop: '2rem' }}>
        {t('recentPersonalRecords')}
      </h2>
      {topPrs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>{t('noPRsYet')}</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {topPrs.map((pr) => (
            <div
              key={pr.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{pr.exercise.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {pr.recordType.replace(/_/g, ' ')} · {pr.value} {pr.unit}
                </div>
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                {pr.achievedAt.slice(0, 10)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
