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
    // Time controls may be native selects or accessible custom dropdowns.
    // Resolve them when the Add Event form is open, not before.

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
    if (eventData.startTime) await this.selectTime('Start Time', eventData.startTime);
    if (eventData.endTime) await this.selectTime('End Time', eventData.endTime);
    if (eventData.description) await this.descriptionInput.fill(eventData.description);

    if (eventData.type) {
      await this.eventTypeSelect.click();
      await this.page.getByRole('option', { name: eventData.type, exact: true }).click();
    }

    await this.saveButton.click();
    await expect(this.eventTitleInput).toBeHidden();
    await this.verifyEventPresent(eventData.title);
  }

  /** Select a scheduled time from a native select or custom dropdown. */
  async selectTime(label, time24h) {
    const [hours, minutes] = time24h.split(':').map(Number);
    const time12h = String(hours % 12 || 12) + ':' + String(minutes).padStart(2, '0') + ' ' + (hours >= 12 ? 'PM' : 'AM');
    const labelPattern = new RegExp(label, 'i');
    let control = this.page.getByRole('combobox', { name: labelPattern });
    if (await control.count() === 0) control = this.page.getByLabel(labelPattern);
    if (await control.count() === 0) {
      const dropdowns = this.page.getByRole('combobox');
      if (await dropdowns.count() < 3) {
        throw new Error('Cannot locate ' + label + ' dropdown. Found ' + await dropdowns.count() + ' comboboxes.');
      }
      // Fallback for an unlabeled form: event type, start time, end time.
      control = dropdowns.nth(label === 'Start Time' ? 1 : 2);
    }
    control = control.first();
    const tag = await control.evaluate(el => el.tagName.toLowerCase());
    const normalize = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
    const desired = [normalize(time24h), normalize(time12h)];
    const matchesTime = text => {
      const value = normalize(text);
      return desired.some(time => value === time || value.startsWith(time + ' ') || value.startsWith(time + '–') || value.startsWith(time + '-'));
    };
    if (tag === 'select') {
      const available = await control.locator('option').evaluateAll(els => els.map(el => ({ value: el.value, text: el.textContent.trim() })));
      const found = available.find(o => matchesTime(o.text) || matchesTime(o.value));
      if (!found) throw new Error(label + ' native select contains no matching time for ' + time12h + '. Options: ' + JSON.stringify(available.slice(0, 30)));
      await control.selectOption(found.value);
      return;
    }

    await control.click();
    const options = this.page.getByRole('option');
    // Playwright count() does not wait. Give asynchronously rendered menus time to appear.
    try {
      await expect.poll(async () => await options.count(), { timeout: 1500, intervals: [100, 200, 300] }).toBeGreaterThan(0);
    } catch {
      // Some custom dropdowns use plain buttons rather than role=option.
    }
    const optionTexts = await options.allTextContents();
    const index = optionTexts.findIndex(matchesTime);
    if (index !== -1) {
      await options.nth(index).click();
      return;
    }

    for (const time of [time12h, time24h]) {
      const byText = this.page.getByText(time, { exact: true });
      const buttons = this.page.getByRole('button', { name: time, exact: true });
      if (await buttons.count() > 0 && await buttons.first().isVisible()) {
        await buttons.first().click();
        return;
      }
      if (await byText.count() > 0 && await byText.first().isVisible()) {
        await byText.first().click();
        return;
      }
    }

    const controls = await this.page.getByRole('combobox').evaluateAll(els => els.map(el => ({
      label: el.getAttribute('aria-label'),
      role: el.getAttribute('role'),
      text: (el.textContent || '').trim().slice(0, 90)
    })));
    throw new Error(
      'Cannot select ' + label + ' (' + time24h + ' / ' + time12h + '). ' +
      'Opened control: ' + JSON.stringify(await control.evaluate(el => ({
        label: el.getAttribute('aria-label'),
        text: (el.textContent || '').trim().slice(0, 120)
      }))) + '. Accessible option texts: ' + JSON.stringify(optionTexts.slice(0, 40)) +
      '. Comboboxes: ' + JSON.stringify(controls) + '. Please share this diagnostic.'
    );
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
