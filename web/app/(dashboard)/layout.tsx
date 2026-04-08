import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { MobileNav } from '@/components/MobileNav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

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

async function DesktopNavLinks() {
  const t = await getTranslations('nav');

  return (
    <nav className="topnav-links" aria-label={t('sections')}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href} className="topnav-link">
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}

async function MobileNavLinks() {
  const t = await getTranslations('nav');

  return (
    <>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          {t(item.labelKey)}
        </Link>
      ))}
    </>
  );
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('common');

  return (
    <div style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      {/* -- Top Navigation Bar -- */}
      <header className="topnav">
        {/* Logo */}
        <Link href="/dashboard" className="topnav-logo">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6.5 6.5a2 2 0 0 1 3 0l.5.5.5-.5a2 2 0 0 1 3 0 2 2 0 0 1 0 3L10 13l-3.5-3.5a2 2 0 0 1 0-3z" />
            <line x1="6" y1="12" x2="6" y2="19" />
            <line x1="18" y1="12" x2="18" y2="19" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="6" y2="7" />
            <line x1="18" y1="7" x2="22" y2="7" />
            <line x1="2" y1="17" x2="6" y2="17" />
            <line x1="18" y1="17" x2="22" y2="17" />
          </svg>
          <span>{t('appName')}</span>
        </Link>

        {/* Desktop horizontal nav links */}
        <DesktopNavLinks />

        {/* Right actions: theme toggle, language switcher, notification bell, avatar */}
        <div className="topnav-actions">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link href="/dashboard/notifications" className="topnav-icon-btn" aria-label="Notifications">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </Link>
          <Link href="/dashboard/settings" className="topnav-avatar" aria-label="User profile">
            U
          </Link>
        </div>

        {/* Mobile hamburger (visible only on mobile via CSS) */}
        <MobileNav>
          <MobileNavLinks />
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </MobileNav>
      </header>

      {/* -- Main content area -- */}
      <main
        className="dashboard-main dashboard-content"
        style={{
          flex: 1,
          maxWidth: '100%',
          overflowX: 'hidden',
        }}
      >
        {children}
      </main>
    </div>
  );
}
