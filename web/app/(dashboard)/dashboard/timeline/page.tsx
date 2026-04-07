export default function TimelinePage() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Daily timeline</h1>
      <p style={{ color: 'var(--muted)' }}>
        Timeline view will fetch from <code>GET /api/schedule?date=...</code>
      </p>
    </div>
  );
}
