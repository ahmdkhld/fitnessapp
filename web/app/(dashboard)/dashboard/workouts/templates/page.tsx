import { authedFetch } from '@/lib/server-fetch';
import { WorkoutPlan } from '@/lib/api';
import { cloneTemplateAction } from '../plans/actions';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const res = await authedFetch('/workout-plans/templates');
    return {
      templates: (await res.json()) as WorkoutPlan[],
      error: null as string | null,
    };
  } catch (e) {
    return { templates: [], error: (e as Error).message };
  }
}

const card: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  padding: '1.5rem',
  borderRadius: 12,
};

const button: React.CSSProperties = {
  padding: '0.6rem 1.25rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
};

export default async function TemplatesPage() {
  const { templates, error } = await load();
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Plan templates</h1>
      <p style={{ color: 'var(--muted)' }}>
        Cloned templates are copied into your personal plans and can be edited freely.
      </p>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {templates.map((t) => (
          <div key={t.id} style={card}>
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{t.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  {[t.splitType, `${t.daysPerWeek}×/week`, t.goal]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
              <form action={cloneTemplateAction.bind(null, t.id)}>
                <button type="submit" style={button}>
                  Use this plan
                </button>
              </form>
            </div>
            {t.description && (
              <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
                {t.description}
              </p>
            )}
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                marginTop: '0.75rem',
              }}
            >
              {t.days.map((d) => (
                <span
                  key={d.id}
                  style={{
                    padding: '3px 10px',
                    border: '1px solid var(--border)',
                    borderRadius: 999,
                    fontSize: 12,
                  }}
                >
                  {d.name} · {d.exercises.length} ex
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
