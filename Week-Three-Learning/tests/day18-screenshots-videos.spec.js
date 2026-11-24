import { test, expect } from '../../Week-One-Learning/fixtures/bank-test.js';

test.use({ video: 'on' });

test('Day 18 - captures the transactions page', async ({ bankPage: page }, testInfo) => {
  await page.getByRole('link', { name: 'Transactions' }).click();
  await expect(page).toHaveURL(/#transactions$/);
  await expect(page.getByRole('heading', { name: 'Recent transactions' })).toBeVisible();
  await expect(page.getByRole('listitem').getByText('Opening deposit $125.00')).toBeVisible();

  const screenshotPath = testInfo.outputPath('transactions.png');
  await page.screenshot({ path: screenshotPath });
  await testInfo.attach('Transactions screenshot', {
    path: screenshotPath,
    contentType: 'image/png',
  });
});
