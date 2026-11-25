import { expect } from '@playwright/test';

export class DownloadPage {
  constructor(page) {
    this.page = page;
    this.downloadLink = page.locator("//a[@href='download/some-file.txt']");
  }

  async goto(){
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
    
    const suggested = download.suggestedFilename();
    const path = await download.path(); // may be null on CI, but ok locally
    return { suggested, path };
  }

  async expectDownloadedFilename(suggested) {
    // We just assert a filename exists (site serves random files)
    await expect.soft(suggested).toBeTruthy();
  }
}
