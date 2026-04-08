import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantColors: Record<BadgeVariant, { bg: string; fg: string }> = {
  success: { bg: '#1a3a2a', fg: '#6ecf9a' },
  warning: { bg: '#3a3520', fg: '#e0c36a' },
  error: { bg: '#3a1f1f', fg: '#e07b5f' },
  info: { bg: '#1a2a3a', fg: '#6ab0e0' },
  neutral: { bg: 'var(--border)', fg: 'var(--muted)' },
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
        ...style,
      }}
    >
      {children}
    </span>
  );
}
