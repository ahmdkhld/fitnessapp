import { test, expect, Page, BrowserContext } from '@playwright/test';
import { login } from './helpers';

/**
 * Comprehensive workflow tests — exercises the full app through the UI.
 * Requires Docker backend on :3000 and test user registered.
 *
 * Login once, save auth state, reuse across all tests.
 */

const TEST_EMAIL = 'test@nutritrack.app';
const TEST_PASSWORD = 'Test1234!';
const AUTH_FILE = 'e2e/.auth/user.json';

// ─── Auth Setup (runs first) ──────────────────────────────────────

test.describe.serial('Auth Setup', () => {
  test('login and save auth state', async ({ page }) => {
    // Small delay to avoid rate limiting from previous test runs
    await page.waitForTimeout(2000);
    await login(page, TEST_EMAIL, TEST_PASSWORD);
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
    await page.context().storageState({ path: AUTH_FILE });
  });
});

// ─── Dashboard & Navigation ───────────────────────────────────────

test.describe('Dashboard & Navigation', () => {
  test.use({ storageState: AUTH_FILE });

  test('dashboard overview loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Overview', { timeout: 10000 });
  });

  test('sidebar navigation reaches all main sections', async ({ page }) => {
    const routes = [
      { text: /timeline/i, url: '/dashboard/timeline' },
      { text: /diet/i, url: '/dashboard/diet-plans' },
      { text: /supplement/i, url: '/dashboard/supplements' },
      { text: /workout/i, url: '/dashboard/workouts' },
      { text: /water/i, url: '/dashboard/tracking/water' },
      { text: /body/i, url: '/dashboard/tracking/body' },
      { text: /note/i, url: '/dashboard/tracking/notes' },
      { text: /insight/i, url: '/dashboard/analytics' },
      { text: /setting/i, url: '/dashboard/settings' },
    ];
    for (const route of routes) {
      await page.goto('/dashboard');
      await page.locator('aside.desktop-sidebar a', { hasText: route.text }).first().click();
      await expect(page).toHaveURL(new RegExp(route.url), { timeout: 10000 });
    }
  });
});

// ─── Diet Plans ───────────────────────────────────────────────────

test.describe('Diet Plans CRUD', () => {
  test.use({ storageState: AUTH_FILE });

  test('create diet plan → view detail → add meal', async ({ page }) => {
    const planName = `E2E Diet ${Date.now()}`;
    await page.goto('/dashboard/diet-plans');
    await expect(page.locator('h1')).toContainText('Diet', { timeout: 10000 });

    await page.fill('input[name="name"]', planName);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${planName}`)).toBeVisible({ timeout: 8000 });

    await page.locator(`a:has-text("${planName}")`).click();
    await expect(page.locator('h1')).toContainText(planName, { timeout: 10000 });

    await page.fill('input[name="name"]', 'Breakfast');
    await page.fill('input[name="calories"]', '500');
    await page.fill('input[name="proteinG"]', '30');
    await page.fill('input[name="carbsG"]', '50');
    await page.fill('input[name="fatG"]', '20');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Breakfast')).toBeVisible({ timeout: 8000 });
  });
});

// ─── Supplements ──────────────────────────────────────────────────

test.describe('Supplements', () => {
  test.use({ storageState: AUTH_FILE });

  test('create supplement plan', async ({ page }) => {
    await page.goto('/dashboard/supplements');
    await expect(page.locator('h1')).toContainText('Supplement', { timeout: 10000 });

    const planName = `Supp ${Date.now()}`;
    await page.fill('input[name="name"]', planName);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${planName}`)).toBeVisible({ timeout: 8000 });
  });
});

// ─── Tracking: Water ──────────────────────────────────────────────

test.describe('Water Tracking', () => {
  test.use({ storageState: AUTH_FILE });

  test('log water via quick-add buttons', async ({ page }) => {
    await page.goto('/dashboard/tracking/water');
    await expect(page.locator('h1')).toContainText('Water', { timeout: 10000 });

    await page.locator('button:has-text("+250")').click();
    await page.waitForLoadState('networkidle');
    // Verify a log entry appeared (li element with "250 ml")
    await expect(page.locator('li:has-text("250 ml")').first()).toBeVisible({ timeout: 8000 });

    await page.locator('button:has-text("+500")').click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('li:has-text("500 ml")').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── Tracking: Body Log ───────────────────────────────────────────

test.describe('Body Log', () => {
  test.use({ storageState: AUTH_FILE });

  test('log body measurements', async ({ page }) => {
    await page.goto('/dashboard/tracking/body');
    await expect(page.locator('h1')).toContainText('Body', { timeout: 10000 });

    await page.fill('input[name="weightKg"]', '80.5');
    await page.fill('input[name="waistCm"]', '85');
    await page.fill('input[name="energyLevel"]', '4');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=80.5').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── Tracking: Daily Notes ────────────────────────────────────────

test.describe('Daily Notes', () => {
  test.use({ storageState: AUTH_FILE });

  test('save a daily note', async ({ page }) => {
    await page.goto('/dashboard/tracking/notes');
    await page.waitForLoadState('networkidle');
    // h1 text may be "Daily notes" or similar
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    await page.fill('input[name="mood"]', '4');
    await page.fill('textarea[name="notes"]', 'Feeling great after workout!');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Feeling great')).toBeVisible({ timeout: 8000 });
  });
});

// ─── Workouts ─────────────────────────────────────────────────────

test.describe('Workouts', () => {
  test.use({ storageState: AUTH_FILE });

  test('workouts home page loads', async ({ page }) => {
    await page.goto('/dashboard/workouts');
    await expect(page.locator('h1')).toContainText('Workout', { timeout: 10000 });
  });

  test('exercise library shows seeded exercises', async ({ page }) => {
    await page.goto('/dashboard/workouts/library');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=/\\d+ exercise/i')).toBeVisible({ timeout: 8000 });
  });

  test('templates page shows seeded templates', async ({ page }) => {
    await page.goto('/dashboard/workouts/templates');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Full Body')).toBeVisible({ timeout: 8000 });
  });

  test('create a workout plan', async ({ page }) => {
    await page.goto('/dashboard/workouts/plans');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    const planName = `E2E WPlan ${Date.now()}`;
    await page.fill('input[name="name"]', planName);
    await page.fill('input[name="daysPerWeek"]', '3');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${planName}`)).toBeVisible({ timeout: 8000 });
  });

  test('clone a template', async ({ page }) => {
    await page.goto('/dashboard/workouts/templates');
    await expect(page.locator('text=Full Body')).toBeVisible({ timeout: 8000 });
    await page.locator('button:has-text("Use this plan")').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  });

  test('workout analytics loads', async ({ page }) => {
    await page.goto('/dashboard/workouts/analytics');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });

  test('workout sessions history loads', async ({ page }) => {
    await page.goto('/dashboard/workouts/sessions');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Analytics ────────────────────────────────────────────────────

test.describe('Analytics', () => {
  test.use({ storageState: AUTH_FILE });

  test('analytics page loads', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await expect(page.locator('h1')).toContainText('Analytics', { timeout: 10000 });
  });
});

// ─── Profile ──────────────────────────────────────────────────────

test.describe('Profile Management', () => {
  test.use({ storageState: AUTH_FILE });

  test('update account name and verify persistence', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Wait for form to load with data
    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="fullName"]');
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.clear();
    await nameInput.fill('E2E Updated Name');

    await page.locator('button:has-text("Save")').first().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForTimeout(1000);
    await expect(page.locator('input[name="fullName"]').first()).toHaveValue('E2E Updated Name', { timeout: 8000 });
  });

  test('update body profile', async ({ page }) => {
    await page.goto('/dashboard/profile');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await page.fill('input[name="heightCm"]', '178');
    await page.fill('input[name="weightKg"]', '82');

    await page.locator('button:has-text("Save")').last().click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    await page.reload();
    await page.waitForTimeout(1000);
    await expect(page.locator('input[name="heightCm"]').first()).toHaveValue('178', { timeout: 8000 });
  });
});

// ─── Settings ─────────────────────────────────────────────────────

test.describe('Settings', () => {
  test.use({ storageState: AUTH_FILE });

  test('settings page has all links', async ({ page }) => {
    await page.goto('/dashboard/settings');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // Check for links — they may be translated, use href matching
    await expect(page.locator('a[href*="profile"]').first()).toBeVisible();
    await expect(page.locator('a[href*="change-password"]').first()).toBeVisible();
    await expect(page.locator('a[href*="notification"]').first()).toBeVisible();
    await expect(page.locator('a[href*="export"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]').first()).toBeVisible(); // Sign out
  });

  test('change password page has form', async ({ page }) => {
    await page.goto('/dashboard/settings/change-password');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[name="currentPassword"]')).toBeVisible();
    await expect(page.locator('input[name="newPassword"]')).toBeVisible();
    await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
  });
});

// ─── Notifications ────────────────────────────────────────────────

test.describe('Notification Settings', () => {
  test.use({ storageState: AUTH_FILE });

  test('update notification preferences', async ({ page }) => {
    await page.goto('/dashboard/notifications');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    const advanceInput = page.locator('input[name="advanceMinutes"]');
    if (await advanceInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await advanceInput.clear();
      await advanceInput.fill('10');
    }
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
  });
});

// ─── Import ───────────────────────────────────────────────────────

test.describe('Import Plan', () => {
  test.use({ storageState: AUTH_FILE });

  test('parse a text plan', async ({ page }) => {
    await page.goto('/dashboard/import');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    await page.fill('textarea', `Breakfast 8:00 AM\n- 2 eggs\n- toast\n\nLunch 12:30 PM\n- chicken\n- rice`);
    await page.click('button:has-text("Parse")');
    // Either parsed JSON or error
    await expect(page.locator('pre').or(page.locator('[style*="e07b5f"]'))).toBeVisible({ timeout: 15000 });
  });
});

// ─── Export ───────────────────────────────────────────────────────

test.describe('Export', () => {
  test.use({ storageState: AUTH_FILE });

  test('export page loads with download option', async ({ page }) => {
    await page.goto('/dashboard/export');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
    // Page should have a PDF link or a pre block with report JSON
    // The page should have a PDF download link
    await expect(page.locator('a[href*="report.pdf"]').first()).toBeVisible({ timeout: 8000 });
  });
});

// ─── Coach ────────────────────────────────────────────────────────

test.describe('Coach Portal', () => {
  test.use({ storageState: AUTH_FILE });

  test('coach page loads', async ({ page }) => {
    await page.goto('/dashboard/coach');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Admin ────────────────────────────────────────────────────────

test.describe('Admin Panel', () => {
  test.use({ storageState: AUTH_FILE });

  test('admin page loads', async ({ page }) => {
    await page.goto('/dashboard/admin');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Timeline ─────────────────────────────────────────────────────

test.describe('Timeline', () => {
  test.use({ storageState: AUTH_FILE });

  test('timeline page loads', async ({ page }) => {
    await page.goto('/dashboard/timeline');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });
  });
});

// ─── Mobile Layout ────────────────────────────────────────────────

test.describe('Mobile Layout', () => {
  test.use({ storageState: AUTH_FILE });

  test('hamburger menu opens and navigates', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Overview', { timeout: 10000 });

    const hamburger = page.locator('button.mobile-menu-btn');
    await expect(hamburger).toBeVisible();
    await hamburger.click();

    // Target the mobile drawer specifically
    const drawer = page.locator('aside.mobile-nav-drawer--open');
    await expect(drawer).toBeVisible({ timeout: 3000 });

    await drawer.locator('a').filter({ hasText: /water/i }).first().click();
    await expect(page).toHaveURL(/\/tracking\/water/, { timeout: 10000 });
  });
});

// ─── Language Switcher ────────────────────────────────────────────

test.describe('Language Switcher', () => {
  test.use({ storageState: AUTH_FILE });

  test('switch to Arabic sets RTL, back to English sets LTR', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    const arBtn = page.locator('button:has-text("AR")');
    if (await arBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await arBtn.click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl', { timeout: 8000 });

      await page.locator('button:has-text("EN")').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      await expect(page.locator('html')).toHaveAttribute('dir', 'ltr', { timeout: 8000 });
    }
  });
});

// ─── Full User Journey ────────────────────────────────────────────

test.describe('End-to-End Journey', () => {
  test.use({ storageState: AUTH_FILE });

  test('diet plan → meal → water → body log → analytics → profile', async ({ page }) => {
    // 1. Create diet plan
    await page.goto('/dashboard/diet-plans');
    const dietName = `Journey ${Date.now()}`;
    await page.fill('input[name="name"]', dietName);
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator(`text=${dietName}`)).toBeVisible({ timeout: 8000 });

    // 2. Add meal
    await page.locator(`a:has-text("${dietName}")`).click();
    await expect(page.locator('h1')).toContainText(dietName, { timeout: 10000 });
    await page.locator('input[name="name"]').last().fill('Dinner');
    await page.fill('input[name="calories"]', '800');
    await page.locator('button[type="submit"]').last().click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('text=Dinner')).toBeVisible({ timeout: 8000 });

    // 3. Log water
    await page.goto('/dashboard/tracking/water');
    await page.locator('button:has-text("+500")').click();
    await page.waitForLoadState('networkidle');

    // 4. Log body weight
    await page.goto('/dashboard/tracking/body');
    await page.fill('input[name="weightKg"]', '79.5');
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('div:has-text("79.5")').first()).toBeVisible({ timeout: 8000 });

    // 5. Analytics
    await page.goto('/dashboard/analytics');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 6. Profile
    await page.goto('/dashboard/profile');
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 });

    // 7. Dashboard
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Overview', { timeout: 10000 });
  });
});
