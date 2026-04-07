import { cookies } from 'next/headers';

const COOKIE = 'nt_token';

export function getToken(): string | null {
  return cookies().get(COOKIE)?.value ?? null;
}

export function setTokenCookie(value: string) {
  cookies().set(COOKIE, value, {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearTokenCookie() {
  cookies().delete(COOKIE);
}
