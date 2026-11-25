// @ts-check
import { defineConfig, devices } from '@playwright/test';

const apiSpecs = '**/api/**/*.spec.js';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || undefined,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'api', testMatch: apiSpecs },
    { name: 'chromium', testIgnore: apiSpecs, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', testIgnore: apiSpecs, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', testIgnore: apiSpecs, use: { ...devices['Desktop Safari'] } }
  ]
});
