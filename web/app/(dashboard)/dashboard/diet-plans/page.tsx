import { api, DietPlan } from '@/lib/api';
import { getToken } from '@/lib/auth';

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
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Diet plans</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}
      {plans.length === 0 && !error && (
        <p style={{ color: 'var(--muted)' }}>
          No plans yet. Use the import page to upload one.
        </p>
      )}
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem' }}>
        {plans.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1rem 1.25rem',
              borderRadius: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 600 }}>{p.name}</div>
                {p.goal && (
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {p.goal}
                  </div>
                )}
              </div>
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
                  Active
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
