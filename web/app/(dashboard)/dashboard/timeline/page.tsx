import { api, ScheduleItem } from '@/lib/api';
import { getToken } from '@/lib/auth';

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
        {items.map((item) => (
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
              opacity: item.status === 'completed' ? 0.6 : 1,
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
                  textDecoration:
                    item.status === 'completed' ? 'line-through' : 'none',
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
            <span
              style={{
                padding: '4px 10px',
                borderRadius: 999,
                background: 'var(--border)',
                fontSize: 12,
                textTransform: 'capitalize',
              }}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
