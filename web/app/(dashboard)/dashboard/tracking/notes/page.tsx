import { authedFetch } from '@/lib/server-fetch';
import { getTranslations } from 'next-intl/server';
import { saveDailyNote } from './actions';

export const dynamic = 'force-dynamic';

async function load() {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const res = await authedFetch(`/daily-notes?date=${today}`);
    return { note: await res.json(), error: null as string | null };
  } catch (e) {
    return { note: null, error: (e as Error).message };
  }
}

export default async function DailyNotesPage() {
  const { note, error } = await load();
  const t = await getTranslations('tracking');
  const tc = await getTranslations('common');
  return (
    <div className="reveal" style={{ maxWidth: 640 }}>
      <div className="page-header">
        <h1>{t('dailyNotesTitle')}</h1>
        <p>{t('dailyNotesDesc')}</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {note?.notes && (
        <div
          className="glass-card"
          style={{
            marginBottom: '1.5rem',
            borderLeft: '3px solid var(--accent)',
            paddingLeft: 'calc(28px - 2px)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 8,
            }}
          >
            {t('latest')}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.05rem',
              lineHeight: 1.55,
            }}
          >
            {note.notes}
          </div>
        </div>
      )}

      <form action={saveDailyNote} className="form-card" style={{ display: 'grid', gap: '1.25rem' }}>
        <div className="onb-field">
          <label htmlFor="dn-mood">{t('mood')}</label>
          <input
            id="dn-mood"
            name="mood"
            type="number"
            min="1"
            max="5"
            placeholder="1–5"
            className="input-field"
            style={{ width: 140 }}
          />
        </div>
        <div className="onb-field">
          <label htmlFor="dn-symptoms">{t('symptoms')}</label>
          <input
            id="dn-symptoms"
            name="symptoms"
            placeholder='e.g. {"bloating": true}'
            className="input-field"
          />
        </div>
        <div className="onb-field">
          <label htmlFor="dn-notes">{t('notesLabel')}</label>
          <textarea
            id="dn-notes"
            name="notes"
            rows={6}
            className="input-field"
            style={{ resize: 'vertical', minHeight: 140, fontFamily: 'var(--font-body)', lineHeight: 1.55 }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ justifySelf: 'start' }}>
          {tc('save')}
        </button>
      </form>
    </div>
  );
}
