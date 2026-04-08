import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { createMeal, deleteMeal } from './actions';

export const dynamic = 'force-dynamic';

interface MealJson {
  id: string;
  name: string;
  scheduledTime: string;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  ingredients: { id: string; name: string; quantity: string | null }[];
}

interface PlanJson {
  id: string;
  name: string;
  goal: string | null;
  meals: MealJson[];
}

async function load(id: string): Promise<{ plan: PlanJson | null; error: string | null }> {
  try {
    const res = await authedFetch(`/diet-plans/${id}`);
    return { plan: (await res.json()) as PlanJson, error: null };
  } catch (e) {
    return { plan: null, error: (e as Error).message };
  }
}

function fmtTime(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCHours().toString().padStart(2, '0')}:${d
    .getUTCMinutes()
    .toString()
    .padStart(2, '0')}`;
}

export default async function DietPlanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { plan, error } = await load(params.id);
  const t = await getTranslations('dietPlans');
  const tc = await getTranslations('common');

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginTop: 0, marginBottom: 4, fontSize: '1.75rem', fontWeight: 700 }}>
          {plan?.name ?? t('dietPlan')}
        </h1>
        {plan?.goal && (
          <span style={{
            display: 'inline-block',
            padding: '3px 10px',
            background: 'rgba(160,32,240,0.12)',
            color: 'var(--purple)',
            borderRadius: 9999,
            fontSize: 12,
            marginTop: 4,
          }}>
            {t('goal', { goal: plan.goal })}
          </span>
        )}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Add meal form */}
      <div className="form-card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
          {t('addMeal')}
        </h3>
        <form
          action={createMeal.bind(null, params.id)}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto',
            gap: '0.5rem',
            alignItems: 'end',
          }}
        >
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              {t('mealName')}
            </label>
            <input name="name" placeholder={t('mealName')} required className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              Time
            </label>
            <input name="scheduledTime" type="time" defaultValue="08:00" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              kcal
            </label>
            <input name="calories" type="number" placeholder="kcal" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              Protein
            </label>
            <input name="proteinG" type="number" placeholder="P" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              Carbs
            </label>
            <input name="carbsG" type="number" placeholder="C" className="input-field" />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>
              Fat
            </label>
            <input name="fatG" type="number" placeholder="F" className="input-field" />
          </div>
          <button type="submit" className="btn-primary" style={{ alignSelf: 'end' }}>
            {tc('add')}
          </button>
        </form>
      </div>

      {/* Meals list */}
      {plan?.meals.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🍽</div>
          <p style={{ color: 'var(--muted)', margin: 0 }}>No meals yet. Add one above.</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {plan?.meals.map((m) => (
          <div key={m.id} className="plan-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
              {/* Meal icon */}
              <div className="icon-circle" style={{ background: 'rgba(34,197,94,0.15)' }}>
                🍽
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>
                  {fmtTime(m.scheduledTime)} &middot; {m.name}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 2 }}>
                  {[
                    m.calories != null && `${m.calories} kcal`,
                    m.proteinG != null && `P ${m.proteinG}g`,
                    m.carbsG != null && `C ${m.carbsG}g`,
                    m.fatG != null && `F ${m.fatG}g`,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
                {m.ingredients.length > 0 && (
                  <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
                    {m.ingredients
                      .map((i) => (i.quantity ? `${i.name} (${i.quantity})` : i.name))
                      .join(', ')}
                  </div>
                )}
              </div>
            </div>
            <form action={deleteMeal.bind(null, params.id, m.id)}>
              <button type="submit" className="btn-danger">
                {tc('delete')}
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
