import { test, expect } from '@playwright/test';
import { DownloadPage } from '../../pages/heroku pages/DownloadPage';

test('Download', async ({ page }) => {
  const downloads = new DownloadPage(page);
  await downloads.goto();
  const { suggested } = await downloads.downloadFirstFile();

  expect(suggested && suggested.length > 0).toBeTruthy();
  console.log(suggested)
});