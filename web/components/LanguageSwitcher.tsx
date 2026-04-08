'use client';

import { useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';

/**
 * Language switcher component.
 *
 * Sets a cookie (`nt_locale`) and reloads the page so the server
 * picks up the new locale on the next request.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('language');
  const [isPending, startTransition] = useTransition();

  function switchLocale(newLocale: string) {
    document.cookie = `nt_locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        opacity: isPending ? 0.6 : 1,
      }}
    >
      <span
        style={{
          fontSize: '0.8rem',
          color: 'var(--fg-muted, #888)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        {t('switchLanguage')}
      </span>
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        aria-pressed={locale === 'en'}
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: 4,
          border: '1px solid var(--border, #ddd)',
          background: locale === 'en' ? 'var(--accent, #0070f3)' : 'transparent',
          color: locale === 'en' ? '#fff' : 'var(--fg, #333)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: locale === 'en' ? 600 : 400,
        }}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale('ar')}
        disabled={isPending}
        aria-pressed={locale === 'ar'}
        style={{
          padding: '0.25rem 0.5rem',
          borderRadius: 4,
          border: '1px solid var(--border, #ddd)',
          background: locale === 'ar' ? 'var(--accent, #0070f3)' : 'transparent',
          color: locale === 'ar' ? '#fff' : 'var(--fg, #333)',
          cursor: 'pointer',
          fontSize: '0.8rem',
          fontWeight: locale === 'ar' ? 600 : 400,
        }}
      >
        AR
      </button>
    </div>
  );
}
