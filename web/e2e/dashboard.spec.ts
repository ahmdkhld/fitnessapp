import { test, expect } from '@playwright/test';
import { setAuthCookie } from './helpers';

test.describe('Dashboard basics', () => {
  test.beforeEach(async ({ context }) => {
    // Inject a mock auth cookie so the middleware allows access
    await setAuthCookie(context);
  });

  test('dashboard page renders the overview heading when authenticated', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toContainText('Overview');
  });

  test('sidebar navigation links are visible on desktop', async ({ page }) => {
    await page.goto('/dashboard');

    const sidebar = page.locator('aside.desktop-sidebar');
    await expect(sidebar).toBeVisible();

    // Spot-check a handful of key nav links
    await expect(sidebar.locator('a[href="/dashboard"]')).toBeVisible();
    await expect(
      sidebar.locator('a[href="/dashboard/diet-plans"]'),
    ).toBeVisible();
    await expect(
      sidebar.locator('a[href="/dashboard/workouts"]'),
    ).toBeVisible();
    await expect(
      sidebar.locator('a[href="/dashboard/settings"]'),
    ).toBeVisible();
  });

  test('clicking a sidebar link navigates to the correct page', async ({
    page,
  }) => {
    await page.goto('/dashboard');

    await page.click('aside.desktop-sidebar a[href="/dashboard/settings"]');

    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });
});
