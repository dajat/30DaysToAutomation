
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // FIX: Removed the trailing space after './tests ' which often causes "No tests found"
  testDir: './tests',
  timeout: 10000,
  
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  /* Reporter Configuration */
  reporter: [
    ['line'], 
    ['html'], 
    ['allure-playwright', { outputFolder: 'allure-results' }] // Added options for clarity
  ],

  use: {
    /* Collect trace and screenshots for better Allure reports */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});