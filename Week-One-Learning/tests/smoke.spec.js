import { test, expect } from '../fixtures/bank-test.js';

test('opens the bank and navigates to accounts', async ({ bankPage: page }) => {
  await expect(page).toHaveTitle('Learning Bank');

  await page.getByRole('link', { name: 'Accounts' }).click();
  await expect(page).toHaveURL(/#accounts$/);
  await expect(page.getByRole('heading', { name: 'Account overview' })).toBeVisible();
});
