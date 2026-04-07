import { redirect } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { setTokenCookie } from '@/lib/auth';

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  try {
    const tokens = await api.login(email, password);
    setTokenCookie(tokens.accessToken);
  } catch {
    redirect('/login?error=1');
  }
  redirect('/dashboard');
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: 400, margin: '0 auto' }}>
      <h1>Sign in</h1>
      {searchParams.error && (
        <p style={{ color: '#e07b5f' }}>Invalid credentials.</p>
      )}
      <form
        action={loginAction}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}
      >
        <input name="email" type="email" placeholder="Email" style={inputStyle} required />
        <input
          name="password"
          type="password"
          placeholder="Password"
          style={inputStyle}
          required
        />
        <button type="submit" style={buttonStyle}>
          Continue
        </button>
        <Link href="/register" style={{ color: 'var(--muted)', textAlign: 'center' }}>
          Create an account
        </Link>
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
