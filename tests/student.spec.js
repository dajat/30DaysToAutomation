import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { StudentPage } from '../pages/studentPage.js';
import { LoginStudentData } from '../test-data/studentData.js';

test.describe('Student Management', () => {
  let studentPage;

  test.beforeEach(async ({ page }) => {
    studentPage = new StudentPage(page);
    const loginPage = new LoginStudentData(page);
    await loginPage.login();
    await studentPage.navigate();
  });

  test('TC-01: Verify page title is displayed correctly', async () => {
    await studentPage.verifyPageTitle();
    await expect(studentPage.pageSubtitle).toBeVisible();
  });

  test('TC-02: Verify existing student is present', async () => {
    await studentPage.verifyStudentPresent(studentPage.existingStudents[0].name);
  });

  test('TC-03: Add a new student successfully', async () => {
    const student = {
      ...studentPage.newStudents[0],
      name: `Playwright Student ${randomUUID().slice(0, 8)}`,
      email: `student-${randomUUID()}@example.com`
    };
    const initialCount = await studentPage.getStudentCount();

    await studentPage.addStudent(student);
    await expect.poll(() => studentPage.getStudentCount()).toBe(initialCount + 1);
    await studentPage.verifyStudentPresent(student.name);
  });

  test('TC-04: Verify newly added student is visible', async () => {
    const student = {
      ...studentPage.newStudents[1],
      name: `Playwright Student ${randomUUID().slice(0, 8)}`,
      email: `student-${randomUUID()}@example.com`
    };
    await studentPage.addStudent(student);
    await studentPage.verifyStudentPresent(student.name);
  });
});
