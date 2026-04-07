import { authedFetch } from '@/lib/server-fetch';
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

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{plan?.name ?? 'Diet plan'}</h1>
      {plan?.goal && <p style={{ color: 'var(--muted)' }}>Goal: {plan.goal}</p>}
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
        <h3 style={{ marginTop: 0, fontSize: '1rem' }}>Add meal</h3>
        <form
          action={createMeal.bind(null, params.id)}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1fr auto',
            gap: '0.5rem',
            alignItems: 'end',
          }}
        >
          <input name="name" placeholder="Meal name" required style={input} />
          <input name="scheduledTime" type="time" defaultValue="08:00" style={input} />
          <input name="calories" type="number" placeholder="kcal" style={input} />
          <input name="proteinG" type="number" placeholder="P" style={input} />
          <input name="carbsG" type="number" placeholder="C" style={input} />
          <input name="fatG" type="number" placeholder="F" style={input} />
          <button type="submit" style={button}>
            Add
          </button>
        </form>
      </div>

      <div style={{ display: 'grid', gap: '0.5rem' }}>
        {plan?.meals.map((m) => (
          <div
            key={m.id}
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
            <div>
              <div style={{ fontWeight: 600 }}>
                {fmtTime(m.scheduledTime)} · {m.name}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
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
            <form action={deleteMeal.bind(null, params.id, m.id)}>
              <button
                type="submit"
                style={{
                  ...button,
                  background: 'transparent',
                  color: '#e07b5f',
                  border: '1px solid #6a2a2a',
                }}
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
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
