import Link from 'next/link';

export default function HomePage() {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>NutriTrack</h1>
      <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.6 }}>
        Diet & supplement tracking with daily timelines, adherence analytics
        and coach-ready reports. Cross-platform Flutter app + web dashboard.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link
          href="/dashboard"
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--accent)',
            color: '#fff',
            borderRadius: 8,
          }}
        >
          Open dashboard
        </Link>
        <Link
          href="/login"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid var(--border)',
            borderRadius: 8,
          }}
        >
          Sign in
        </Link>
      </div>
    </main>
  );
}
