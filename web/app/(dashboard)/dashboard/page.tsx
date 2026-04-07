export default function DashboardOverviewPage() {
  const cards = [
    { label: 'Adherence (7d)', value: '87%' },
    { label: 'Current streak', value: '12 days' },
    { label: 'Meals today', value: '3/5' },
    { label: 'Supplements today', value: '6/8' },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Overview</h1>
      <p style={{ color: 'var(--muted)' }}>
        Snapshot of today's adherence and progress.
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        {cards.map((c) => (
          <div
            key={c.label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              padding: '1.25rem',
              borderRadius: 12,
            }}
          >
            <div style={{ color: 'var(--muted)', fontSize: 13 }}>{c.label}</div>
            <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>
              {c.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
