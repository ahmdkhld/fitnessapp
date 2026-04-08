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
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          padding: '1.25rem',
          borderRadius: 10,
          marginTop: '1rem',
          marginBottom: '2rem',
        }}
      >
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>{t('createNewPlan')}</h3>
        <form
          action={createDietPlan}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <input
            name="name"
            placeholder={t('planName')}
            required
            style={{
              flex: '1 1 200px',
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <input
            name="goal"
            placeholder={t('goalOptional')}
            style={{
              flex: '1 1 200px',
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.25rem',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {tc('create')}
          </button>
        </form>
      </div>

      {plans.length === 0 && !error && (
        <p style={{ color: 'var(--muted)' }}>{t('noPlans')}</p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plans.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1rem 1.25rem',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Link
              href={`/dashboard/diet-plans/${p.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              {p.goal && (
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>{p.goal}</div>
              )}
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!p.isActive && (
                <form action={activateDietPlan.bind(null, p.id)}>
                  <button
                    type="submit"
                    style={{
                      padding: '0.4rem 0.75rem',
                      background: 'transparent',
                      color: 'var(--fg)',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      cursor: 'pointer',
                    }}
                  >
                    {tc('activate')}
                  </button>
                </form>
              )}
              {p.isActive && (
                <span
                  style={{
                    padding: '4px 10px',
                    background: 'var(--accent)',
                    color: '#fff',
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {tc('active')}
                </span>
              )}
              <form action={deleteDietPlan.bind(null, p.id)}>
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: 'transparent',
                    color: '#e07b5f',
                    border: '1px solid #6a2a2a',
                    borderRadius: 6,
                    cursor: 'pointer',
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
  );
}
