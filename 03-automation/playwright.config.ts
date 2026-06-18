import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the SauceDemo automation suite.
 * Docs: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests within a file in parallel */
  fullyParallel: true,
  /* Fail the build on CI if a test.only is left in the source */
  forbidOnly: !!process.env.CI,
  /* Retry once on CI to absorb network flakiness */
  retries: process.env.CI ? 1 : 0,
  /* Reporters: console list + HTML report */
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'https://www.saucedemo.com',
    /* Capture trace, screenshot and video on failure for debugging */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10_000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Cross-browser ready (uncomment to run): firefox / webkit
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
