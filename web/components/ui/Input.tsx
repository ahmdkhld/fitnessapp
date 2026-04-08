'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

const inputStyle: React.CSSProperties = {
  padding: '0.6rem 0.75rem',
  background: '#121212',
  border: '1px solid #333333',
  borderRadius: 8,
  color: '#FFFFFF',
  width: '100%',
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 11,
  fontWeight: 500,
  color: '#A9A9A9',
  marginBottom: 6,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontFamily: "'Inter', sans-serif",
};

export function Input({ label, error, helperText, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = React.useState(false);

  const focusRing: React.CSSProperties = focused && !error
    ? { borderColor: '#0000FF', boxShadow: '0 0 0 2px rgba(0,0,255,0.2)' }
    : {};

  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <input
        style={{
          ...inputStyle,
          ...(error ? { borderColor: '#EF4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.15)' } : {}),
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
        <span style={{ display: 'block', fontSize: 12, color: '#EF4444', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
          {error}
        </span>
      )}
      {!error && helperText && (
        <span style={{ display: 'block', fontSize: 12, color: '#A9A9A9', marginTop: 4, fontFamily: "'Inter', sans-serif" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
