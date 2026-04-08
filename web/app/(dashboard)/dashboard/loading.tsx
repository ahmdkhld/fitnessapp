export default function DashboardLoading() {
  const shimmer =
    'linear-gradient(90deg, var(--border) 25%, transparent 50%, var(--border) 75%)';

  return (
    <div style={{ padding: '0' }}>
      {/* Title skeleton */}
      <div
        style={{
          height: 28,
          width: 160,
          background: 'var(--border)',
          borderRadius: 6,
          marginBottom: 8,
        }}
      />
      {/* Subtitle skeleton */}
      <div
        style={{
          height: 16,
          width: 280,
          background: 'var(--border)',
          borderRadius: 6,
          marginBottom: '2rem',
        }}
      />

      {/* Card grid skeleton */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                height: 14,
                width: 80,
                background: shimmer,
                backgroundSize: '200% 100%',
                borderRadius: 4,
                marginBottom: 10,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
            <div
              style={{
                height: 28,
                width: 100,
                background: shimmer,
                backgroundSize: '200% 100%',
                borderRadius: 4,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
        ))}
      </div>

      {/* Section skeleton */}
      <div style={{ marginTop: '2rem' }}>
        <div
          style={{
            height: 20,
            width: 120,
            background: 'var(--border)',
            borderRadius: 6,
            marginBottom: '1rem',
          }}
        />
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '0.75rem 1rem',
                height: 52,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          ))}
        </div>
      </div>

      {/* Inline keyframes via style tag */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.4; }
            }
          `,
        }}
      />
    </div>
  );
}
