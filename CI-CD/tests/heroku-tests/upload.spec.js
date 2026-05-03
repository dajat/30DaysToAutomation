import { test } from '@playwright/test';
import { UploadPage } from '../../pages/heroku pages/UploadPage';

test('Upload Files then verify', async ({ page }) => {
  const upload = new UploadPage(page);
  await upload.goto();

  const file = 'tests/files/sample.txt';
  await upload.upload(file);
  await upload.expectUploaded('sample.txt');
});