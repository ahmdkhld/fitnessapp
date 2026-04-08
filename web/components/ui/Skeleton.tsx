'use client';

import React from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  style?: React.CSSProperties;
}

const shimmerKeyframes = `
@keyframes ui-skeleton-shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

let shimmerInjected = false;

function injectShimmerStyle() {
  if (shimmerInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
  shimmerInjected = true;
}

const variantDefaults: Record<SkeletonVariant, React.CSSProperties> = {
  text: { width: '100%', height: '1em', borderRadius: 4 },
  circular: { width: 40, height: 40, borderRadius: '50%' },
  rectangular: { width: '100%', height: 120, borderRadius: 8 },
};

export function Skeleton({ width, height, variant = 'text', style }: SkeletonProps) {
  React.useEffect(() => {
    injectShimmerStyle();
  }, []);

  const defaults = variantDefaults[variant];

  return (
    <div
      aria-hidden="true"
      style={{
        background: 'linear-gradient(90deg, #333333 25%, #1E1E1E 50%, #333333 75%)',
        backgroundSize: '200% 100%',
        animation: 'ui-skeleton-shimmer 1.5s ease-in-out infinite',
        ...defaults,
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...style,
      }}
    />
  );
}
