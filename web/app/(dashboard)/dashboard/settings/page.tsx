import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { logoutAction } from './actions';
import { Card, Button } from '@/components/ui';

export default async function SettingsPage() {
  const t = await getTranslations('settings');

  const settingsLinks: { label: string; href: string | null }[] = [
    { label: t('profile'), href: '/dashboard/profile' },
    { label: t('changePassword'), href: '/dashboard/settings/change-password' },
    { label: t('notifications'), href: '/dashboard/notifications' },
    { label: t('devices'), href: null },
    { label: t('exportData'), href: '/dashboard/export' },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>{t('title')}</h1>
      <p style={{ color: 'var(--muted)' }}>
        {t('description')}
      </p>
      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          marginTop: '1.5rem',
          maxWidth: 500,
        }}
      >
        {settingsLinks.map(({ label, href }) =>
          href ? (
            <Link
              key={label}
              href={href}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Card padding="1rem 1.25rem" style={{ borderRadius: 8 }}>
                {label}
              </Card>
            </Link>
          ) : (
            <Card key={label} padding="1rem 1.25rem" style={{ borderRadius: 8 }}>
              {label}
            </Card>
          ),
        )}
        <form action={logoutAction}>
          <Button type="submit" variant="danger" fullWidth style={{ textAlign: 'left' }}>
            {t('signOut')}
          </Button>
        </form>
      </div>
    </div>
  );
}
