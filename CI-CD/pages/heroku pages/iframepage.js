import { expect } from '@playwright/test';

export class iframepage {
  constructor(page) {
    this.page = page;
    this.close = page.locator('button.tox-notification__dismiss');
    this.frame = page.frameLocator('#mce_0_ifr');
    this.editor = this.frame.locator('body#tinymce');
    this.header = page.getByRole('heading', { name: 'An iFrame containing the TinyMCE WYSIWYG Editor' });
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/iframe');
    await expect(this.header).toBeVisible();
    await expect(this.editor).toBeVisible();
  }

  async dismissNotificationIfPresent() {
    if (await this.close.isVisible().catch(() => false)) {
      await this.close.click();
    }
  }

  async typeInEditor(text) {
    await this.editor.click();
    await this.editor.fill(text);
  }
}
