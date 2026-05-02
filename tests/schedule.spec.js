import { test, expect } from '@playwright/test';
import { SchedulePage } from '../pages/schedulePage.js';
import { ScheduleData } from '../test-data/scheduleData.js';
import { DateUtils } from '../utils/dateUtil.js';
import { LoginStudentData } from '../test-data/studentData.js';

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

  test('T-02: Verify today\'s date is displayed correctly', async () => {
    await schedulePageInstance.hoverToday();
    const expectedDate = DateUtils.getFormattedDate();
    await expect(scheduleDataInfo.todaysDateLocator).toHaveText(expectedDate);
  });

  test('T-03: Create an event for today', async () => {
    const eventData = scheduleDataInfo.newEvents[0]; 
    await scheduleDataInfo.hoverToday();
    await scheduleDataInfo.addEvent(eventData); 
    await scheduleDataInfo.verifyEventPresent(eventData.title);
  });

  test('T-04: Verify new event is visible', async () => {
    const eventTwoLocal = scheduleDataInfo.newEvents[1];
    await eventTwoLocal.clickToday();
    await eventTwoLocal.addEvent(eventTwoLocal);
    await eventTwoLocal.page.waitForTimeout(1000);
    await eventTwoLocal.verifyEventPresent(eventTwoLocal.title);

    const eventCard = eventTwoLocal.getEventCardByTitle(eventTwoLocal.title);
    await expect(eventCard).toContainText(eventTwoLocal.location);
  });

  test('T-05: Edit an existing event', async () => {
    const originalEvent = scheduleDataInfo.newEvents[2];
    await originalEvent.clickToday();
    await originalEvent.addEvent(originalEvent);
    await originalEvent.page.waitForTimeout(1000);

    const updateData = scheduleDataInfo.eventUpdates[0];
    await updateData.editEvent(originalEvent.title, updateData.newData);
    await updateData.page.waitForTimeout(1000);
    await updateData.verifyEventPresent(updateData.newData.title);
  });

  test('T-06: Verify edited event shows updated information', async () => {
    // 1. Get the data objects
  const originalEventData = scheduleDataInfo.newEvents[3];
  const updateData = scheduleDataInfo.eventUpdates[1];

  // 2. Use the Page Object Instance (scheduleDataInfo) to perform actions
  await scheduleDataInfo.clickToday();
  await scheduleDataInfo.addEvent(originalEventData);
  
  // 3. Perform the edit using the instance
  await scheduleDataInfo.editEvent(originalEventData.title, updateData.newData);
  
  // 4. Verify results using the instance locators
  const eventCard = scheduleDataInfo.getEventCardByTitle(updateData.newData.title);
  await expect(eventCard).toContainText(updateData.newData.location);
  });
});