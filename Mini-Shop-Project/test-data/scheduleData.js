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
    this.eventDialog = page.getByRole('dialog');
    this.eventTitleInput = this.eventDialog.getByPlaceholder(/Enter event title/i);
    this.eventLocationInput = this.eventDialog.getByPlaceholder(/Room or location/i);
    this.eventTypeSelect = this.eventDialog.getByRole('combobox').first();
    // Time controls may be native selects or accessible custom dropdowns.
    // Resolve them when the Add Event form is open, not before.

    this.descriptionInput = this.eventDialog.getByPlaceholder('Additional details...', { exact: true });
    this.saveButton = this.eventDialog.getByRole('button', { name: /^(Schedule Event|Update Event|Save Changes|Save|Submit)$/i });
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

    // Choose the event type before filling the remaining fields, since it can alter the form.
    if (eventData.type) {
      await this.eventTypeSelect.click();
      await this.page.getByRole('option', { name: eventData.type, exact: true }).click();
    }

    if (eventData.location) await this.eventLocationInput.fill(eventData.location);
    if (eventData.startTime) await this.selectTime('Start Time', eventData.startTime);
    if (eventData.endTime) await this.selectTime('End Time', eventData.endTime);
    if (eventData.description) await this.descriptionInput.fill(eventData.description);

    await this.saveButton.click();
    await expect(this.eventTitleInput).toBeHidden();
    await this.verifyEventPresent(eventData.title);
  }

  /** Select a scheduled time from a native select or custom dropdown. */
  async selectTime(label, time24h) {
    const [hours, minutes] = time24h.split(':').map(Number);
    const time12h = String(hours % 12 || 12) + ':' + String(minutes).padStart(2, '0') + ' ' + (hours >= 12 ? 'PM' : 'AM');
    // The event form has several dropdowns (Type, Subject, Start Time, End Time).
    // In the recording, the old nth(1) fallback opens Subject, not Start Time.
    const placeholder = label === 'Start Time' ? /select start time/i : /select end time/i;
    let control = this.page.getByRole('combobox').filter({ hasText: placeholder });
    if (await control.count() === 0) control = this.page.getByText(placeholder, { exact: true });
    if (await control.count() === 0) control = this.page.getByRole('combobox', { name: new RegExp(label, 'i') });
    if (await control.count() === 0) control = this.page.getByLabel(new RegExp(label, 'i'));
    if (await control.count() === 0) {
      const comboboxes = await this.page.getByRole('combobox').allTextContents();
      throw new Error('Could not find ' + label + ' dropdown; expected placeholder Select ' + label.toLowerCase() + '. Combobox texts: ' + JSON.stringify(comboboxes));
    }
    control = control.first();
    const tag = await control.evaluate(el => el.tagName.toLowerCase());
    // Capture the control before clicking: opening a portal may unmount it.
    const controlBeforeOpen = await control.evaluate(el => ({
      tag: el.tagName,
      role: el.getAttribute('role'),
      label: el.getAttribute('aria-label'),
      text: (el.textContent || '').trim().slice(0, 100),
      html: el.outerHTML.slice(0, 300)
    }));
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

    // Never re-query the clicked control here: it may have unmounted.
    // Use a page snapshot so failed selections produce actionable details.
    const diagnostic = await this.page.evaluate(() => {
      const compact = el => ({
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        label: el.getAttribute('aria-label'),
        text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100)
      });
      const all = Array.from(document.querySelectorAll('[role="option"], [role="listbox"], [role="combobox"], [role="dialog"], button, select'));
      const timeLike = all.filter(el => /\b\d{1,2}:\d{2}\b|start time|end time|select time/i.test((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')));
      return {
        timeRelatedElements: timeLike.slice(0, 30).map(compact),
        visibleComboboxes: Array.from(document.querySelectorAll('[role="combobox"]')).slice(0, 10).map(compact),
        roleOptions: Array.from(document.querySelectorAll('[role="option"]')).slice(0, 30).map(compact)
      };
    });
    throw new Error(
      'Cannot select ' + label + ' (' + time24h + ' / ' + time12h + '). ' +
      'Control before opening: ' + JSON.stringify(controlBeforeOpen) +
      '. Accessible option texts: ' + JSON.stringify(optionTexts.slice(0, 40)) +
      '. Dropdown DOM snapshot: ' + JSON.stringify(diagnostic)
    );
  }
  async verifyEventPresent(title) {
    await expect(this.getEventCardByTitle(title)).toBeVisible();
  }

  getEventCardByTitle(title) {
    return this.page.locator('[class~="group/event"]').filter({
      has: this.page.getByText(title, { exact: true })
    });
  }

  async openEventDetails(title) {
    await this.getEventCardByTitle(title).click();
    const details = this.page.getByRole('dialog', { name: title, exact: true });
    await expect(details).toBeVisible();
    return details;
  }

  async editEvent(oldTitle, newData) {
    const details = await this.openEventDetails(oldTitle);
    await details.getByRole('button', { name: 'Edit', exact: true }).click();
    const form = this.page.getByRole('dialog', { name: 'Edit Event', exact: true });
    await expect(form).toBeVisible();

    if (newData.title) await form.locator('label:text-is("Title") + input').fill(newData.title);
    if (newData.location) await form.locator('label:text-is("Location") + input').fill(newData.location);

    await form.getByRole('button', { name: 'Save Changes', exact: true }).click();
    await expect(form).toBeHidden();
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
      type: 'Event',
      startTime: '14:00',
      endTime: '15:00',
      description: 'Annual check-up with Dr. Smith.'
    },
    {
      title: 'event 3',
      location: 'Fitness Center',
      type: 'Event',
      startTime: '18:00',
      endTime: '19:00',
      description: 'Evening yoga session for relaxation.'
    },
    {
      title: 'event 4',
      location: 'Downtown Restaurant',
      type: 'Event',
      startTime: '19:00',
      endTime: '20:30',
      description: 'Catch up with friends over dinner.'
    },
  ],
  eventUpdates: [
    { newData: { title: 'Updated Team Meeting', location: 'Conference Room B' } },
    { newData: { title: "Updated Doctor's Appointment", location: 'Health Clinic - Room 202' } }
  ]
};
