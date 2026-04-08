import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MobileNav } from '@/components/MobileNav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

type NavItem = { href: string; labelKey: string };

const navItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'overview' },
  { href: '/dashboard/timeline', labelKey: 'timeline' },
  { href: '/dashboard/diet-plans', labelKey: 'dietPlans' },
  { href: '/dashboard/supplements', labelKey: 'supplements' },
  { href: '/dashboard/workouts', labelKey: 'workouts' },
  { href: '/dashboard/tracking/water', labelKey: 'water' },
  { href: '/dashboard/tracking/body', labelKey: 'bodyLog' },
  { href: '/dashboard/tracking/notes', labelKey: 'notes' },
  { href: '/dashboard/analytics', labelKey: 'insights' },
  { href: '/dashboard/import', labelKey: 'import' },
  { href: '/dashboard/export', labelKey: 'coachReport' },
  { href: '/dashboard/notifications', labelKey: 'notifications' },
  { href: '/dashboard/coach', labelKey: 'coachPortal' },
  { href: '/dashboard/admin', labelKey: 'admin' },
  { href: '/dashboard/settings', labelKey: 'settings' },
];

async function NavLinks() {
  const t = await getTranslations('nav');

  return (
    <nav
      aria-label={t('sections')}
      style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: 6,
            color: 'var(--fg)',
          }}
        >
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('common');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* -- Desktop sidebar (hidden on mobile via CSS) -- */}
      <aside
        className="desktop-sidebar"
        aria-label="Primary navigation"
        style={{
          width: 240,
          flexShrink: 0,
          background: 'var(--card)',
          borderRight: '1px solid var(--border)',
          padding: '2rem 1rem',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>{t('appName')}</h2>
        <NavLinks />
        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* -- Mobile hamburger + drawer (hidden on desktop via CSS) -- */}
      <MobileNav>
        <h2 style={{ marginBottom: '1.5rem' }}>{t('appName')}</h2>
        <NavLinks />
        <div style={{ marginTop: '1.5rem' }}>
          <LanguageSwitcher />
        </div>
      </MobileNav>

      {/* -- Main content area -- */}
      <main
        className="dashboard-main"
        style={{
          flex: 1,
          padding: '2rem',
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  );
}
