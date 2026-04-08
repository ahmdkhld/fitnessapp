import Link from 'next/link';
import { api, DietPlan } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';
import { activateDietPlan, createDietPlan, deleteDietPlan } from './actions';

export const dynamic = 'force-dynamic';

async function load(): Promise<{ plans: DietPlan[]; error: string | null }> {
  const token = getToken();
  if (!token) return { plans: [], error: 'Not signed in' };
  try {
    return { plans: await api.dietPlans(token), error: null };
  } catch (e) {
    return { plans: [], error: (e as Error).message };
  }
}

export default async function DietPlansPage() {
  const { plans, error } = await load();
  const t = await getTranslations('dietPlans');
  const tc = await getTranslations('common');

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0, marginBottom: 4, fontSize: '1.75rem', fontWeight: 700 }}>
          {t('title')}
        </h1>
        <p style={{ color: 'var(--muted)', margin: 0, fontSize: 14 }}>
          {t('createNewPlan')}
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Create form */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
          {t('createNewPlan')}
        </h3>
        <form
          action={createDietPlan}
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '0.75rem', alignItems: 'end' }}
        >
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              {t('planName')}
            </label>
            <input
              name="name"
              placeholder={t('planName')}
              required
              className="input-field"
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              {t('goalOptional')}
            </label>
            <input
              name="goal"
              placeholder={t('goalOptional')}
              className="input-field"
            />
          </div>
          <button type="submit" className="btn-primary">
            {tc('create')}
          </button>
        </form>
      </div>

      {/* Plans list */}
      {plans.length === 0 && !error && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽</div>
          <p style={{ color: 'var(--muted)', margin: 0 }}>{t('noPlans')}</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plans.map((p) => (
          <div
            key={p.id}
            className="plan-card"
            style={{
              borderLeft: p.isActive ? '3px solid var(--accent)' : undefined,
              boxShadow: p.isActive ? '0 0 12px rgba(0,0,255,0.08)' : undefined,
            }}
          >
            <Link
              href={`/dashboard/diet-plans/${p.id}`}
              style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}
            >
              {/* Icon circle */}
              <div className="icon-circle" style={{ background: 'rgba(34,197,94,0.15)' }}>
                🥗
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{p.name}</div>
                {p.goal && (
                  <span style={{
                    display: 'inline-block',
                    marginTop: 4,
                    padding: '2px 8px',
                    background: 'rgba(160,32,240,0.12)',
                    color: 'var(--purple)',
                    borderRadius: 9999,
                    fontSize: 11,
                  }}>
                    {p.goal}
                  </span>
                )}
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
              {p.isActive && <span className="badge-active">{tc('active')}</span>}
              {!p.isActive && (
                <form action={activateDietPlan.bind(null, p.id)}>
                  <button type="submit" className="btn-outline">
                    {tc('activate')}
                  </button>
                </form>
              )}
              <form action={deleteDietPlan.bind(null, p.id)}>
                <button type="submit" className="btn-danger">
                  {tc('delete')}
                </button>
              </form>
              {/* Chevron right */}
              <Link href={`/dashboard/diet-plans/${p.id}`} style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1 }}>
                ›
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
