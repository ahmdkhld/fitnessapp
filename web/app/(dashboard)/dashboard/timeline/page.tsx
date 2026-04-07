import { api, ScheduleItem } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { setTimelineStatus } from './actions';

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

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Daily timeline</h1>
      {error && (
        <p style={{ color: 'var(--muted)' }}>Error loading timeline: {error}</p>
      )}
      {!error && items.length === 0 && (
        <p style={{ color: 'var(--muted)' }}>Nothing scheduled today.</p>
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
                <form
                  action={setTimelineStatus.bind(
                    null,
                    item.id,
                    done ? 'pending' : 'completed',
                  )}
                >
                  <button
                    type="submit"
                    aria-label={done ? 'Mark pending' : 'Mark completed'}
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: done ? 'var(--accent)' : 'transparent',
                      color: done ? '#fff' : 'var(--fg)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {done ? 'Done' : 'Complete'}
                  </button>
                </form>
                {!done && (
                  <form action={setTimelineStatus.bind(null, item.id, 'skipped')}>
                    <button
                      type="submit"
                      aria-label="Skip"
                      style={{
                        padding: '0.4rem 0.75rem',
                        background: 'transparent',
                        color: 'var(--muted)',
                        border: '1px solid var(--border)',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      Skip
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
