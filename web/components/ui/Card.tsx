import React from 'react';

type CardVariant = 'default' | 'glass';

interface CardProps {
  title?: string;
  subtitle?: string;
  padding?: string | number;
  variant?: CardVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const variantStyles: Record<CardVariant, React.CSSProperties> = {
  default: {
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    boxShadow: 'var(--shadow-card)',
  },
  glass: {
    background: 'var(--glass-bg)',
    border: '1px solid var(--border)',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: 'var(--shadow-card)',
  },
};

export function Card({
  title,
  subtitle,
  padding = '1.25rem',
  variant = 'default',
  children,
  style,
}: CardProps) {
  return (
    <div
      style={{
        ...variantStyles[variant],
        padding,
        ...style,
      }}
    >
      {title && (
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: subtitle ? 4 : '1rem', color: 'var(--fg)', fontFamily: "'Inter', sans-serif" }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0, marginBottom: '1rem', fontFamily: "'Inter', sans-serif" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
