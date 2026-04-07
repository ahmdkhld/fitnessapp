'use server';

import { redirect } from 'next/navigation';
import { api } from '@/lib/api';
import { clearTokenCookie, getToken } from '@/lib/auth';

export async function logoutAction() {
  const token = getToken();
  if (token) {
    try {
      // Best-effort server-side revocation. The refresh token isn't
      // stored in the cookie; the backend accepts logout by access-token
      // lookup or, if not yet wired, just clear client state.
      await fetch(
        `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken: '' }),
        },
      );
    } catch {
      // Swallow — we still want to clear the cookie
    }
  }
  clearTokenCookie();
  redirect('/login');
}
