import { NextRequest, NextResponse } from 'next/server';

/**
 * Paths that do not require authentication.
 * - /           Landing page
 * - /login      Sign-in form
 * - /register   Sign-up form
 * - /api/*      Proxy / API routes (they enforce auth server-side)
 */
const PUBLIC_PATHS = ['/', '/login', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public pages, API routes, and Next.js internals
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api/')
  ) {
    return NextResponse.next();
  }

  // Check for the auth cookie set by lib/auth.ts
  const token = request.cookies.get('nt_token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Run on every request except static assets and images
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
