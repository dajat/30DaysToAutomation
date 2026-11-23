import { test, expect } from '@playwright/test';
import { DownloadPage } from '../../pages/heroku pages/DownloadPage.js';

test('Download returns a non-empty file', async ({ page }) => {
  const downloads = new DownloadPage(page);
  await downloads.goto();

  const { suggested, content } = await downloads.downloadFirstFile();
  expect(suggested).toMatch(/\.txt$/i);
  expect(content.trim().length).toBeGreaterThan(0);
});
