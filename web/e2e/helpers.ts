import { type Page, type BrowserContext } from '@playwright/test';

/** Default test credentials — these match the backend seed data or mock. */
const TEST_EMAIL = 'test@nutritrack.local';
const TEST_PASSWORD = 'TestPass123!';

/** Cookie name used by the Next.js middleware for auth checks. */
const AUTH_COOKIE = 'nt_token';

/**
 * Fill in the login form and submit.
 * Does NOT wait for redirect — callers should assert the next URL.
 */
export async function login(
  page: Page,
  email = TEST_EMAIL,
  password = TEST_PASSWORD,
): Promise<void> {
  await page.goto('/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
}

/**
 * Inject a mock auth cookie so the middleware treats the session as
 * authenticated. Use this to skip the login flow in tests that only
 * care about post-login pages.
 *
 * The token value is a dummy JWT-shaped string — the Next.js middleware
 * only checks for the cookie's presence, not validity.
 */
export async function setAuthCookie(context: BrowserContext): Promise<void> {
  await context.addCookies([
    {
      name: AUTH_COOKIE,
      value:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiJ0ZXN0LXVzZXIiLCJleHAiOjk5OTk5OTk5OTl9.' +
        'mock-signature',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
    },
  ]);
}

/**
 * Clear all cookies to simulate a logged-out state.
 */
export async function clearAuth(context: BrowserContext): Promise<void> {
  await context.clearCookies();
}
