import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="landing">
      <div className="landing__inner">
        <header className="landing__brand">
          <span className="landing__brand-rule" aria-hidden="true" />
          NutriTrack
        </header>

        <h1 className="landing__title reveal">
          Quiet&nbsp;tracking<br />
          for loud&nbsp;goals.
        </h1>

        <p
          className="landing__lede reveal"
          style={{ animationDelay: '0.08s' }}
        >
          A nutrition, supplement and workout journal that stays out of the way.
          Log your week, watch the chart, ship the report to your coach. No
          streaks-as-anxiety, no leaderboards, no neon.
        </p>

        <div
          className="landing__cta reveal"
          style={{ animationDelay: '0.16s' }}
        >
          <Link href="/register" className="landing__cta-primary">
            Start tracking
          </Link>
          <Link href="/login" className="landing__cta-secondary">
            I have an account →
          </Link>
        </div>

        <ul
          className="landing__pillars reveal"
          style={{ animationDelay: '0.24s' }}
        >
          <li>
            <span className="landing__pillar-num">01</span>
            <span className="landing__pillar-label">
              Daily timeline of meals, supplements &amp; sessions
            </span>
          </li>
          <li>
            <span className="landing__pillar-num">02</span>
            <span className="landing__pillar-label">
              Weekly adherence with computed insights
            </span>
          </li>
          <li>
            <span className="landing__pillar-num">03</span>
            <span className="landing__pillar-label">
              Coach-ready PDF report on demand
            </span>
          </li>
        </ul>

        <footer className="landing__footer">
          <span>NutriTrack © {new Date().getFullYear()}</span>
          <span className="landing__footer-dot">·</span>
          <span>Free to start</span>
          <span className="landing__footer-dot">·</span>
          <span>No card required</span>
        </footer>
      </div>
    </main>
  );
}
