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
  borderRadius: 6,
  color: 'var(--fg)',
  width: '100%',
  fontFamily: 'inherit',
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  color: 'var(--muted)',
  marginBottom: 4,
};

export function Input({ label, error, helperText, style, ...rest }: InputProps) {
  return (
    <div>
      <span style={labelStyle}>{label}</span>
      <input
        style={{
          ...inputStyle,
          ...(error ? { borderColor: '#e07b5f' } : {}),
          ...style,
        }}
        aria-invalid={error ? true : undefined}
        {...rest}
      />
      {error && (
        <span style={{ display: 'block', fontSize: 12, color: '#e07b5f', marginTop: 4 }}>
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
