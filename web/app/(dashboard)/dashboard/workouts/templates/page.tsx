import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
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

export default async function TemplatesPage() {
  const { templates, error } = await load();
  const t = await getTranslations('workouts');
  return (
    <div>
      <div className="page-header">
        <h1>{t('planTemplates')}</h1>
        <p>{t('clonedTemplatesDesc')}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      <div style={{ display: 'grid', gap: '1rem', marginTop: '1.5rem' }}>
        {templates.map((tmpl) => (
          <div key={tmpl.id} className="glass-card" style={{ borderRadius: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{tmpl.name}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  {[tmpl.splitType, `${tmpl.daysPerWeek}x/${t('daysPerWeek')}`, tmpl.goal]
                    .filter(Boolean)
                    .join(' · ')}
                </div>
              </div>
              <form action={cloneTemplateAction.bind(null, tmpl.id)}>
                <button type="submit" className="btn-primary">
                  <i className="fa-solid fa-copy" style={{ marginRight: 6 }} />{t('useThisPlan')}
                </button>
              </form>
            </div>
            {tmpl.description && (
              <p style={{ color: 'var(--muted)', marginTop: '0.75rem' }}>
                {tmpl.description}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
              {tmpl.days.map((d) => (
                <span key={d.id} className="btn-outline" style={{ cursor: 'default' }}>
                  {d.name} · {d.exercises.length} {t('exercises')}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
