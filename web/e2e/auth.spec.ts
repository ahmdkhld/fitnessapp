import { test, expect } from '@playwright/test';
import { login, setAuthCookie, clearAuth } from './helpers';

test.describe('Authentication flows', () => {
  test('login page renders with email and password fields', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('h1')).toHaveText('Sign in');
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Continue');
  });

  test('login with invalid credentials shows error message', async ({ page }) => {
    await login(page, 'wrong@example.com', 'WrongPassword');

    // The server action redirects back to /login?error=1 on failure
    await expect(page).toHaveURL(/\/login\?error=1/);
    await expect(page.locator('text=Invalid credentials')).toBeVisible();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    // This test requires a running backend that accepts the test credentials.
    // If the backend is unavailable the server action will redirect to
    // /login?error=1 — the test will fail, which is the expected signal
    // that the backend fixture needs to be running.
    await login(page);

    // After a successful login the server action redirects to /dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('unauthenticated user visiting dashboard is redirected to login', async ({
    page,
    context,
  }) => {
    await clearAuth(context);
    await page.goto('/dashboard');

    // The middleware should redirect to /login?redirect=%2Fdashboard
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(/redirect=%2Fdashboard/);
  });

  test('logout clears session and returns to login', async ({
    page,
    context,
  }) => {
    // Start authenticated
    await setAuthCookie(context);
    await page.goto('/dashboard');

    // Clear cookies to simulate logout, then navigate
    await clearAuth(context);
    await page.goto('/dashboard');

    await expect(page).toHaveURL(/\/login/);
  });
});
