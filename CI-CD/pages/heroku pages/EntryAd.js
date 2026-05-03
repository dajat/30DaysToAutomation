import { expect } from '@playwright/test';

export class EntryAdPage {
  constructor(page) {
    this.page = page;
    this.close = page.locator("//*[text()='Close']");
    this.header = page.getByRole('heading', { name: 'This is a modal window' });
  }

async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/entry_ad');
}

async openHeader() {
    await await this.header.waitFor({ state: 'visible', timeout: 10000 });
}

async closeHeader() {
    await this.close.click();
}
}