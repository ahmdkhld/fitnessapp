import { api, SupplementPlan } from '@/lib/api';
import { getToken } from '@/lib/auth';

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
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Supplements</h1>
      {error && <p style={{ color: 'var(--muted)' }}>{error}</p>}
      {plans.map((plan) => (
        <div key={plan.id} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>
            {plan.name}{' '}
            {plan.isActive && (
              <span
                style={{
                  padding: '2px 8px',
                  background: 'var(--accent)',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 11,
                  marginLeft: 8,
                }}
              >
                Active
              </span>
            )}
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem', marginTop: '1rem' }}>
            {plan.supplements.map((s) => (
              <div
                key={s.id}
                style={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  padding: '0.75rem 1rem',
                  borderRadius: 8,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{s.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                    {s.dosage ?? ''}
                  </div>
                </div>
                {s.stockQuantity != null && (
                  <div
                    style={{
                      color: s.stockQuantity < 7 ? '#e07b5f' : 'var(--muted)',
                      fontSize: 13,
                    }}
                  >
                    {s.stockQuantity} left
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
