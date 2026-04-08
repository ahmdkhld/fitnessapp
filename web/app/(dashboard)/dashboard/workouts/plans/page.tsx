import Link from 'next/link';
import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { WorkoutPlan } from '@/lib/api';
import {
  activateWorkoutPlan,
  createWorkoutPlan,
  deleteWorkoutPlan,
} from './actions';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const res = await authedFetch('/workout-plans');
    return { plans: (await res.json()) as WorkoutPlan[], error: null as string | null };
  } catch (e) {
    return { plans: [], error: (e as Error).message };
  }
}

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

export default async function WorkoutPlansPage() {
  const { plans, error } = await load();
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('myWorkoutPlans')}</h1>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

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
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>{t('createCustomPlan')}</h3>
        <form
          action={createWorkoutPlan}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: '0.5rem',
          }}
        >
          <input name="name" placeholder={t('dayName')} required style={input} />
          <input name="splitType" placeholder={t('splitPlaceholder')} style={input} />
          <input
            name="daysPerWeek"
            type="number"
            min="1"
            max="7"
            placeholder={t('daysPerWeek')}
            style={input}
          />
          <input name="goal" placeholder={t('goalPlaceholder')} style={input} />
          <button type="submit" style={button}>{tc('create')}</button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>
          {t('orStartFromTemplate')}{' '}
          <Link
            href="/dashboard/workouts/templates"
            style={{ color: 'var(--accent)' }}
          >
            {t('browseTemplates')}
          </Link>
          .
        </p>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plans.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noPlans')}</p>}
        {plans.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1rem 1.25rem',
              borderRadius: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link
              href={`/dashboard/workouts/plans/${p.id}`}
              style={{ color: 'inherit' }}
            >
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {[p.splitType, p.daysPerWeek ? `${p.daysPerWeek}x/${t('daysPerWeek')}` : null, p.goal]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {p.isActive ? (
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
              ) : (
                <form action={activateWorkoutPlan.bind(null, p.id)}>
                  <button type="submit" style={{ ...button, padding: '0.4rem 0.75rem' }}>
                    {tc('activate')}
                  </button>
                </form>
              )}
              <form action={deleteWorkoutPlan.bind(null, p.id)}>
                <button
                  type="submit"
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: 'transparent',
                    color: '#e07b5f',
                    border: '1px solid #6a2a2a',
                    borderRadius: 6,
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
