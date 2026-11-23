import { test, expect } from '@playwright/test';
import { ShopLandingPage } from '../../pages/shop/shopPage.js';
import { BankLoginPage } from '../../pages/bank/banklogin.js';
import { DashboardPage } from '../../pages/bank/dashboardpage.js';
import { bankUser } from '../../test-data/credentials.js';

test.describe('Cross-browser smoke tests', () => {
  test('Shop landing opens and Products page loads', async ({ page }, testInfo) => {
    console.log(`Running on: ${testInfo.project.name}`);
    const shop = new ShopLandingPage(page);
    await shop.goto();
    await shop.assertLoaded();
    await shop.openProducts();
    await expect(page).toHaveURL(/\/products/);
  });

  test('Bank login + dashboard smoke', async ({ page }, testInfo) => {
    test.skip(!bankUser.email || !bankUser.password, 'Set BANK_EMAIL and BANK_PASSWORD to run the bank smoke test.');
    console.log(`Running on: ${testInfo.project.name}`);
    const login = new BankLoginPage(page);
    await login.goto();
    await login.login(bankUser);

    const dashboard = new DashboardPage(page);
    await dashboard.assertLoaded();
  });
});
