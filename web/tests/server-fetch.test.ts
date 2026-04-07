import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the auth helper before importing the module under test so its
// `getToken()` import resolves to our spy.
vi.mock('@/lib/auth', () => ({
  getToken: vi.fn(() => 'test-token'),
}));

import { authedFetch } from '@/lib/server-fetch';

describe('authedFetch', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    process.env.API_BASE_URL = 'http://api.test';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.clearAllMocks();
  });

  it('attaches the bearer token and JSON content type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    globalThis.fetch = fetchMock as any;
    const res = await authedFetch('/users/me');
    expect(res.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('http://api.test/users/me');
    expect((init as RequestInit).headers).toMatchObject({
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
    });
    expect((init as RequestInit).cache).toBe('no-store');
  });

  it('throws on non-2xx with status + body in the message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response('boom', { status: 500 }),
    ) as any;
    await expect(authedFetch('/diet-plans')).rejects.toThrow(
      'API 500: boom',
    );
  });

  it('forwards method + body unchanged', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('{}', { status: 200 }),
    );
    globalThis.fetch = fetchMock as any;
    await authedFetch('/diet-plans', {
      method: 'POST',
      body: JSON.stringify({ name: 'cut' }),
    });
    const [, init] = fetchMock.mock.calls[0];
    expect((init as RequestInit).method).toBe('POST');
    expect((init as RequestInit).body).toBe('{"name":"cut"}');
  });
});
