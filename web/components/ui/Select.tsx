'use client';

import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

const selectStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--fg)',
  width: '100%',
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--muted)',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

export function Select({ label, error, helperText, children, style, onFocus, onBlur, ...rest }: SelectProps) {
  const [focused, setFocused] = React.useState(false);

  const focusRing: React.CSSProperties = focused && !error
    ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px rgba(0,0,255,0.2)' }
    : {};

  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <select
        style={{
          ...selectStyle,
          ...(error ? { borderColor: 'var(--danger, #EF4444)', boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' } : {}),
          ...focusRing,
          ...style,
        }}
        aria-invalid={error ? true : undefined}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <span style={{ display: 'block', fontSize: 12, color: 'var(--danger, #EF4444)', marginTop: 4 }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
