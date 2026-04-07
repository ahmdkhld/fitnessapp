import { redirect } from 'next/navigation';
import Link from 'next/link';
import { setTokenCookie } from '@/lib/auth';

async function registerAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const fullName = String(formData.get('fullName') ?? '');
  try {
    const res = await fetch(
      `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/auth/register`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      },
    );
    if (!res.ok) throw new Error(await res.text());
    const tokens = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };
    setTokenCookie(tokens.accessToken);
  } catch {
    redirect('/register?error=1');
  }
  redirect('/dashboard');
}

const input: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--fg)',
};

const button: React.CSSProperties = {
  padding: '0.75rem',
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
};

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: 400, margin: '0 auto' }}>
      <h1>Create account</h1>
      {searchParams.error && (
        <p style={{ color: '#e07b5f' }}>Registration failed. Try a different email.</p>
      )}
      <form
        action={registerAction}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          marginTop: '2rem',
        }}
      >
        <input name="fullName" placeholder="Full name" style={input} />
        <input name="email" type="email" placeholder="Email" style={input} required />
        <input
          name="password"
          type="password"
          placeholder="Password (min 8 chars)"
          minLength={8}
          style={input}
          required
        />
        <button type="submit" style={button}>
          Create account
        </button>
        <Link href="/login" style={{ color: 'var(--muted)', textAlign: 'center' }}>
          I already have an account
        </Link>
      </form>
    </main>
  );
}
