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
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>Build daily nutrition plans, then activate the one you&apos;re currently following.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Create form */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
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
          {t('createNewPlan')}
        </h3>
        <form
          action={createDietPlan}
          className="diet-plan-create-grid"
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
        <div className="empty-state">
          <p className="empty-state__title">{t('noPlans')}</p>
          <p className="empty-state__body">
            Create your first plan above to start logging meals against a daily target.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plans.map((p, idx) => (
          <div
            key={p.id}
            className="plan-card reveal"
            style={{
              animationDelay: `${idx * 0.05}s`,
              borderLeft: p.isActive ? '3px solid var(--accent)' : undefined,
              paddingLeft: p.isActive ? 'calc(1.25rem - 2px)' : undefined,
            }}
          >
            <Link
              href={`/dashboard/diet-plans/${p.id}`}
              style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.15rem',
                    fontWeight: 500,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {p.name}
                </div>
                {p.goal && (
                  <span
                    style={{
                      display: 'inline-block',
                      marginTop: 6,
                      fontSize: 11,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                    }}
                  >
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
