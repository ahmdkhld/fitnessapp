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

const typeIcons: Record<string, { icon: string; bg: string }> = {
  meal: { icon: '🍽', bg: 'rgba(34,197,94,0.15)' },
  workout: { icon: '💪', bg: 'rgba(0,0,255,0.15)' },
  supplement: { icon: '💊', bg: 'rgba(160,32,240,0.15)' },
  default: { icon: '📋', bg: 'rgba(169,169,169,0.15)' },
};

export default async function TimelinePage() {
  const { items, error } = await load();
  const t = await getTranslations('timeline');

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0, marginBottom: 4, fontSize: '1.75rem', fontWeight: 700 }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>{dateStr}</p>
      </div>

      {error && <div className="error-banner">{t('errorLoading', { error })}</div>}
      {!error && items.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📅</div>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{t('nothingScheduled')}</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {items.map((item) => {
          const done = item.status === 'completed';
          const skipped = item.status === 'skipped';
          const pending = !done && !skipped;
          const typeInfo = typeIcons[item.itemType] || typeIcons.default;

          return (
            <div
              key={item.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                opacity: done || skipped ? 0.55 : 1,
                borderLeft: pending ? '3px solid var(--accent)' : '1px solid var(--border)',
                boxShadow: pending ? '0 0 12px rgba(0,0,255,0.08)' : 'none',
                transition: 'transform 0.2s ease',
              }}
            >
              {/* Time column */}
              <div style={{
                minWidth: 50,
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--muted)',
                textAlign: 'center',
                flexShrink: 0,
              }}>
                {formatTime(item.scheduledTime)}
              </div>

              {/* Icon circle */}
              <div className="icon-circle" style={{ background: typeInfo.bg }}>
                {done ? '✓' : typeInfo.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 600,
                    textDecoration: done ? 'line-through' : 'none',
                    color: done ? 'var(--muted)' : 'var(--fg)',
                    fontSize: 15,
                  }}
                >
                  {item.title}
                </div>
                {item.subtitle && (
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                    {item.subtitle}
                  </div>
                )}
                <div style={{
                  fontSize: 11,
                  color: 'var(--muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginTop: 2,
                }}>
                  {item.itemType}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                {item.itemType === 'workout' && item.referenceId && !done && (
                  <form
                    action={startWorkoutFromTimeline.bind(
                      null,
                      item.referenceId,
                    )}
                  >
                    <button type="submit" className="btn-primary" aria-label={t('startWorkout')}
                      style={{ padding: '0.4rem 0.75rem', fontSize: 13 }}>
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
                    className={done ? 'btn-outline' : 'btn-success'}
                    aria-label={done ? t('markPending') : t('markCompleted')}
                  >
                    {done ? t('done') : t('complete')}
                  </button>
                </form>
                {!done && !skipped && (
                  <form action={setTimelineStatus.bind(null, item.id, 'skipped')}>
                    <button type="submit" className="btn-outline" aria-label={t('skip')}
                      style={{ color: 'var(--muted)' }}>
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
