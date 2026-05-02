import { expect } from '@playwright/test';
import { scheduleData } from '../test-data/scheduleData.js';

export class SchedulePage {
  constructor(page) {
    this.page = page;
    this.newEvents = scheduleData.newEvents;
    this.eventUpdates = scheduleData.eventUpdates;
    // Locators
    this.pageTitle = page.getByRole('heading', { name: /Class Schedule/i });
    this.pageSubtitle = page.locator('p').filter({ hasText: "Manage your daily schedule and events" });
    this.todayButton = page.getByRole('button', { name: /Go to today/i });
    this.scheduleHeader = page.getByRole('heading').filter({ hasText: /2026|Calendar/i });
    this.scheduleTab = page.getByRole('link', { name: /schedule/i });
    
    // Form Locators
    this.addEventButton = page.getByRole('button', { name: /add event/i });
    this.eventTitleInput = page.getByPlaceholder(/event title/i);
    this.eventLocationInput = page.getByPlaceholder(/location/i);
    this.saveButton = page.getByRole('button', { name: /save|submit/i });
  }

  async hoverToday() {
    await this.todayButton.hover();
  }
}