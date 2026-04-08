import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantColors: Record<BadgeVariant, { bg: string; fg: string }> = {
  success: { bg: 'rgba(34,197,94,0.15)', fg: 'var(--success, #22C55E)' },
  warning: { bg: 'rgba(245,158,11,0.15)', fg: 'var(--warning, #F59E0B)' },
  error: { bg: 'rgba(239,68,68,0.15)', fg: 'var(--danger, #EF4444)' },
  info: { bg: 'rgba(0,0,255,0.10)', fg: 'var(--accent)' },
  neutral: { bg: 'var(--hover-overlay)', fg: 'var(--muted)' },
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
        fontFamily: 'var(--font-body)',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
