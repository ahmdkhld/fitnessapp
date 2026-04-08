'use client';

import { useState, useCallback, useEffect } from 'react';

/**
 * Thin client wrapper that provides:
 * - A hamburger button (visible only on mobile via CSS)
 * - An overlay backdrop + sliding sidebar on mobile
 * - Keyboard support (Escape to close)
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

  // Close when the route changes (user clicked a link)
  // We detect this by listening for clicks on <a> inside the nav.
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
      {/* Hamburger button — hidden on desktop via globals.css */}
      <button
        className="mobile-menu-btn"
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 1100,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--fg)',
          width: 44,
          height: 44,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 22,
        }}
      >
        {open ? '\u2715' : '\u2630'}
      </button>

      {/* Overlay backdrop */}
      {open && (
        <div
          className="mobile-nav-overlay"
          onClick={close}
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            zIndex: 1000,
          }}
        />
      )}

      {/* Sliding sidebar panel */}
      <aside
        className={`mobile-nav-drawer ${open ? 'mobile-nav-drawer--open' : ''}`}
        aria-label="Primary navigation"
        onClick={handleNavClick}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 260,
          background: 'var(--card)',
          borderRight: '1px solid var(--border)',
          padding: '4.5rem 1rem 2rem',
          zIndex: 1050,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </aside>
    </>
  );
}
