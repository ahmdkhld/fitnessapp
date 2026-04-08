import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { logWater } from './actions';

export const dynamic = 'force-dynamic';

interface WaterDay {
  totalMl: number;
  logs: { id: string; amountMl: number; loggedAt: string }[];
}

async function load(): Promise<{ day: WaterDay | null; error: string | null }> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await authedFetch(`/water?date=${today}`);
    return { day: (await res.json()) as WaterDay, error: null };
  } catch (e) {
    return { day: null, error: (e as Error).message };
  }
}

export default async function WaterPage() {
  const { day, error } = await load();
  const t = await getTranslations('tracking');
  const tc = await getTranslations('common');
  const total = day?.totalMl ?? 0;
  const goal = 2500;
  const pct = Math.min(100, Math.round((total / goal) * 100));

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('water')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '1.5rem',
          marginTop: '1rem',
        }}
      >
        <div
          style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}
        >
          <span style={{ fontSize: 20, fontWeight: 600 }}>{total} ml</span>
          <span style={{ color: 'var(--muted)' }}>{tc('of')} {goal} ml</span>
        </div>
        <div
          style={{
            height: 12,
            background: 'var(--border)',
            borderRadius: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${pct}%`,
              height: '100%',
              background: 'var(--accent)',
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[100, 250, 500, 750].map((amt) => (
          <form key={amt} action={logWater}>
            <input type="hidden" name="amountMl" value={amt} />
            <button
              type="submit"
              style={{
                padding: '0.6rem 1rem',
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              +{amt} ml
            </button>
          </form>
        ))}
      </div>

      {day && day.logs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>{t('todaysLog')}</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {day.logs.map((l) => (
              <li
                key={l.id}
                style={{
                  padding: '0.5rem 0',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {new Date(l.loggedAt).toLocaleTimeString()} — {l.amountMl} ml
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
