import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for NutriTrack web dashboard E2E tests.
 *
 * Runs Chromium only for speed. The dev server is started automatically
 * on port 3001 before tests begin.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'html',

  /* Shared settings for all tests */
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Chromium-only for speed */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the Next.js dev server before running tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },

  /* Timeouts */
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
});
