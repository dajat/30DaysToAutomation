import { test as base } from '@playwright/test';

export { expect } from '@playwright/test';

export const test = base.extend({
  bankPage: async ({ page }, use) => {
    await page.goto(new URL('./bank.html', import.meta.url).href);
    await use(page);
  },
});
