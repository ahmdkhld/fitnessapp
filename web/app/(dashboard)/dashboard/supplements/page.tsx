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
      <div className="page-header">
        <h1>{t('title')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 600 }}>{t('newPlan')}</h3>
        <form action={createSupplementPlan} style={{ display: 'flex', gap: '0.5rem' }}>
          <input name="name" placeholder={t('planName')} required className="input-field" style={{ flex: 1 }} />
          <button type="submit" className="btn-primary">{tc('create')}</button>
        </form>
      </div>

      {plans.map((plan) => (
        <div key={plan.id} style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>
              {plan.name}
            </h2>
            {plan.isActive ? (
              <span className="badge-active">{tc('active')}</span>
            ) : (
              <form action={activateSupplementPlan.bind(null, plan.id)}>
                <button type="submit" className="btn-primary btn-sm">
                  {tc('activate')}
                </button>
              </form>
            )}
          </div>

          <div className="glass-card">
            <h3 style={{ marginTop: 0, fontSize: 14, fontWeight: 600 }}>{t('addSupplement')}</h3>
            <form
              action={addSupplement.bind(null, plan.id)}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                gap: '0.5rem',
              }}
            >
              <input name="name" placeholder={t('name')} required className="input-field" />
              <input name="scheduledTime" type="time" defaultValue="08:00" className="input-field" />
              <input name="dosage" placeholder={t('dosage')} className="input-field" />
              <input name="stockQuantity" type="number" placeholder={t('stock')} className="input-field" />
              <button type="submit" className="btn-primary">{tc('add')}</button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            {plan.supplements.map((s) => (
              <div key={s.id} className="list-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, marginLeft: 22 }}>
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
                    <button type="submit" className="btn-danger btn-sm">
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
