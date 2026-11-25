import { test, expect } from '@playwright/test';
import { iframepage } from '../../pages/heroku pages/iframepage.js';

test('Iframe: type inside the editor', async ({ page }) => {
  const iframe = new iframepage(page);
  await iframe.goto();
  await iframe.dismissNotificationIfPresent();

  const editorText = 'Playwright successfully edited the iframe.';
  await iframe.typeInEditor(editorText);
  await expect(iframe.editor).toHaveText(editorText);
});
