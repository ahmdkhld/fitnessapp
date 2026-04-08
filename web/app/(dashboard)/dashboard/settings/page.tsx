import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from './actions';

interface SettingItem {
  label: string;
  href: string | null;
  description: string;
  status?: 'soon';
}

export default async function SettingsPage() {
  const t = await getTranslations('settings');

  const settingsLinks: SettingItem[] = [
    {
      label: t('profile'),
      href: '/dashboard/profile',
      description: 'Personal info, units, time zone.',
    },
    {
      label: t('changePassword'),
      href: '/dashboard/settings/change-password',
      description: 'Update the password used to sign in.',
    },
    {
      label: t('notifications'),
      href: '/dashboard/notifications',
      description: 'Reminder schedules and push devices.',
    },
    {
      label: t('devices'),
      href: null,
      description: 'Sign out of other browsers and phones.',
      status: 'soon',
    },
    {
      label: t('exportData'),
      href: '/dashboard/export',
      description: 'Download a coach-ready PDF report.',
    },
  ];

  return (
    <div className="reveal">
      <div className="page-header">
        <h1>{t('title')}</h1>
        <p>{t('description')}</p>
      </div>

      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 560 }}>
        {settingsLinks.map(({ label, href, description, status }, idx) => {
          const inner = (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span style={{ fontWeight: 500, fontSize: 15 }}>{label}</span>
                {status === 'soon' && (
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 999,
                      padding: '2px 8px',
                    }}
                  >
                    Coming soon
                  </span>
                )}
              </div>
              <div
                style={{
                  color: 'var(--muted)',
                  fontSize: 13,
                  marginTop: 4,
                }}
              >
                {description}
              </div>
            </>
          );

          if (href) {
            return (
              <Link
                key={label}
                href={href}
                className="list-card reveal"
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  animationDelay: `${idx * 0.05}s`,
                }}
              >
                {inner}
              </Link>
            );
          }
          return (
            <div
              key={label}
              className="list-card reveal"
              style={{
                animationDelay: `${idx * 0.05}s`,
                cursor: 'not-allowed',
              }}
            >
              {inner}
            </div>
          );
        })}

        <form action={logoutAction} style={{ marginTop: '1rem' }}>
          <button
            type="submit"
            className="btn-danger"
            style={{
              width: '100%',
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {t('signOut')}
          </button>
        </form>
      </div>
    </div>
  );
}
