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
      <div className="page-header">
        <h1><i className="fa-solid fa-droplet" style={{ marginRight: 10, color: '#3b82f6' }} />{t('water')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="glass-card" style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 24, fontWeight: 700 }}>{total} ml</span>
          <span style={{ color: 'var(--muted)', alignSelf: 'flex-end' }}>{tc('of')} {goal} ml</span>
        </div>
        <div className="progress-track" style={{ height: 12 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ textAlign: 'right', marginTop: 4, color: 'var(--muted)', fontSize: 13 }}>
          {pct}%
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {[100, 250, 500, 750].map((amt) => (
          <form key={amt} action={logWater}>
            <input type="hidden" name="amountMl" value={amt} />
            <button type="submit" className="btn-primary">
              <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />+{amt} ml
            </button>
          </form>
        ))}
      </div>

      {day && day.logs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 className="section-title">{t('todaysLog')}</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {day.logs.map((l) => (
              <div key={l.id} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--muted)', fontSize: 13 }}>
                  {new Date(l.loggedAt).toLocaleTimeString()}
                </span>
                <span style={{ fontWeight: 600, color: '#3b82f6' }}>
                  <i className="fa-solid fa-droplet" style={{ marginRight: 6, fontSize: 11 }} />{l.amountMl} ml
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
