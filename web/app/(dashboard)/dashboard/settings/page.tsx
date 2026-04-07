import { logoutAction } from './actions';

export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p style={{ color: 'var(--muted)' }}>
        Profile, notifications and device management.
      </p>
      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          marginTop: '1.5rem',
          maxWidth: 500,
        }}
      >
        {['Profile', 'Notifications', 'Devices', 'Export data'].map((label) => (
          <div
            key={label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1rem 1.25rem',
              borderRadius: 8,
            }}
          >
            {label}
          </div>
        ))}
        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              background: 'transparent',
              color: '#e07b5f',
              border: '1px solid #6a2a2a',
              borderRadius: 8,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 14,
            }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
