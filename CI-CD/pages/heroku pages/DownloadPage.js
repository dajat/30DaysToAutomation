import { expect } from '@playwright/test';

export class DownloadPage {
  constructor(page) {
    this.page = page;
    this.downloadLink = page.locator("a[href='download/some-file.txt']");
  }

  async goto() {
    await this.page.goto('https://the-internet.herokuapp.com/download');
  }

  async downloadFirstFile() {
    await expect(this.downloadLink).toBeVisible();
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.downloadLink.click()
    ]);
    const stream = await download.createReadStream();
    if (!stream) throw new Error('The browser did not provide a readable download stream.');

    let content = '';
    for await (const chunk of stream) content += chunk.toString('utf8');
    return { suggested: download.suggestedFilename(), content };
  }
}
