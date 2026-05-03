import { expect } from '@playwright/test';

export class iframepage {
  constructor(page) {
    this.page = page;
    this.close = page.locator('//button[@class="tox-notification__dismiss tox-button tox-button--naked tox-button--icon"]');
    this.frame = page.frameLocator('iframe[id="mce_0_ifr"]');
    this.editortext = this.frame.locator("//p[text()='Your content goes here.']");
    this.header = page.getByRole('heading', { name: 'An iFrame containing the TinyMCE WYSIWYG Editor' });
  }

async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/iframe');
    await expect(this.header).toBeVisible();
}

  async checkEditor() {
    await this.close.click();
  }

  async expectEditorContains(text) {
    await expect(this.editortext).toContainText(text);
  }

}