import { test } from '@playwright/test';
import { AlertsPage } from '../../pages/heroku pages/AlertsPage.js';

test('Test all JavaScript alerts', async ({ page }) => {
  const alerts = new AlertsPage(page);
  await alerts.goto();

  await alerts.triggerAlertAccept();
  await alerts.expectResultContains('You successfully clicked an alert');

  await alerts.triggerConfirm(true);
  await alerts.expectResultContains('You clicked: Ok');

  await alerts.triggerConfirm(false);
  await alerts.expectResultContains('You clicked: Cancel');

  await alerts.triggerPrompt('Playwright!');
  await alerts.expectResultContains('You entered: Playwright!');
});
