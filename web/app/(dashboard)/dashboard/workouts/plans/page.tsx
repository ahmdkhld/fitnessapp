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

export default async function WorkoutPlansPage() {
  const { plans, error } = await load();
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');
  return (
    <div>
      <div className="page-header">
        <h1>{t('myWorkoutPlans')}</h1>
      </div>
      {error && <div className="error-banner">{error}</div>}

      <div className="glass-card" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem', fontWeight: 600 }}>{t('createCustomPlan')}</h3>
        <form
          action={createWorkoutPlan}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
            gap: '0.5rem',
          }}
        >
          <input name="name" placeholder={t('dayName')} required className="input-field" />
          <input name="splitType" placeholder={t('splitPlaceholder')} className="input-field" />
          <input name="daysPerWeek" type="number" min="1" max="7" placeholder={t('daysPerWeek')} className="input-field" />
          <input name="goal" placeholder={t('goalPlaceholder')} className="input-field" />
          <button type="submit" className="btn-primary">{tc('create')}</button>
        </form>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 12 }}>
          {t('orStartFromTemplate')}{' '}
          <Link href="/dashboard/workouts/templates" style={{ color: 'var(--accent)' }}>
            {t('browseTemplates')}
          </Link>
          .
        </p>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plans.length === 0 && <p style={{ color: 'var(--muted)' }}>{t('noPlans')}</p>}
        {plans.map((p) => (
          <div key={p.id} className="plan-card">
            <Link href={`/dashboard/workouts/plans/${p.id}`} style={{ color: 'inherit' }}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                {[p.splitType, p.daysPerWeek ? `${p.daysPerWeek}x/${t('daysPerWeek')}` : null, p.goal]
                  .filter(Boolean)
                  .join(' · ')}
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {p.isActive ? (
                <span className="badge-active">{tc('active')}</span>
              ) : (
                <form action={activateWorkoutPlan.bind(null, p.id)}>
                  <button type="submit" className="btn-primary btn-sm">{tc('activate')}</button>
                </form>
              )}
              <form action={deleteWorkoutPlan.bind(null, p.id)}>
                <button type="submit" className="btn-danger btn-sm">{tc('delete')}</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
