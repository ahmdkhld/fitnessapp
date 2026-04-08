import { cookies } from 'next/headers';

const ACCESS_COOKIE = 'nt_token';
const REFRESH_COOKIE = 'nt_refresh';

const API_BASE =
  process.env.API_BASE_URL ?? 'http://localhost:3000/api';

export function getToken(): string | null {
  return cookies().get(ACCESS_COOKIE)?.value ?? null;
}

export function getRefreshToken(): string | null {
  return cookies().get(REFRESH_COOKIE)?.value ?? null;
}

export function setTokenCookies(accessToken: string, refreshToken: string) {
  const jar = cookies();
  jar.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days (cookie lifetime; actual expiry is in the JWT)
  });
  jar.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

/** @deprecated Use setTokenCookies instead — kept for backward compat */
export function setTokenCookie(value: string) {
  cookies().set(ACCESS_COOKIE, value, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearTokenCookies() {
  const jar = cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

/** @deprecated Use clearTokenCookies instead */
export function clearTokenCookie() {
  clearTokenCookies();
}

/**
 * Attempt to refresh the access token using the stored refresh token.
 * Returns the new access token on success, or null on failure.
 * On success the cookies are updated in-place.
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!res.ok) {
      clearTokenCookies();
      return null;
    }

    const data = (await res.json()) as {
      accessToken: string;
      refreshToken: string;
    };

    setTokenCookies(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    clearTokenCookies();
    return null;
  }
}
