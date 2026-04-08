import { test, expect } from '@playwright/test';
import { setAuthCookie } from './helpers';

test.describe('Core navigation', () => {
  test.beforeEach(async ({ context }) => {
    await setAuthCookie(context);
  });

  test('can navigate to diet plans', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a[href="/dashboard/diet-plans"]');

    await expect(page).toHaveURL(/\/dashboard\/diet-plans/);
  });

  test('can navigate to workouts', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a[href="/dashboard/workouts"]');

    await expect(page).toHaveURL(/\/dashboard\/workouts/);
  });

  test('can navigate to settings', async ({ page }) => {
    await page.goto('/dashboard');
    await page.click('a[href="/dashboard/settings"]');

    await expect(page).toHaveURL(/\/dashboard\/settings/);
  });

  test('mobile hamburger menu opens and shows navigation', async ({
    page,
  }) => {
    // Set a mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard');

    // The hamburger button should be visible on mobile
    const hamburger = page.locator('button.mobile-menu-btn');
    await expect(hamburger).toBeVisible();

    // Open the mobile nav drawer
    await hamburger.click();

    // The drawer should slide in and contain navigation links
    const drawer = page.locator('aside.mobile-nav-drawer--open');
    await expect(drawer).toBeVisible();

    // Verify a few links are accessible inside the drawer
    await expect(
      drawer.locator('a[href="/dashboard/diet-plans"]'),
    ).toBeVisible();
    await expect(
      drawer.locator('a[href="/dashboard/workouts"]'),
    ).toBeVisible();
    await expect(
      drawer.locator('a[href="/dashboard/settings"]'),
    ).toBeVisible();

    // Clicking a link in the drawer navigates and closes the menu
    await drawer.locator('a[href="/dashboard/workouts"]').click();
    await expect(page).toHaveURL(/\/dashboard\/workouts/);
  });
});
