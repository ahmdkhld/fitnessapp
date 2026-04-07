export default function LoginPage() {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: 400, margin: '0 auto' }}>
      <h1>Sign in</h1>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <input type="email" placeholder="Email" style={inputStyle} />
        <input type="password" placeholder="Password" style={inputStyle} />
        <button type="submit" style={buttonStyle}>Continue</button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--fg)',
};

const buttonStyle: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};
