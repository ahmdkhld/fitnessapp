import { getTranslations } from 'next-intl/server';
import { updateNotifications } from './actions';

export default async function NotificationSettingsPage() {
  const t = await getTranslations('notifications');
  const tc = await getTranslations('common');

  const checkboxes: [string, string][] = [
    ['pushEnabled', t('pushEnabled')],
    ['mealReminder', t('mealReminder')],
    ['supplementReminder', t('supplementReminder')],
    ['waterReminder', t('waterReminder')],
    ['overdueReminder', t('overdueReminder')],
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('description')}
      </p>
      <form
        action={updateNotifications}
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '1.5rem',
          marginTop: '1rem',
          display: 'grid',
          gap: '1rem',
          maxWidth: 500,
        }}
      >
        {checkboxes.map(([name, label]) => (
          <label
            key={name}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <input type="checkbox" name={name} defaultChecked />
            <span>{label}</span>
          </label>
        ))}
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {t('advanceMinutes')}
          <input
            name="advanceMinutes"
            type="number"
            min="0"
            max="60"
            defaultValue={5}
            style={{
              padding: '0.6rem 0.75rem',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              color: 'var(--fg)',
              width: 120,
            }}
          />
        </label>
        <button
          type="submit"
          style={{
            padding: '0.6rem 1.25rem',
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
