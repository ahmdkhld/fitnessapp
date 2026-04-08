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

const input: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
};

export default async function BodyLogPage() {
  const { logs, error } = await load();
  const t = await getTranslations('tracking');
  const tc = await getTranslations('common');

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('bodyLogTitle')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      <form
        action={createBodyLog}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.5rem',
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        <input name="weightKg" type="number" step="0.1" placeholder={t('weightKg')} style={input} />
        <input name="waistCm" type="number" step="0.1" placeholder={t('waistCm')} style={input} />
        <input name="bodyFatPct" type="number" step="0.1" placeholder={t('bodyFatPct')} style={input} />
        <input name="energyLevel" type="number" min="1" max="5" placeholder={t('energy')} style={input} />
        <input
          name="notes"
          placeholder={t('notes')}
          style={{ ...input, gridColumn: '1 / span 3' }}
        />
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
          {tc('log')}
        </button>
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
            <div
              key={l.id}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                padding: '0.75rem 1rem',
                borderRadius: 8,
              }}
            >
              <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                {l.date.slice(0, 10)}
              </div>
              <div>{parts.join(' · ')}</div>
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
