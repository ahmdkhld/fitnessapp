'use client';

import React from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: SkeletonVariant;
  style?: React.CSSProperties;
}

const pulseKeyframes = `
@keyframes ui-skeleton-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}
`;

let pulseInjected = false;

function injectPulseStyle() {
  if (pulseInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
  pulseInjected = true;
}

const variantDefaults: Record<SkeletonVariant, React.CSSProperties> = {
  text: { width: '100%', height: '1em', borderRadius: 4 },
  circular: { width: 40, height: 40, borderRadius: '50%' },
  rectangular: { width: '100%', height: 120, borderRadius: 8 },
};

export function Skeleton({ width, height, variant = 'text', style }: SkeletonProps) {
  React.useEffect(() => {
    injectPulseStyle();
  }, []);

  const defaults = variantDefaults[variant];

  return (
    <div
      aria-hidden="true"
      style={{
        background: 'var(--border)',
        animation: 'ui-skeleton-pulse 1.5s ease-in-out infinite',
        ...defaults,
        ...(width !== undefined ? { width } : {}),
        ...(height !== undefined ? { height } : {}),
        ...style,
      }}
    />
  );
}
