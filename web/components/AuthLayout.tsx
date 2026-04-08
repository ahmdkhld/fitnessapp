import Link from 'next/link';
import React from 'react';

interface AuthLayoutProps {
  brand?: string;
  title: string;
  subtitle?: string;
  error?: string | null;
  switchPrompt: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}

/**
 * Shared editorial-centered shell for the login + register pages.
 * One column, serif title, single accent rule. No more split-screen.
 */
export function AuthLayout({
  brand = 'NutriTrack',
  title,
  subtitle,
  error,
  switchPrompt,
  switchHref,
  switchLabel,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <article className="auth-card">
        <p className="auth-card__brand">{brand}</p>

        <h1 className="auth-card__title">{title}</h1>
        {subtitle && <p className="auth-card__subtitle">{subtitle}</p>}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {children}

        <p className="auth-switch">
          {switchPrompt}{' '}
          <Link href={switchHref}>{switchLabel}</Link>
        </p>
      </article>
    </main>
  );
}
