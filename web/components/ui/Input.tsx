'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 8,
  color: 'var(--fg)',
  width: '100%',
  fontFamily: 'var(--font-body)',
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

export function Input({ label, error, helperText, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const focusRing: React.CSSProperties = focused && !error
    ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px var(--danger-bg)' }
    : {};

  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <input
        style={{
          ...inputStyle,
          ...(error ? { borderColor: 'var(--danger)', boxShadow: '0 0 0 3px var(--danger-bg)' } : {}),
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
      />
      {error && (
        <span style={{ display: 'block', fontSize: 12, color: 'var(--danger)', marginTop: 4 }}>
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
