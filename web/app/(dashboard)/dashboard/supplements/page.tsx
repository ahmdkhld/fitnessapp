import { api, SupplementPlan } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import {
  activateSupplementPlan,
  addSupplement,
  createSupplementPlan,
  deleteSupplement,
} from './actions';

export const dynamic = 'force-dynamic';

async function load(): Promise<{ plans: SupplementPlan[]; error: string | null }> {
  const token = getToken();
  if (!token) return { plans: [], error: 'Not signed in' };
  try {
    return { plans: await api.supplementPlans(token), error: null };
  } catch (e) {
    return { plans: [], error: (e as Error).message };
  }
}

export default async function SupplementsPage() {
  const { plans, error } = await load();
  const t = await getTranslations('supplements');
  const tc = await getTranslations('common');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}

      <div style={card}>
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>{t('newPlan')}</h3>
        <form action={createSupplementPlan} style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="name" placeholder={t('planName')} required style={input} />
          <button type="submit" style={button}>{tc('create')}</button>
        </form>
      </div>

      {plans.map((plan) => (
        <div key={plan.id} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            {plan.name}
            {plan.isActive ? (
              <span style={pill}>{tc('active')}</span>
            ) : (
              <form action={activateSupplementPlan.bind(null, plan.id)}>
                <button
                  type="submit"
                  style={{ ...button, padding: '4px 10px', fontSize: 12 }}
                >
                  {tc('activate')}
                </button>
              </form>
            )}
          </h2>

          <div style={card}>
            <h3 style={{ marginTop: 0, fontSize: 14 }}>{t('addSupplement')}</h3>
            <form
              action={addSupplement.bind(null, plan.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '0.5rem',
              }}
            >
              <input name="name" placeholder={t('name')} required style={input} />
              <input name="scheduledTime" type="time" defaultValue="08:00" style={input} />
              <input name="dosage" placeholder={t('dosage')} style={input} />
              <input name="stockQuantity" type="number" placeholder={t('stock')} style={input} />
              <button type="submit" style={button}>{tc('add')}</button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            {plan.supplements.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {s.dosage ?? ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {s.stockQuantity != null && (
                    <span
                      style={{
                        color: s.stockQuantity < 7 ? '#e07b5f' : 'var(--muted)',
                        fontSize: 13,
                      }}
                    >
                      {t('left', { count: s.stockQuantity })}
                    </span>
                  )}
                  <form action={deleteSupplement.bind(null, plan.id, s.id)}>
                    <button
                      type="submit"
                      style={{
                        ...button,
                        background: 'transparent',
                        color: '#e07b5f',
                        border: '1px solid #6a2a2a',
                        padding: '4px 10px',
                        fontSize: 12,
                      }}
                    >
                      {tc('delete')}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.25rem',
  borderRadius: 10,
  marginTop: '1rem',
  marginBottom: '1.5rem',
};

const input: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
};

const button: React.CSSProperties = {
  padding: '0.6rem 1rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

const pill: React.CSSProperties = {
  padding: '2px 8px',
  background: 'var(--accent)',
  color: '#fff',
  borderRadius: 999,
  fontSize: 11,
};
