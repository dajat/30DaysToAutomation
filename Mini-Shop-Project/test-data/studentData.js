import { test } from '@playwright/test';

export class LoginStudentData {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    // Locators
    this.email = page.locator('//input[@id="signin-email"]');
    this.password = page.locator('//input[@id="signin-password"]');
    this.loginBtn = page.locator('//button[@type="submit"]');
  }

  /** Performs login using the exported user object */
  async login() {
    await this.page.goto(baseURL);
    await this.email.waitFor({ state: 'visible', timeout: 5000 });
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.loginBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}

export const baseURL = 'https://k12-harmony-hub.lovable.app';
export const user = { email: 'hello@example.com', password: 'hello123' };

export { LoginStudentData as Login };