import { test } from '@playwright/test';
import { iframepage } from '../../pages/heroku pages/iframepage';

test('Iframe: type inside the editor', async ({ page }) => {
  const iframe = new iframepage(page);
  await iframe.goto();
  await iframe.checkEditor();
  await iframe.expectEditorContains('Your content goes here.');
});