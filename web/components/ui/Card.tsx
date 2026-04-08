import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  padding?: string | number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({
  title,
  subtitle,
  padding = '1.25rem',
  children,
  style,
}: CardProps) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding,
        ...style,
      }}
    >
      {title && (
        <h2 style={{ fontSize: '1.1rem', marginTop: 0, marginBottom: subtitle ? 4 : '1rem' }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 0, marginBottom: '1rem' }}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
