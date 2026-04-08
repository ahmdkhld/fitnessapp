'use server';

import { redirect } from 'next/navigation';
import { api } from '@/lib/api';
import { clearTokenCookies, getRefreshToken, getToken } from '@/lib/auth';

export async function logoutAction() {
  const token = getToken();
  const refreshToken = getRefreshToken();
  if (token) {
    try {
      await fetch(
        `${process.env.API_BASE_URL ?? 'http://localhost:3000/api'}/auth/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ refreshToken: refreshToken ?? '' }),
        },
      );
    } catch {
      // Swallow — we still want to clear the cookies
    }
  }
  clearTokenCookies();
  redirect('/login');
}
