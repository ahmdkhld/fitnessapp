import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantColors: Record<BadgeVariant, { bg: string; fg: string }> = {
  success: { bg: 'rgba(34,197,94,0.15)', fg: '#22C55E' },
  warning: { bg: 'rgba(245,158,11,0.15)', fg: '#F59E0B' },
  error: { bg: 'rgba(239,68,68,0.15)', fg: '#EF4444' },
  info: { bg: 'rgba(0,0,255,0.15)', fg: '#0000FF' },
  neutral: { bg: '#333333', fg: '#A9A9A9' },
};

export function Badge({ variant = 'neutral', children, style }: BadgeProps) {
  const colors = variantColors[variant];

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.6,
        background: colors.bg,
        color: colors.fg,
        whiteSpace: 'nowrap',
        fontFamily: "'Inter', sans-serif",
        ...style,
      }}
    >
      {children}
    </span>
  );
}
