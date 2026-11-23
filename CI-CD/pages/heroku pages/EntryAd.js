import { expect } from '@playwright/test';

export class EntryAdPage {
  constructor(page) {
    this.page = page;
    this.close = page.getByRole('button', { name: 'Close' });
    this.header = page.getByRole('heading', { name: 'This is a modal window' });
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/entry_ad');
  }

  async openHeader() {
    await expect(this.header).toBeVisible({ timeout: 10_000 });
  }

  async closeHeader() {
    await this.close.click();
  }
}
