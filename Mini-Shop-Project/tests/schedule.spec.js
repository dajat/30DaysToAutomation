import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { SchedulePage } from '../pages/schedulePage.js';
import { ScheduleData } from '../test-data/scheduleData.js';
import { DateUtils } from '../utils/dateUtil.js';
import { LoginStudentData } from '../test-data/studentData.js';

const uniqueTitle = (base) => `${base} ${randomUUID().slice(0, 8)}`;

test.describe('Schedule Management', () => {
  let schedulePageInstance;
  let scheduleDataInfo;

  test.beforeEach(async ({ page }) => {
    schedulePageInstance = new SchedulePage(page);
    scheduleDataInfo = new ScheduleData(page);
    const loginPage = new LoginStudentData(page);
    await loginPage.login();
    await scheduleDataInfo.navigate();
  });

  test('T-01: Verify page title is displayed correctly', async () => {
    await scheduleDataInfo.verifyPageTitle();
    await expect(scheduleDataInfo.pageSubtitle).toBeVisible();
  });

  test("T-02: Verify today's date is displayed correctly", async () => {
    await schedulePageInstance.hoverToday();
    await expect(scheduleDataInfo.todaysDateLocator).toHaveText(DateUtils.getFormattedDate());
  });

  test('T-03: Create an event for today', async () => {
    const eventData = { ...scheduleDataInfo.newEvents[0], title: uniqueTitle('Event 1') };
    await scheduleDataInfo.hoverToday();
    await scheduleDataInfo.addEvent(eventData);
    await scheduleDataInfo.verifyEventPresent(eventData.title);
  });

  test('T-04: Verify new event is visible', async () => {
    const eventData = { ...scheduleDataInfo.newEvents[1], title: uniqueTitle('Event 2') };
    await scheduleDataInfo.clickToday();
    await scheduleDataInfo.addEvent(eventData);
    const eventCard = scheduleDataInfo.getEventCardByTitle(eventData.title);
    await expect(eventCard).toContainText(eventData.location);
  });

  test('T-05: Edit an existing event', async () => {
    const originalEvent = { ...scheduleDataInfo.newEvents[2], title: uniqueTitle('Event 3') };
    const updateData = scheduleDataInfo.eventUpdates[0];
    const newData = { ...updateData.newData, title: uniqueTitle(updateData.newData.title) };

    await scheduleDataInfo.clickToday();
    await scheduleDataInfo.addEvent(originalEvent);
    await scheduleDataInfo.editEvent(originalEvent.title, newData);
    await expect(scheduleDataInfo.getEventCardByTitle(newData.title)).toContainText(newData.location);
  });

  test('T-06: Verify edited event shows updated information', async () => {
    const originalEvent = { ...scheduleDataInfo.newEvents[3], title: uniqueTitle('Event 4') };
    const updateData = scheduleDataInfo.eventUpdates[1];
    const newData = { ...updateData.newData, title: uniqueTitle(updateData.newData.title) };

    await scheduleDataInfo.clickToday();
    await scheduleDataInfo.addEvent(originalEvent);
    await scheduleDataInfo.editEvent(originalEvent.title, newData);
    await expect(scheduleDataInfo.getEventCardByTitle(newData.title)).toContainText(newData.location);
  });
});
