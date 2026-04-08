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
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>Build supplement protocols, then activate the one you&apos;re currently following.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Create plan */}
      <div className="form-card" style={{ marginBottom: '2.5rem' }}>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            marginTop: 0,
            marginBottom: '1.25rem',
            fontSize: '1.25rem',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {t('newPlan')}
        </h3>
        <form
          action={createSupplementPlan}
          style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}
        >
          <input
            name="name"
            placeholder={t('planName')}
            required
            className="input-field"
            style={{ flex: '1 1 220px' }}
          />
          <button type="submit" className="btn-primary">
            {tc('create')}
          </button>
        </form>
      </div>

      {plans.length === 0 && !error && (
        <div className="empty-state">
          <p className="empty-state__title">No supplement plans yet</p>
          <p className="empty-state__body">
            Create your first plan above, then add the supplements you take with
            their dosage and time-of-day.
          </p>
        </div>
      )}

      {plans.map((plan, planIdx) => (
        <section
          key={plan.id}
          className="reveal"
          style={{ marginBottom: '3rem', animationDelay: `${planIdx * 0.05}s` }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.85rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.65rem',
                fontWeight: 500,
                letterSpacing: '-0.015em',
                margin: 0,
              }}
            >
              {plan.name}
            </h2>
            {plan.isActive ? (
              <span className="badge-active">{tc('active')}</span>
            ) : (
              <form action={activateSupplementPlan.bind(null, plan.id)}>
                <button type="submit" className="btn-outline btn--sm">
                  {tc('activate')}
                </button>
              </form>
            )}
          </div>

          <div className="form-card" style={{ marginBottom: '1rem' }}>
            <div className="form-label" style={{ marginBottom: '0.85rem' }}>
              {t('addSupplement')}
            </div>
            <form
              action={addSupplement.bind(null, plan.id)}
              className="supplement-add-grid"
            >
              <input name="name" placeholder={t('name')} required className="input-field" />
              <input name="scheduledTime" type="time" defaultValue="08:00" className="input-field" />
              <input name="dosage" placeholder={t('dosage')} className="input-field" />
              <input name="stockQuantity" type="number" placeholder={t('stock')} className="input-field" />
              <button type="submit" className="btn-primary">{tc('add')}</button>
            </form>
          </div>

          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {plan.supplements.length === 0 ? (
              <p
                style={{
                  color: 'var(--muted)',
                  fontSize: 13,
                  margin: '0.5rem 0 0',
                  fontStyle: 'italic',
                }}
              >
                No supplements in this plan yet.
              </p>
            ) : (
              plan.supplements.map((s) => {
                const lowStock = s.stockQuantity != null && s.stockQuantity < 7;
                return (
                  <div
                    key={s.id}
                    className="list-card"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 500 }}>{s.name}</div>
                      {s.dosage && (
                        <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                          {s.dosage}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      {s.stockQuantity != null && (
                        <span
                          style={{
                            color: lowStock ? 'var(--danger)' : 'var(--muted)',
                            fontSize: 12,
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                          }}
                        >
                          {t('left', { count: s.stockQuantity })}
                        </span>
                      )}
                      <form action={deleteSupplement.bind(null, plan.id, s.id)}>
                        <button type="submit" className="btn-danger">
                          {tc('delete')}
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
