import { expect } from '@playwright/test'; 

export class ScheduleData {
  constructor(page) {
    this.page = page;

    // Core Nav & Layout
    this.pageTitle = page.getByRole('heading', { name: /Class Schedule/i });
    this.pageSubtitle = page.locator('p').filter({ hasText: "Manage your daily schedule and events" });
    this.scheduleTab = page.getByRole('link', { name: /Schedule/i });
    this.todayButton = page.getByRole('button', { name: /Go to today/i }).first();
    this.clickTodayButton = page.getByRole('button', { name: /Today/i })
    this.scheduleHeader = page.getByRole('heading', { name: /Calendar/i });
    this.bannerDate = page.locator('header p').nth(1); 
    this.newEvents = scheduleData.newEvents; 
    this.eventUpdates = scheduleData.eventUpdates; // Added this so T-05 and T-06 work too
    this.todaysDateLocator = page.getByText('Saturday, May 2, 2026');

    // Form/Modal Locators
    this.addEventButton = page.getByRole('button', { name: /Add Event/i });
    this.eventTitleInput = page.getByPlaceholder(/Event title/i);
    this.eventLocationInput = page.getByPlaceholder(/Location/i);
    this.eventTypeSelect = page.getByRole('combobox').first();
    this.startTimeInput = page.locator('input[type="time"]').first();
    this.endTimeInput = page.locator('input[type="time"]').last();
    this.descriptionInput = page.getByPlaceholder(/Description/i);
    this.saveButton = page.getByRole('button', { name: /Save|Submit|Add Event/i });
  }

  async navigate() {
    await this.scheduleTab.click();
  }

  async hoverToday() {
    await this.todayButton.hover();
  }

  async clickToday() {
    await this.clickTodayButton.click();
  }

  async addEvent(scheduleDataInfo) {
    await this.addEventButton.click();
    await this.eventTitleInput.fill(scheduleDataInfo.title);

    if (scheduleDataInfo.location) await this.eventLocationInput.fill(scheduleDataInfo.location);
    if (scheduleDataInfo.startTime) await this.startTimeInput.fill(scheduleDataInfo.startTime);
    if (scheduleDataInfo.endTime) await this.endTimeInput.fill(scheduleDataInfo.endTime);
    if (scheduleDataInfo.description) await this.descriptionInput.fill(scheduleDataInfo.description);

    if (scheduleDataInfo.type) {
      await this.page.getByRole('option', { name: scheduleDataInfo.type }).click().catch(() => {});
    }

    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async verifyEventPresent(title) {
    await expect(this.page.getByText(title).first()).toBeVisible();
  }

  getEventCardByTitle(title) {
    return this.page.locator('div').filter({ hasText: title }).last();
  }

  async editEvent(oldTitle, newData) {
    const eventCard = this.getEventCardByTitle(oldTitle);
    await eventCard.getByRole('button', { name: /edit/i }).click();

    if (newData.title) await this.eventTitleInput.fill(newData.title);
    if (newData.location) await this.eventLocationInput.fill(newData.location);

    await this.saveButton.click();
  }

  async getScheduleHeaderText() {
    return await this.scheduleHeader.textContent();
  }

  async verifyPageTitle() {
    await expect(this.pageTitle).toBeVisible();
  }

  async verifyTodaysDate() {
    await expect(this.scheduleHeader).toBeVisible();
  }
}

export const scheduleData = {
  newEvents: [
    {
      title: "event 1",
      location: "Conference Room A",
      type: "Meeting",
      startTime: "10:00",
      endTime: "11:00",
      description: "Discuss project updates and next steps."
    },
    {
      title: "event 2",
      location: "Health Clinic",
      type: "Personal",
      startTime: "14:00",
      endTime: "15:00",
      description: "Annual check-up with Dr. Smith."
    },
    {
      title: "event 3",
      location: "Fitness Center",
      type: "Exercise",
      startTime: "18:00",
      endTime: "19:00",
      description: "Evening yoga session for relaxation."
    },
    {
      title: "event 4",
      location: "Downtown Restaurant",
      type: "Social",
      startTime: "20:00",
      endTime: "22:00",
      description: "Catch up with friends over dinner."
    }
  ],
  eventUpdates: [
    {
      newData: {
        title: "Updated Team Meeting",
        location: "Conference Room B"
      }
    },
    {
      newData: {
        title: "Updated Doctor's Appointment",
        location: "Health Clinic - Room 202"
      }
    }
  ]
};
