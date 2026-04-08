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
    background: '#1E1E1E',
    border: '1px solid #333333',
    borderRadius: 16,
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  glass: {
    background: 'rgba(30,30,30,0.6)',
    border: '1px solid #333333',
    borderRadius: 16,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: subtitle ? 4 : '1rem', color: '#FFFFFF', fontFamily: "'Inter', sans-serif" }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ color: '#A9A9A9', fontSize: 13, marginTop: 0, marginBottom: '1rem', fontFamily: "'Inter', sans-serif" }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
