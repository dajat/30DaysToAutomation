import { expect } from '@playwright/test';

export class AlertsPage {
  constructor(page) {
    this.page = page;
    this.result = page.locator('#result');
    this.JSalert = page.getByRole('button', {name: /Click for JS Alert/i});
    this.JSconfirm = page.getByRole('button', {name: /Click for JS Confirm/i});
    this.JSprompt = page.getByRole('button', { name: /Click for JS Prompt/i});

  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/javascript_alerts');
    await expect(this.page).toHaveURL('https://the-internet.herokuapp.com/javascript_alerts');
  }

  async triggerAlertAccept() {
    this.page.once('dialog', d => d.accept());
    await this.JSalert.click();
  }
  async triggerConfirm(accept = true) {
    this.page.once('dialog', d => accept ? d.accept() : d.dismiss());
    await this.JSconfirm.click();
  }

  async triggerPrompt(text = 'Hello') {
    this.page.once('dialog', d => d.accept(text));
    await this.JSprompt.click();
  }

  async expectResultContains(text) {
    await expect(this.result).toContainText(text);
  }
}