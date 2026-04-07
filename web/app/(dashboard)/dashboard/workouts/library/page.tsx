import { authedFetch } from '@/lib/server-fetch';
import { Exercise } from '@/lib/api';
import { createExercise } from './actions';

export const dynamic = 'force-dynamic';

const categories = [
  { key: '', label: 'All' },
  { key: 'push', label: 'Push' },
  { key: 'pull', label: 'Pull' },
  { key: 'legs', label: 'Legs' },
  { key: 'core', label: 'Core' },
  { key: 'cardio', label: 'Cardio' },
  { key: 'full_body', label: 'Full body' },
  { key: 'mobility', label: 'Mobility' },
];

async function load(category: string, search: string) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (search) params.set('search', search);
  try {
    const res = await authedFetch(`/exercises?${params.toString()}`);
    return { exercises: (await res.json()) as Exercise[], error: null as string | null };
  } catch (e) {
    return { exercises: [], error: (e as Error).message };
  }
}

export default async function ExerciseLibraryPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const category = searchParams.category ?? '';
  const search = searchParams.search ?? '';
  const { exercises, error } = await load(category, search);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Exercise library</h1>
      <p style={{ color: 'var(--muted)' }}>
        {exercises.length} exercises · browse, filter and search the built-in
        library plus any custom exercises you've created.
      </p>

      <form
        method="get"
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <input
          name="search"
          defaultValue={search}
          placeholder="Search exercises"
          style={{
            flex: '1 1 240px',
            padding: '0.6rem 0.75rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--fg)',
          }}
        />
        <select
          name="category"
          defaultValue={category}
          style={{
            padding: '0.6rem 0.75rem',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--fg)',
          }}
        >
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>
        <button
          type="submit"
          style={{
            padding: '0.6rem 1rem',
            background: 'var(--accent)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
          }}
        >
          Filter
        </button>
      </form>

      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}

      <details
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          padding: '1rem',
          borderRadius: 10,
          marginBottom: '1.5rem',
        }}
      >
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
          + Create custom exercise
        </summary>
        <form
          action={createExercise}
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '0.5rem',
            marginTop: '0.75rem',
            alignItems: 'end',
          }}
        >
          <input
            name="name"
            placeholder="Exercise name"
            required
            style={{
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <select
            name="category"
            style={{
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          >
            {categories.slice(1).map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            name="primaryMuscle"
            placeholder="Primary muscle"
            style={{
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <input
            name="equipment"
            placeholder="Equipment"
            style={{
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
            }}
          />
          <label
            style={{
              gridColumn: '1 / span 2',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <input type="checkbox" name="isCardio" /> Cardio
          </label>
          <label
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <input type="checkbox" name="isUnilateral" /> Unilateral
          </label>
          <button
            type="submit"
            style={{
              padding: '0.6rem 1rem',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            Create
          </button>
        </form>
      </details>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {exercises.map((e) => (
          <div
            key={e.id}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '0.9rem 1rem',
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>{e.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
              {[e.primaryMuscle, e.equipment, e.category]
                .filter(Boolean)
                .join(' · ')}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {e.isCardio && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: '#1e3a44',
                    color: '#6ad1e0',
                    borderRadius: 999,
                  }}
                >
                  cardio
                </span>
              )}
              {e.isUnilateral && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: '#3a2a1f',
                    color: '#e0a66a',
                    borderRadius: 999,
                  }}
                >
                  unilateral
                </span>
              )}
              {e.userId && (
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 8px',
                    background: '#2a3a1f',
                    color: '#a8e06a',
                    borderRadius: 999,
                  }}
                >
                  custom
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
