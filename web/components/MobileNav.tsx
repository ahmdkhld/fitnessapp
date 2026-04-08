'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Mobile navigation dropdown that drops down from the top nav bar.
 * Visible only on mobile (<=768px) via CSS class rules in globals.css.
 *
 * The actual nav links are passed in as children so the server
 * layout keeps ownership of the link list.
 */
export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, close]);

  // Close when a link is clicked (route change)
  const handleNavClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('a')) {
        close();
      }
    },
    [close],
  );

  return (
    <>
      {/* Hamburger button -- hidden on desktop via globals.css */}
      <button
        className="mobile-menu-btn"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--fg)',
          width: 40,
          height: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 20,
        }}
      >
        {open ? '\u2715' : '\u2630'}
      </button>

      {/* Overlay backdrop */}
      <div
        className={`mobile-nav-overlay ${open ? 'mobile-nav-overlay--open' : ''}`}
        onClick={close}
        aria-hidden
      />

      {/* Dropdown panel from top nav */}
      <div
        className={`mobile-nav-dropdown ${open ? 'mobile-nav-dropdown--open' : ''}`}
        onClick={handleNavClick}
        role="navigation"
        aria-label="Mobile navigation"
      >
        {children}
      </div>
    </>
  );
}
