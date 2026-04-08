/**
 * Generic loading skeleton used across dashboard subroutes.
 * Mimics a page-header + grid-of-cards + list layout so the
 * shimmer matches what the real page will render.
 */
interface PageSkeletonProps {
  cards?: number;
  rows?: number;
  showHeader?: boolean;
}

export function PageSkeleton({
  cards = 4,
  rows = 4,
  showHeader = true,
}: PageSkeletonProps) {
  return (
    <div>
      {showHeader && (
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              height: 28,
              width: 200,
              background: 'var(--border)',
              borderRadius: 6,
              marginBottom: 10,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              height: 14,
              width: 320,
              background: 'var(--border)',
              borderRadius: 6,
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </div>
      )}

      {cards > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {Array.from({ length: cards }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '1.25rem',
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.1}s`,
              }}
            >
              <div
                style={{
                  height: 12,
                  width: '50%',
                  background: 'var(--border)',
                  borderRadius: 4,
                  marginBottom: 12,
                }}
              />
              <div
                style={{
                  height: 26,
                  width: '70%',
                  background: 'var(--border)',
                  borderRadius: 4,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {rows > 0 && (
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.85rem 1.1rem',
                height: 56,
                animation: 'pulse 1.5s ease-in-out infinite',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
