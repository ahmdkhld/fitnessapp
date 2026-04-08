import { getToken, refreshAccessToken } from './auth';

const API = process.env.API_BASE_URL ?? 'http://localhost:3000/api';

/**
 * Server-side authenticated fetch — used by server actions and RSCs.
 * Automatically retries once on 401 by refreshing the access token.
 * Throws on non-2xx so the caller can decide how to surface the error.
 */
export async function authedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getToken();

  const buildHeaders = (t: string | null) => ({
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...(init.headers ?? {}),
  });

  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: buildHeaders(token),
    cache: 'no-store',
  });

  // On 401, attempt a silent token refresh and retry once
  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      const retry = await fetch(`${API}${path}`, {
        ...init,
        headers: buildHeaders(newToken),
        cache: 'no-store',
      });
      if (!retry.ok) throw new Error(`API ${retry.status}: ${await retry.text()}`);
      return retry;
    }
    // refresh failed — fall through to the error below
  }

  if (!res.ok) throw new Error(`API ${res.status}: ${await res.text()}`);
  return res;
}
