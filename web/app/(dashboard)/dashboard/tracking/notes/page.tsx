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
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-note-sticky" style={{ marginRight: 10, color: 'var(--purple)' }} />{t('dailyNotesTitle')}</h1>
        <p>{t('dailyNotesDesc')}</p>
      </div>
      {error && <div className="error-banner">{error}</div>}
      {note?.notes && (
        <div className="glass-card" style={{ marginTop: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-label" style={{ marginBottom: 4 }}>{t('latest')}</div>
          <div>{note.notes}</div>
        </div>
      )}

      <form action={saveDailyNote} className="glass-card" style={{ display: 'grid', gap: '1rem' }}>
        <div>
          <label className="form-label">{t('mood')}</label>
          <input
            name="mood"
            type="number"
            min="1"
            max="5"
            className="input-field"
            style={{ marginTop: 4, width: 120 }}
          />
        </div>
        <div>
          <label className="form-label">{t('symptoms')}</label>
          <input
            name="symptoms"
            placeholder='e.g. {"bloating": true}'
            className="input-field"
            style={{ marginTop: 4 }}
          />
        </div>
        <div>
          <label className="form-label">{t('notesLabel')}</label>
          <textarea
            name="notes"
            rows={5}
            className="input-field"
            style={{ marginTop: 4, resize: 'vertical' }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ justifySelf: 'start' }}>
          <i className="fa-solid fa-floppy-disk" style={{ marginRight: 6 }} />{tc('save')}
        </button>
      </form>
    </div>
  );
}
