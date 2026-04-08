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

const input: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--fg)',
};

export default async function DailyNotesPage() {
  const { note, error } = await load();
  const t = await getTranslations('tracking');
  const tc = await getTranslations('common');
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('dailyNotesTitle')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('dailyNotesDesc')}
      </p>
      {error && <p style={{ color: '#e07b5f' }}>{error}</p>}
      {note?.notes && (
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            padding: '1rem 1.25rem',
            borderRadius: 10,
            marginTop: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t('latest')}</div>
          <div>{note.notes}</div>
        </div>
      )}

      <form
        action={saveDailyNote}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          padding: '1.25rem',
          borderRadius: 10,
          display: 'grid',
          gap: '0.75rem',
        }}
      >
        <label>
          {t('mood')}
          <input
            name="mood"
            type="number"
            min="1"
            max="5"
            style={{ ...input, display: 'block', marginTop: 4, width: 120 }}
          />
        </label>
        <label>
          {t('symptoms')}
          <input
            name="symptoms"
            placeholder='e.g. {"bloating": true}'
            style={{ ...input, display: 'block', marginTop: 4, width: '100%' }}
          />
        </label>
        <label>
          {t('notesLabel')}
          <textarea
            name="notes"
            rows={5}
            style={{ ...input, display: 'block', marginTop: 4, width: '100%' }}
          />
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
            justifySelf: 'start',
          }}
        >
          {tc('save')}
        </button>
      </form>
    </div>
  );
}
