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
    <div>
      <div className="page-header">
        <h1>{t('bodyLogTitle')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <form
        action={createBodyLog}
        className="glass-card"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.75rem',
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        <div>
          <label className="form-label">{t('weightKg')}</label>
          <input name="weightKg" type="number" step="0.1" placeholder={t('weightKg')} className="input-field" style={{ marginTop: 4 }} />
        </div>
        <div>
          <label className="form-label">{t('waistCm')}</label>
          <input name="waistCm" type="number" step="0.1" placeholder={t('waistCm')} className="input-field" style={{ marginTop: 4 }} />
        </div>
        <div>
          <label className="form-label">{t('bodyFatPct')}</label>
          <input name="bodyFatPct" type="number" step="0.1" placeholder={t('bodyFatPct')} className="input-field" style={{ marginTop: 4 }} />
        </div>
        <div>
          <label className="form-label">{t('energy')}</label>
          <input name="energyLevel" type="number" min="1" max="5" placeholder={t('energy')} className="input-field" style={{ marginTop: 4 }} />
        </div>
        <div style={{ gridColumn: '1 / span 3' }}>
          <label className="form-label">{t('notes')}</label>
          <input name="notes" placeholder={t('notes')} className="input-field" style={{ marginTop: 4 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>{tc('log')}</button>
        </div>
      </form>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {logs.map((l) => {
          const parts = [
            l.weightKg != null && `${l.weightKg} kg`,
            l.waistCm != null && `waist ${l.waistCm} cm`,
            l.bodyFatPct != null && `bf ${l.bodyFatPct}%`,
            l.energyLevel != null && `energy ${l.energyLevel}/5`,
          ].filter(Boolean);
          return (
            <div key={l.id} className="list-card">
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                {l.date.slice(0, 10)}
              </div>
              <div style={{ fontWeight: 500, marginTop: 2 }}>{parts.join(' · ')}</div>
              {l.notes && (
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  {l.notes}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
