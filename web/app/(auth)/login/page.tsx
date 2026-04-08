import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { api } from '@/lib/api';
import { setTokenCookies } from '@/lib/auth';
import { AuthLayout } from '@/components/AuthLayout';

async function loginAction(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirect') ?? '/dashboard');

  // Only allow relative paths to prevent open-redirect attacks
  const safeDest = redirectTo.startsWith('/') ? redirectTo : '/dashboard';

  try {
    const tokens = await api.login(email, password);
    setTokenCookies(tokens.accessToken, tokens.refreshToken);
  } catch {
    redirect(`/login?error=1&redirect=${encodeURIComponent(safeDest)}`);
  }
  redirect(safeDest);
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const t = await getTranslations('auth');

  return (
    <AuthLayout
      title={t('welcomeBack')}
      subtitle="Sign in to pick up where you left off — your nutrition log, workouts, and weekly progress are waiting."
      error={searchParams.error ? t('loginFailed') : null}
      switchPrompt={t('noAccount')}
      switchHref="/register"
      switchLabel={t('createAnAccount')}
    >
      <form action={loginAction} className="auth-form">
        {searchParams.redirect && (
          <input type="hidden" name="redirect" value={searchParams.redirect} />
        )}

        <div className="auth-field">
          <label htmlFor="login-email">{t('email')}</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="login-password">{t('password')}</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder={t('passwordMin')}
            autoComplete="current-password"
            minLength={8}
            required
          />
        </div>

        <button type="submit" className="auth-submit">
          {t('continue')}
        </button>
      </form>
    </AuthLayout>
  );
}
