import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function DashboardNotFound() {
  const t = await getTranslations('errors');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '2.5rem 2rem',
          maxWidth: 480,
          width: '100%',
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: 'var(--muted)',
            marginBottom: '0.5rem',
          }}
        >
          404
        </div>

        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
          {t('pageNotFound')}
        </h2>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          {t('pageNotFoundDesc')}
        </p>

        <Link
          href="/dashboard"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.25rem',
            borderRadius: 8,
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 14,
            textDecoration: 'none',
          }}
        >
          {t('backToOverview')}
        </Link>
      </div>
    </div>
  );
}
