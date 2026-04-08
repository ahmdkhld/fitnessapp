'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--accent)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: 'var(--glow-blue)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--fg)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: '#EF4444',
    color: '#FFFFFF',
    border: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--fg)',
    border: 'none',
  },
};

const hoverBg: Record<ButtonVariant, string> = {
  primary: '#0000CC',
  secondary: 'var(--hover-overlay)',
  danger: '#DC2626',
  ghost: 'var(--hover-overlay)',
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { padding: '0.4rem 0.75rem', fontSize: 12 },
  md: { padding: '0.6rem 1.5rem', fontSize: 14 },
  lg: { padding: '0.75rem 2rem', fontSize: 16 },
};

const spinnerKeyframes = `
@keyframes ui-btn-spin {
  to { transform: rotate(360deg); }
}
`;

let styleInjected = false;

function injectSpinnerStyle() {
  if (styleInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = spinnerKeyframes;
  document.head.appendChild(style);
  styleInjected = true;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (loading) injectSpinnerStyle();
  }, [loading]);

  const isDisabled = disabled || loading;

  const merged: React.CSSProperties = {
    ...variantStyles[variant],
    ...sizeStyles[size],
    borderRadius: 8,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    opacity: isDisabled ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    lineHeight: 1.4,
    transition: 'background 0.15s, opacity 0.15s, box-shadow 0.15s',
    ...(fullWidth ? { width: '100%' } : {}),
    ...(hovered && !isDisabled ? { background: hoverBg[variant] } : {}),
    ...style,
  };

  return (
    <button
      disabled={isDisabled}
      style={merged}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      {...rest}
    >
      {loading && (
        <span
          style={{
            display: 'inline-block',
            width: size === 'sm' ? 12 : 16,
            height: size === 'sm' ? 12 : 16,
            border: '2px solid #FFFFFF',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'ui-btn-spin 0.6s linear infinite',
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
