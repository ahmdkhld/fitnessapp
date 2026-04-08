import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { Exercise } from '@/lib/api';
import { createExercise } from './actions';

export const dynamic = 'force-dynamic';

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
  const t = await getTranslations('workouts');
  const tc = await getTranslations('common');

  const categories = [
    { key: '', label: t('all') },
    { key: 'push', label: t('push') },
    { key: 'pull', label: t('pull') },
    { key: 'legs', label: t('legs') },
    { key: 'core', label: t('core') },
    { key: 'cardio', label: t('cardio') },
    { key: 'full_body', label: t('fullBody') },
    { key: 'mobility', label: t('mobility') },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>{t('exerciseLibrary')}</h1>
        <p>{t('exerciseCount', { count: exercises.length })}</p>
      </div>

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
          placeholder={t('searchExercises')}
          className="input-field"
          style={{ flex: '1 1 240px', width: 'auto' }}
        />
        <select name="category" defaultValue={category} className="input-field" style={{ width: 'auto', flex: 'none' }}>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">{tc('filter')}</button>
      </form>

      {error && <div className="error-banner">{error}</div>}

      <details className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
          {t('createCustomExercise')}
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
          <input name="name" placeholder={t('exerciseName')} required className="input-field" />
          <select name="category" className="input-field">
            {categories.slice(1).map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
          <input name="primaryMuscle" placeholder={t('primaryMuscle')} className="input-field" />
          <input name="equipment" placeholder={t('equipment')} className="input-field" />
          <label style={{ gridColumn: '1 / span 2', display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" name="isCardio" /> {t('cardio')}
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input type="checkbox" name="isUnilateral" /> {t('unilateral')}
          </label>
          <button type="submit" className="btn-primary">{tc('create')}</button>
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
          <div key={e.id} className="list-card">
            <div style={{ fontWeight: 600 }}>
              
              {e.name}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>
              {[e.primaryMuscle, e.equipment, e.category]
                .filter(Boolean)
                .join(' · ')}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {e.isCardio && <span className="badge-cardio">{t('cardio')}</span>}
              {e.isUnilateral && <span className="badge-unilateral">{t('unilateral')}</span>}
              {e.userId && <span className="badge-custom">{t('custom')}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
