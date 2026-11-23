import { expect } from '@playwright/test';
import { DateUtils } from '../utils/dateUtil.js';

export class ScheduleData {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: /Class Schedule/i });
    this.pageSubtitle = page.locator('p').filter({ hasText: 'Manage your daily schedule and events' });
    this.scheduleTab = page.getByRole('link', { name: /Schedule/i });
    this.todayButton = page.getByRole('button', { name: /Go to today/i }).first();
    this.clickTodayButton = page.getByRole('button', { name: 'Today', exact: true });
    this.scheduleHeader = page.getByRole('heading', { name: /Calendar/i });
    this.bannerDate = page.locator('header p').nth(1);
    this.newEvents = scheduleData.newEvents;
    this.eventUpdates = scheduleData.eventUpdates;
    this.todaysDateLocator = page.getByText(DateUtils.getFormattedDate(), { exact: true });

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
    await expect(this.pageTitle).toBeVisible();
  }

  async hoverToday() {
    await this.todayButton.hover();
  }

  async clickToday() {
    await this.clickTodayButton.click();
  }

  async addEvent(eventData) {
    await this.addEventButton.click();
    await expect(this.eventTitleInput).toBeVisible();
    await this.eventTitleInput.fill(eventData.title);

    if (eventData.location) await this.eventLocationInput.fill(eventData.location);
    if (eventData.startTime) await this.startTimeInput.fill(eventData.startTime);
    if (eventData.endTime) await this.endTimeInput.fill(eventData.endTime);
    if (eventData.description) await this.descriptionInput.fill(eventData.description);

    if (eventData.type) {
      await this.eventTypeSelect.click();
      await this.page.getByRole('option', { name: eventData.type, exact: true }).click();
    }

    await this.saveButton.click();
    await expect(this.eventTitleInput).toBeHidden();
    await this.verifyEventPresent(eventData.title);
  }

  async verifyEventPresent(title) {
    await expect(this.page.getByText(title, { exact: true }).first()).toBeVisible();
  }

  getEventCardByTitle(title) {
    return this.page.locator('div').filter({ has: this.page.getByText(title, { exact: true }) }).last();
  }

  async editEvent(oldTitle, newData) {
    const eventCard = this.getEventCardByTitle(oldTitle);
    await eventCard.getByRole('button', { name: /edit/i }).click();
    await expect(this.eventTitleInput).toBeVisible();

    if (newData.title) await this.eventTitleInput.fill(newData.title);
    if (newData.location) await this.eventLocationInput.fill(newData.location);

    await this.saveButton.click();
    await expect(this.eventTitleInput).toBeHidden();
    await this.verifyEventPresent(newData.title || oldTitle);
  }

  async getScheduleHeaderText() {
    return this.scheduleHeader.textContent();
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
      title: 'event 1',
      location: 'Conference Room A',
      type: 'Meeting',
      startTime: '10:00',
      endTime: '11:00',
      description: 'Discuss project updates and next steps.'
    },
    {
      title: 'event 2',
      location: 'Health Clinic',
      type: 'Personal',
      startTime: '14:00',
      endTime: '15:00',
      description: 'Annual check-up with Dr. Smith.'
    },
    {
      title: 'event 3',
      location: 'Fitness Center',
      type: 'Exercise',
      startTime: '18:00',
      endTime: '19:00',
      description: 'Evening yoga session for relaxation.'
    },
    {
      title: 'event 4',
      location: 'Downtown Restaurant',
      type: 'Social',
      startTime: '20:00',
      endTime: '22:00',
      description: 'Catch up with friends over dinner.'
    }
  ],
  eventUpdates: [
    { newData: { title: 'Updated Team Meeting', location: 'Conference Room B' } },
    { newData: { title: "Updated Doctor's Appointment", location: 'Health Clinic - Room 202' } }
  ]
};
