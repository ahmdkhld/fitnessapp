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
  meal: { icon: '🍽', bg: 'var(--success-bg)' },
  workout: { icon: '💪', bg: 'var(--info-bg)' },
  supplement: { icon: '💊', bg: 'rgba(92, 84, 121, 0.12)' },
  default: { icon: '📋', bg: 'var(--hover-overlay)' },
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
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>{dateStr}</p>
      </div>

      {error && <div className="error-banner">{t('errorLoading', { error })}</div>}
      {!error && items.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__title">{t('nothingScheduled')}</p>
          <p className="empty-state__body">
            Schedule meals, supplements, or workouts and they&apos;ll appear here.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.85rem' }}>
        {items.map((item, idx) => {
          const done = item.status === 'completed';
          const skipped = item.status === 'skipped';
          const typeInfo = typeIcons[item.itemType] || typeIcons.default;
          const muted = done || skipped;

          return (
            <div
              key={item.id}
              className="timeline-card reveal"
              style={{
                animationDelay: `${idx * 0.04}s`,
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                paddingLeft: '1.5rem',
              }}
            >
              {/* Time column */}
              <div
                style={{
                  minWidth: 56,
                  fontFamily: 'var(--font-display)',
                  fontSize: 18,
                  fontFeatureSettings: "'tnum'",
                  color: muted ? 'var(--muted)' : 'var(--fg)',
                  flexShrink: 0,
                }}
              >
                {formatTime(item.scheduledTime)}
              </div>

              {/* Icon circle */}
              <div
                className="icon-circle"
                style={{
                  background: done ? 'var(--hover-overlay)' : typeInfo.bg,
                  color: done ? 'var(--success)' : 'var(--fg)',
                  width: 42,
                  height: 42,
                }}
                aria-hidden="true"
              >
                {done ? '✓' : typeInfo.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 500,
                    textDecoration: done ? 'line-through' : 'none',
                    textDecorationColor: 'var(--muted)',
                    color: muted ? 'var(--muted)' : 'var(--fg)',
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
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {item.itemType}
                  {skipped && ' · skipped'}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                {item.itemType === 'workout' && item.referenceId && !done && (
                  <form
                    action={startWorkoutFromTimeline.bind(null, item.referenceId)}
                  >
                    <button
                      type="submit"
                      className="btn-primary btn--sm"
                      aria-label={t('startWorkout')}
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
                    className="btn-outline btn--sm"
                    aria-label={done ? t('markPending') : t('markCompleted')}
                  >
                    {done ? t('done') : t('complete')}
                  </button>
                </form>
                {!done && !skipped && (
                  <form action={setTimelineStatus.bind(null, item.id, 'skipped')}>
                    <button
                      type="submit"
                      className="btn-outline btn--sm"
                      style={{ color: 'var(--muted)' }}
                      aria-label={t('skip')}
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
