import { getTranslations } from 'next-intl/server';
import { updateNotifications } from './actions';

export default async function NotificationSettingsPage() {
  const t = await getTranslations('notifications');
  const tc = await getTranslations('common');

  const checkboxes: [string, string, string][] = [
    ['pushEnabled', t('pushEnabled'), 'fa-solid fa-bell'],
    ['mealReminder', t('mealReminder'), 'fa-solid fa-utensils'],
    ['supplementReminder', t('supplementReminder'), 'fa-solid fa-pills'],
    ['waterReminder', t('waterReminder'), 'fa-solid fa-droplet'],
    ['overdueReminder', t('overdueReminder'), 'fa-solid fa-clock'],
  ];

  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-bell" style={{ marginRight: 10, color: 'var(--purple)' }} />{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <form
        action={updateNotifications}
        className="glass-card"
        style={{
          marginTop: '1rem',
          display: 'grid',
          gap: '0.75rem',
          maxWidth: 500,
        }}
      >
        {checkboxes.map(([name, label, icon]) => (
          <label key={name} className="checkbox-label">
            <input type="checkbox" name={name} defaultChecked />
            <i className={icon} style={{ color: 'var(--muted)', width: 20, textAlign: 'center' }} />
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
          <i className="fa-solid fa-floppy-disk" style={{ marginRight: 6 }} />{tc('save')}
        </button>
      </form>
    </div>
  );
}
