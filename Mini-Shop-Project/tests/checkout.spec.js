import { test, expect } from '@playwright/test';
import { creds, urls } from '../test-data/credentials.js';

test('Keep the selected product in the cart through sign-in and open checkout', async ({ page }) => {
  const productName = 'Wireless Mini Speaker';
  const continueToCheckout = page.getByRole('button', { name: 'Continue to checkout', exact: true });
  const cartProduct = page.getByRole('main').getByRole('heading', { name: productName, exact: true });
  const loginUrl = new URL(urls.dashboard);
  loginUrl.searchParams.set('redirect', new URL(urls.cart).pathname);

  await page.goto(new URL('/products', urls.home).href);
  const productCard = page.locator('div.flex-col:has(> button)').filter({
    has: page.getByText(productName, { exact: true })
  });
  await productCard.getByRole('button', { name: 'Add to cart', exact: true }).click();

  await page.locator('a[href="/cart"]').click();
  await expect(page).toHaveURL(urls.cart);
  await expect(cartProduct).toBeVisible();

  await continueToCheckout.click();
  await expect(page).toHaveURL(loginUrl.href);
  await page.getByRole('textbox', { name: /email/i }).fill(creds.valid.email);
  await page.getByLabel(/password/i).fill(creds.valid.password);
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page).toHaveURL(urls.cart);
  await expect(cartProduct).toBeVisible();

  await continueToCheckout.click();
  await expect(page).toHaveURL(urls.checkout);
  await expect(page.getByRole('heading', { name: 'Billing Details', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Payment Information', exact: true })).toBeVisible();
});
