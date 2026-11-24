import { test, expect } from '../../../Week-One-Learning/fixtures/bank-test.js';

test('Day 13 - finds the account heading and balance through stable locators', async ({ bankPage: page }) => {
  await expect(page.getByRole('heading', { name: 'Account overview' })).toBeVisible();
  await expect(page.getByText('Checking balance', { exact: true })).toBeVisible();
  await expect(page.getByTestId('account-balance')).toHaveText('$125.00');
});

test('Day 13 - practices a CSS class selector', async ({ bankPage: page }) => {
  const balance = page.locator('.d-flex.justify-between.items-center small.text-gray-400');
  await expect(balance).toHaveText('$125.00');
});
