import Link from 'next/link';

const nav = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/timeline', label: 'Timeline' },
  { href: '/dashboard/diet-plans', label: 'Diet plans' },
  { href: '/dashboard/supplements', label: 'Supplements' },
  { href: '/dashboard/tracking/water', label: 'Water' },
  { href: '/dashboard/tracking/body', label: 'Body log' },
  { href: '/dashboard/tracking/notes', label: 'Notes' },
  { href: '/dashboard/analytics', label: 'Insights' },
  { href: '/dashboard/import', label: 'Import' },
  { href: '/dashboard/export', label: 'Coach report' },
  { href: '/dashboard/notifications', label: 'Notifications' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside
        aria-label="Primary navigation"
        style={{
          width: 240,
          background: 'var(--card)',
          borderRight: '1px solid var(--border)',
          padding: '2rem 1rem',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>NutriTrack</h2>
        <nav aria-label="Sections" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: '0.5rem 0.75rem',
                borderRadius: 6,
                color: 'var(--fg)',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
}
