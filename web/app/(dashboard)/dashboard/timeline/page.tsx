import { api, ScheduleItem } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { setTimelineStatus, startWorkoutFromTimeline } from './actions';

export const dynamic = 'force-dynamic';

async function load(): Promise<{ items: ScheduleItem[]; error: string | null }> {
  const token = getToken();
  if (!token) return { items: [], error: 'Not signed in' };
  const today = new Date().toISOString().slice(0, 10);
  try {
    return { items: await api.schedule(token, today), error: null };
  } catch (e) {
    return { items: [], error: (e as Error).message };
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export default async function TimelinePage() {
  const { items, error } = await load();
  const t = await getTranslations('timeline');

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      {error && (
        <p style={{ color: 'var(--muted)' }}>{t('errorLoading', { error })}</p>
      )}
      {!error && items.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>{t('nothingScheduled')}</p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
        {items.map((item) => {
          const done = item.status === 'completed';
          const skipped = item.status === 'skipped';
          return (
            <div
              key={item.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                padding: '1rem 1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: done || skipped ? 0.6 : 1,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                  }}
                >
                  {formatTime(item.scheduledTime)} · {item.itemType}
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    textDecoration: done ? 'line-through' : 'none',
                  }}
                >
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {item.subtitle}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {item.itemType === 'workout' && item.referenceId && !done && (
                  <form
                    action={startWorkoutFromTimeline.bind(
                      null,
                      item.referenceId,
                    )}
                  >
                    <button
                      type="submit"
                      aria-label={t('startWorkout')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'var(--accent)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      {t('startWorkout')}
                    </button>
                  </form>
                )}
                <form
                  action={setTimelineStatus.bind(
                    null,
                    item.id,
                    done ? 'pending' : 'completed',
                  )}
                >
                  <button
                    type="submit"
                    aria-label={done ? t('markPending') : t('markCompleted')}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: done ? 'var(--accent)' : 'transparent',
                      color: done ? '#fff' : 'var(--fg)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {done ? t('done') : t('complete')}
                  </button>
                </form>
                {!done && (
                  <form action={setTimelineStatus.bind(null, item.id, 'skipped')}>
                    <button
                      type="submit"
                      aria-label={t('skip')}
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'transparent',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      {t('skip')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
