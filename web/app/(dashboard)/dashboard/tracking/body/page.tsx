import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { createBodyLog } from './actions';

export const dynamic = 'force-dynamic';

interface BodyLog {
  id: string;
  date: string;
  weightKg: number | null;
  waistCm: number | null;
  bodyFatPct: number | null;
  energyLevel: number | null;
  notes: string | null;
}

async function load(): Promise<{ logs: BodyLog[]; error: string | null }> {
  try {
    const res = await authedFetch('/body-logs');
    return { logs: (await res.json()) as BodyLog[], error: null };
  } catch (e) {
    return { logs: [], error: (e as Error).message };
  }
}

export default async function BodyLogPage() {
  const { logs, error } = await load();
  const t = await getTranslations('tracking');
  const tc = await getTranslations('common');

  return (
    <div className="reveal">
      <div className="page-header">
        <h1>{t('bodyLogTitle')}</h1>
        <p>Weight, waist, body-fat and energy — log what you measure, leave the rest blank.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form action={createBodyLog} className="form-card body-log-grid">
        <div className="onb-field">
          <label htmlFor="bl-weight">{t('weightKg')}</label>
          <input
            id="bl-weight"
            name="weightKg"
            type="number"
            step="0.1"
            placeholder="75.0"
            className="input-field"
          />
        </div>
        <div className="onb-field">
          <label htmlFor="bl-waist">{t('waistCm')}</label>
          <input
            id="bl-waist"
            name="waistCm"
            type="number"
            step="0.1"
            placeholder="80.0"
            className="input-field"
          />
        </div>
        <div className="onb-field">
          <label htmlFor="bl-bf">{t('bodyFatPct')}</label>
          <input
            id="bl-bf"
            name="bodyFatPct"
            type="number"
            step="0.1"
            placeholder="15.0"
            className="input-field"
          />
        </div>
        <div className="onb-field">
          <label htmlFor="bl-energy">{t('energy')}</label>
          <input
            id="bl-energy"
            name="energyLevel"
            type="number"
            min="1"
            max="5"
            placeholder="1–5"
            className="input-field"
          />
        </div>
        <div className="onb-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="bl-notes">{t('notes')}</label>
          <input
            id="bl-notes"
            name="notes"
            placeholder={t('notes')}
            className="input-field"
          />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">
            {tc('log')}
          </button>
        </div>
      </form>

      {logs.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <p className="empty-state__title">No entries yet</p>
          <p className="empty-state__body">
            Log your first measurement above. We&apos;ll start charting trends after a few days.
          </p>
        </div>
      ) : (
        <>
          <h2 className="section-title">History</h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {logs.map((l, idx) => {
              const parts = [
                l.weightKg != null && `${l.weightKg} kg`,
                l.waistCm != null && `waist ${l.waistCm} cm`,
                l.bodyFatPct != null && `bf ${l.bodyFatPct}%`,
                l.energyLevel != null && `energy ${l.energyLevel}/5`,
              ].filter(Boolean);
              return (
                <div
                  key={l.id}
                  className="list-card reveal"
                  style={{ animationDelay: `${idx * 0.04}s` }}
                >
                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: 11,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      fontWeight: 500,
                    }}
                  >
                    {l.date.slice(0, 10)}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.05rem',
                      marginTop: 4,
                      fontFeatureSettings: "'tnum'",
                    }}
                  >
                    {parts.join(' · ')}
                  </div>
                  {l.notes && (
                    <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 6 }}>
                      {l.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
