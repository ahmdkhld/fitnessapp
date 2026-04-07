import { getToken } from './auth';

const API = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

/**
 * Server-side authenticated fetch — used by server actions and RSCs.
 * Throws on non-2xx so the caller can decide how to surface the error.
 */
export async function authedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res;
}
