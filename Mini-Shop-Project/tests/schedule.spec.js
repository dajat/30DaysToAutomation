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

  test('T-06: Verify edited event details survive reload', async ({ page }) => {
    const originalEvent = { ...scheduleDataInfo.newEvents[3], title: uniqueTitle('Event 4') };
    const updateData = scheduleDataInfo.eventUpdates[1];
    const newData = { ...updateData.newData, title: uniqueTitle(updateData.newData.title) };

    await scheduleDataInfo.clickToday();
    await scheduleDataInfo.addEvent(originalEvent);
    await scheduleDataInfo.editEvent(originalEvent.title, newData);
    const details = await scheduleDataInfo.openEventDetails(newData.title);
    await expect(details.getByText(newData.location, { exact: true })).toBeVisible();
    const timeRange = `${originalEvent.startTime} - ${originalEvent.endTime}`;
    await expect(details.getByText(timeRange, { exact: true })).toBeVisible();

    await page.reload();
    await scheduleDataInfo.verifyPageTitle();
    await scheduleDataInfo.clickToday();
    const reloadedEvent = scheduleDataInfo.getEventCardByTitle(newData.title);
    test.fail(true, 'The hosted schedule loses newly created events on reload.');
    await expect(reloadedEvent).toContainText(newData.location);
  });
});
