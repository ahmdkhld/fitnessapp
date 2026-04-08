import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { setTokenCookies } from '@/lib/auth';

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
    <main style={styles.page}>
      {/* Decorative background circles */}
      <div style={styles.bgCircle1} aria-hidden="true" />
      <div style={styles.bgCircle2} aria-hidden="true" />
      <div style={styles.gridOverlay} aria-hidden="true" />

      {/* Left hero - hidden on mobile via CSS class */}
      <section className="auth-hero" style={styles.hero}>
        <div style={styles.heroContent}>
          {/* Logo */}
          <div style={styles.logo}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#A020F0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 4v16" />
              <path d="M18 4v16" />
              <path d="M6 12h12" />
              <path d="M3 8h3" />
              <path d="M3 16h3" />
              <path d="M18 8h3" />
              <path d="M18 16h3" />
            </svg>
            <span style={styles.logoText}>NutriTrack</span>
          </div>

          {/* Headline */}
          <h1 style={styles.headline}>
            <span style={styles.gradientText}>Join the</span>
            <br />
            <span style={styles.gradientText}>Movement</span>
          </h1>
          <p style={styles.heroSubtext}>
            Start your fitness journey today. Track nutrition, build workouts, and achieve your health goals with NutriTrack.
          </p>

          {/* Feature cards */}
          <div style={styles.featureCards}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>&#x1F3AF;</div>
              <div>
                <div style={styles.featureTitle}>Goal Setting</div>
                <div style={styles.featureDesc}>Set and track personalized fitness goals</div>
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>&#x1F957;</div>
              <div>
                <div style={styles.featureTitle}>Meal Planning</div>
                <div style={styles.featureDesc}>Smart meal plans tailored to your needs</div>
              </div>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>&#x1F4C8;</div>
              <div>
                <div style={styles.featureTitle}>Progress Analytics</div>
                <div style={styles.featureDesc}>Visual dashboards to monitor your journey</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right auth form */}
      <section style={styles.formSection}>
        {/* Mobile logo - shown only on mobile via CSS class */}
        <div className="auth-mobile-logo" style={styles.mobileLogo}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A020F0"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 4v16" />
            <path d="M18 4v16" />
            <path d="M6 12h12" />
            <path d="M3 8h3" />
            <path d="M3 16h3" />
            <path d="M18 8h3" />
            <path d="M18 16h3" />
          </svg>
          <span style={styles.mobileLogoText}>NutriTrack</span>
        </div>

        <div style={styles.glassCard}>
          {/* Corner accents */}
          <div style={styles.cornerAccentTL} aria-hidden="true" />
          <div style={styles.cornerAccentBR} aria-hidden="true" />

          <h2 style={styles.formTitle}>{t('createAccount')}</h2>
          <p style={styles.formSubtitle}>Start your fitness journey</p>

          {searchParams.error && (
            <p style={styles.errorText}>{t('registrationFailed')}</p>
          )}

          <form action={registerAction} style={styles.form}>
            {/* Full name field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="reg-fullname">
                FULL NAME
              </label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="reg-fullname"
                  name="fullName"
                  placeholder={t('fullName')}
                  style={styles.input}
                />
              </div>
            </div>

            {/* Email field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="reg-email">
                EMAIL
              </label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4l-10 8L2 4" />
                </svg>
                <input
                  id="reg-email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="reg-password">
                PASSWORD
              </label>
              <div style={styles.inputWrapper}>
                <svg
                  style={styles.inputIcon}
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <input
                  id="reg-password"
                  name="password"
                  type="password"
                  placeholder={t('passwordPlaceholder')}
                  minLength={8}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.submitButton}>
              {t('createAccount')}
            </button>

            <p style={styles.switchText}>
              {'Already have an account? '}
              <Link href="/login" style={styles.switchLink}>
                {t('alreadyHaveAccount')}
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const styles: Record<string, React.CSSProperties> = {
  /* Page / background */
  page: {
    display: 'flex',
    minHeight: '100vh',
    background: '#121212',
    position: 'relative',
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: '-10%',
    left: '-5%',
    width: 600,
    height: 600,
    borderRadius: '50%',
    background: 'rgba(75, 0, 130, 0.20)',
    filter: 'blur(120px)',
    pointerEvents: 'none',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '-15%',
    right: '-5%',
    width: 500,
    height: 500,
    borderRadius: '50%',
    background: 'rgba(160, 32, 240, 0.10)',
    filter: 'blur(120px)',
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
    pointerEvents: 'none',
  },

  /* Left hero */
  hero: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3rem',
    position: 'relative',
    zIndex: 1,
  },
  heroContent: {
    maxWidth: 480,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  headline: {
    fontSize: '3rem',
    fontWeight: 800,
    lineHeight: 1.1,
    margin: '0 0 1rem',
  },
  gradientText: {
    background: 'linear-gradient(135deg, #A020F0 0%, #4169E1 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtext: {
    color: '#A9A9A9',
    fontSize: '1rem',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },

  /* Feature cards */
  featureCards: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  featureCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.85rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12,
    backdropFilter: 'blur(8px)',
  },
  featureIcon: {
    fontSize: '1.4rem',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureTitle: {
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.9rem',
  },
  featureDesc: {
    color: '#888',
    fontSize: '0.8rem',
  },

  /* Right form section */
  formSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    position: 'relative',
    zIndex: 1,
  },

  /* Mobile logo (hidden on desktop via CSS) */
  mobileLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    marginBottom: '1.5rem',
  },
  mobileLogoText: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#fff',
  },

  /* Glass card */
  glassCard: {
    position: 'relative',
    width: '100%',
    maxWidth: 420,
    padding: '2.5rem 2rem',
    background: 'rgba(30, 30, 30, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 16,
  },
  cornerAccentTL: {
    position: 'absolute',
    top: -1,
    left: -1,
    width: 40,
    height: 40,
    borderTop: '2px solid #4169E1',
    borderLeft: '2px solid #4169E1',
    borderTopLeftRadius: 16,
    pointerEvents: 'none',
  },
  cornerAccentBR: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 40,
    height: 40,
    borderBottom: '2px solid #A020F0',
    borderRight: '2px solid #A020F0',
    borderBottomRightRadius: 16,
    pointerEvents: 'none',
  },

  /* Form */
  formTitle: {
    margin: 0,
    fontSize: '1.75rem',
    fontWeight: 700,
    color: '#fff',
  },
  formSubtitle: {
    margin: '0.25rem 0 1.5rem',
    color: '#A9A9A9',
    fontSize: '0.9rem',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.875rem',
    margin: '0 0 0.75rem',
    padding: '0.5rem 0.75rem',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    border: '1px solid rgba(239, 68, 68, 0.25)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
  },
  label: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: '#A9A9A9',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '0.75rem 0.75rem 0.75rem 2.5rem',
    background: '#121212',
    border: '1px solid #333',
    borderRadius: 8,
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
  },
  submitButton: {
    width: '100%',
    padding: '0.8rem',
    background: '#0000FF',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 0 20px rgba(0, 0, 255, 0.35)',
    marginTop: '0.25rem',
  },
  switchText: {
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: '0.85rem',
    margin: 0,
  },
  switchLink: {
    color: '#4169E1',
    fontWeight: 600,
    textDecoration: 'none',
  },
};
