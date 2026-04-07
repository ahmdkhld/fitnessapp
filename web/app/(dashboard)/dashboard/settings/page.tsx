export default function SettingsPage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p style={{ color: 'var(--muted)' }}>
        Profile, notifications and device management.
      </p>
      <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1.5rem', maxWidth: 500 }}>
        {['Profile', 'Notifications', 'Devices', 'Export data', 'Sign out'].map(
          (label) => (
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
          ),
        )}
      </div>
    </div>
  );
}
