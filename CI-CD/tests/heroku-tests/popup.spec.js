import { test, expect } from '@playwright/test';
import { EntryAdPage } from '../../pages/heroku pages/EntryAd.js';

test('Pop-up (Entry Ad) can be dismissed', async ({ page }) => {
  const entryAd = new EntryAdPage(page);
  await entryAd.goto();
  await entryAd.openHeader();
  await entryAd.closeHeader();
  await expect(entryAd.header).toBeHidden();
});
