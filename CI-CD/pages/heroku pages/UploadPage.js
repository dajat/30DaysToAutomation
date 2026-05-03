import { expect } from '@playwright/test';

export class UploadPage {
  constructor(page) {
    this.page = page;
    this.chooseFile = page.locator('#file-upload');
    this.Uploadbtn = page.locator('#file-submit');
    this.resultHeader = page.getByRole('heading', {name: 'File Uploaded!'});
    this.uploadedFiles = page.locator('#uploaded-files');
  }
  
    async goto(){
    await this.page.goto('https://the-internet.herokuapp.com/upload');
  }

    async upload(filePath){
    await this.chooseFile.setInputFiles(filePath); //test-data/files/sample.txt
    await this.Uploadbtn.click();
    }

    async expectUploaded(filename){
    await expect(this.resultHeader).toBeVisible();
    await expect(this.uploadedFiles).toHaveText(filename);
    }
}