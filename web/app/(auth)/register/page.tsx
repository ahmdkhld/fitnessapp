import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { setTokenCookies } from '@/lib/auth';
import { AuthLayout } from '@/components/AuthLayout';

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
    setTokenCookies(tokens.accessToken, tokens.refreshToken);
  } catch {
    redirect('/register?error=1');
  }
  redirect('/dashboard/onboarding');
}

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const t = await getTranslations('auth');

  return (
    <AuthLayout
      title={t('createAccount')}
      subtitle="Track meals, supplements, workouts, and body measurements in one place. Free to get started — no card required."
      error={searchParams.error ? t('registrationFailed') : null}
      switchPrompt={t('alreadyHaveAccountPrompt')}
      switchHref="/login"
      switchLabel={t('alreadyHaveAccount')}
    >
      <form action={registerAction} className="auth-form">
        <div className="auth-field">
          <label htmlFor="reg-fullname">{t('fullName')}</label>
          <input
            id="reg-fullname"
            name="fullName"
            type="text"
            placeholder={t('fullName')}
            autoComplete="name"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-email">{t('email')}</label>
          <input
            id="reg-email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="reg-password">{t('password')}</label>
          <input
            id="reg-password"
            name="password"
            type="password"
            placeholder={t('passwordPlaceholder')}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </div>

        <button type="submit" className="auth-submit">
          {t('createAccount')}
        </button>
      </form>
    </AuthLayout>
  );
}
