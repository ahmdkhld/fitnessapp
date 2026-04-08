import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from './actions';

export default async function SettingsPage() {
  const t = await getTranslations('settings');

  const settingsLinks: { label: string; href: string | null; icon: string }[] = [
    { label: t('profile'), href: '/dashboard/profile', icon: 'fa-solid fa-user' },
    { label: t('changePassword'), href: '/dashboard/settings/change-password', icon: 'fa-solid fa-key' },
    { label: t('notifications'), href: '/dashboard/notifications', icon: 'fa-solid fa-bell' },
    { label: t('devices'), href: null, icon: 'fa-solid fa-mobile-screen' },
    { label: t('exportData'), href: '/dashboard/export', icon: 'fa-solid fa-file-export' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1><i className="fa-solid fa-gear" style={{ marginRight: 10, color: 'var(--muted)' }} />{t('title')}</h1>
        <p>{t('description')}</p>
      </div>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem', maxWidth: 500 }}>
        {settingsLinks.map(({ label, href, icon }) =>
          href ? (
            <Link
              key={label}
              href={href}
              className="list-card"
              style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <i className={icon} style={{ color: 'var(--muted)', width: 20, textAlign: 'center' }} />
              <span>{label}</span>
            </Link>
          ) : (
            <div key={label} className="list-card" style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: 0.5 }}>
              <i className={icon} style={{ color: 'var(--muted)', width: 20, textAlign: 'center' }} />
              <span>{label}</span>
            </div>
          ),
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className="btn-danger"
            style={{ width: '100%', textAlign: 'left', padding: '0.9rem 1.1rem', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}
          >
            <i className="fa-solid fa-right-from-bracket" style={{ width: 20, textAlign: 'center' }} />
            {t('signOut')}
          </button>
        </form>
      </div>
    </div>
  );
}
