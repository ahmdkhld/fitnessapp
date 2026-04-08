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
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <form
        action={updateNotifications}
        className="glass-card"
        style={{
          display: 'grid',
          gap: '0.5rem',
          maxWidth: 520,
        }}
      >
        {checkboxes.map(([name, label]) => (
          <label key={name} className="checkbox-label">
            <input type="checkbox" name={name} defaultChecked />
            <span>{label}</span>
          </label>
        ))}
        <div style={{ marginTop: '0.5rem' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: 6 }}>
            {t('advanceMinutes')}
          </label>
          <input
            name="advanceMinutes"
            type="number"
            min="0"
            max="60"
            defaultValue={5}
            className="input-field"
            style={{ width: 120 }}
          />
        </div>
        <button type="submit" className="btn-primary" style={{ justifySelf: 'start', marginTop: '0.5rem' }}>
          {tc('save')}
        </button>
      </form>
    </div>
  );
}
