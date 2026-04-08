'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);

    // Report to Sentry when available (captureException is safe to call
    // even if Sentry.init was never invoked — it simply no-ops).
    try {
      Sentry.captureException(error);
    } catch {
      // Sentry import failed or runtime issue — silent fallback
    }
  }, [error]);

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
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#3a1f1f',
            border: '1px solid #6a2a2a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: 22,
          }}
          aria-hidden="true"
        >
          !
        </div>

        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>
          Something went wrong
        </h2>

        <p
          style={{
            color: 'var(--muted)',
            fontSize: 14,
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          An unexpected error occurred while loading this page. You can try
          again, or head back to the dashboard overview.
        </p>

        {error.digest && (
          <p
            style={{
              color: 'var(--muted)',
              fontSize: 12,
              margin: '0 0 1.5rem',
              fontFamily: 'monospace',
            }}
          >
            Error ID: {error.digest}
          </p>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: 'none',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
          <a
            href="/dashboard"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--fg)',
              fontWeight: 600,
              fontSize: 14,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Go to Overview
          </a>
        </div>
      </div>
    </div>
  );
}
