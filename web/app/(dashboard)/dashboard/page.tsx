import { api, AdherenceSummary } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

async function loadSummary(): Promise<{
  summary: AdherenceSummary | null;
  streak: number;
  error: string | null;
}> {
  const token = getToken();
  if (!token) {
    return { summary: null, streak: 0, error: 'Not signed in' };
  }
  try {
    const [summary, streak] = await Promise.all([
      api.adherence(token),
      api.streak(token),
    ]);
    return { summary, streak: streak.currentStreak, error: null };
  } catch (e) {
    return { summary: null, streak: 0, error: (e as Error).message };
  }
}

export default async function DashboardOverviewPage() {
  const { summary, streak, error } = await loadSummary();
  const t = await getTranslations('dashboard');

  const adherence = summary?.overallPercentage ?? 0;
  const completedRatio = summary
    ? `${summary.completed} / ${summary.total}`
    : '— / —';
  const skipped = summary?.skipped ?? 0;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {error && <div className="error-banner">{error}</div>}

      {/* ── Hero: magazine layout ─────────────────────── */}
      <section className="hero-grid reveal">
        <div className="hero-main">
          <div className="hero-eyebrow">{today}</div>
          <h1 className="hero-number">
            {adherence}
            <sup>%</sup>
          </h1>
          <p className="hero-caption">
            <strong>{t('adherence7d')}.</strong> Of the {summary?.total ?? 0}{' '}
            scheduled items in the last seven days, you completed{' '}
            {summary?.completed ?? 0}.{' '}
            {streak > 0 && (
              <>
                You&apos;re on a <strong>{streak}-day streak</strong>.
              </>
            )}
          </p>
        </div>

        <aside className="hero-side">
          <div className="hero-side__row">
            <span className="hero-side__label">{t('currentStreak')}</span>
            <span className="hero-side__value">{streak}</span>
          </div>
          <div className="hero-side__rule" />
          <div className="hero-side__row">
            <span className="hero-side__label">{t('completed7d')}</span>
            <span className="hero-side__value">{completedRatio}</span>
          </div>
          <div className="hero-side__rule" />
          <div className="hero-side__row">
            <span className="hero-side__label">{t('skipped7d')}</span>
            <span className="hero-side__value">{skipped}</span>
          </div>
        </aside>
      </section>

      {/* ── Category breakdown ─────────────────────────── */}
      {summary && summary.perType.length > 0 && (
        <section className="reveal" style={{ animationDelay: '0.15s' }}>
          <h2 className="section-title">{t('byCategory')}</h2>
          <div className="glass-card">
            <div style={{ display: 'grid', gap: '1.4rem' }}>
              {summary.perType.map((pt) => (
                <div key={pt.type}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: 8,
                      fontSize: 14,
                    }}
                  >
                    <span
                      style={{
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                      }}
                    >
                      {pt.type}
                    </span>
                    <span
                      style={{
                        color: 'var(--muted)',
                        fontFamily: 'var(--font-display)',
                        fontSize: 15,
                        fontFeatureSettings: "'tnum'",
                      }}
                    >
                      {pt.completed}/{pt.total} · {pt.percentage}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${pt.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Empty state ─────────────────────────────────── */}
      {summary && summary.perType.length === 0 && (
        <section className="reveal" style={{ animationDelay: '0.15s' }}>
          <div className="empty-state">
            <p className="empty-state__title">No data for the past week</p>
            <p className="empty-state__body">
              Once you log meals, supplements, or workout sessions, your
              adherence breakdown will appear here.
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
