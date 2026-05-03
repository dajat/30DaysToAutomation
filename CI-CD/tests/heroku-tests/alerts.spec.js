import { test, expect } from '@playwright/test';
import { AlertsPage } from '../../pages/heroku pages/AlertsPage';

test('Test All JS Alerts', async ({ page }) => {
  const alerts = new AlertsPage(page);
  await alerts.goto();

  // Accept simple alert
  await alerts.triggerAlertAccept();
  await alerts.expectResultContains('You successfully clicked an alert');

  // Confirm: dismiss
  await alerts.triggerConfirm(true);
  await alerts.expectResultContains('You clicked: Ok');

  await alerts.triggerConfirm(false);
  await alerts.expectResultContains('You clicked: Cancel');

  // Prompt: send text
  await alerts.triggerPrompt('Playwright!');
  await alerts.expectResultContains('You entered: Playwright!');
});

