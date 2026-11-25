import { defineConfig } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  outputDir: './learning-output/test-results',
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: './learning-output/playwright-report' }],
  ],
  projects: [
    { name: 'week-1', testDir: './Week-One-Learning/tests' },
    { name: 'week-2', testDir: './Week-Two-Learning/PlayWright_Start/tests' },
    { name: 'week-3', testDir: './Week-Three-Learning/tests' },
  ],
});
