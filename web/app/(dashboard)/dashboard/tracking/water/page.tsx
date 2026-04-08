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
    <div className="reveal">
      <div className="page-header">
        <h1>{t('water')}</h1>
        <p>Tap a quick-log button to record an intake. Today&apos;s total appears at the top.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="glass-card">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              fontFeatureSettings: "'tnum'",
              lineHeight: 1,
            }}
          >
            {total}
            <span style={{ fontSize: '0.4em', color: 'var(--muted)', marginLeft: 4 }}>
              ml
            </span>
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 13 }}>
            {tc('of')} {goal} ml · {pct}%
          </span>
        </div>
        <div className="progress-track" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
        }}
      >
        {[100, 250, 500, 750].map((amt) => (
          <form key={amt} action={logWater}>
            <input type="hidden" name="amountMl" value={amt} />
            <button type="submit" className="btn-outline">
              + {amt} ml
            </button>
          </form>
        ))}
      </div>

      {day && day.logs.length > 0 && (
        <>
          <h2 className="section-title">{t('todaysLog')}</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {day.logs.map((l) => (
              <div
                key={l.id}
                className="list-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {new Date(l.loggedAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontFeatureSettings: "'tnum'",
                    color: 'var(--fg)',
                  }}
                >
                  {l.amountMl} ml
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
