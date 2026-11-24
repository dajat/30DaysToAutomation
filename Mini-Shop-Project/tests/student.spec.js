import { test, expect } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { StudentPage } from '../pages/studentPage.js';
import { LoginStudentData } from '../test-data/studentData.js';

test.describe('Student Management', () => {
  let studentPage;
  let createdStudent;

  test.beforeEach(async ({ page }) => {
    createdStudent = undefined;
    studentPage = new StudentPage(page);
    const loginPage = new LoginStudentData(page);
    await loginPage.login();
    await studentPage.navigate();
  });

  test.afterEach(async () => {
    if (createdStudent) await studentPage.deleteStudentIfPresent(createdStudent);
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
    createdStudent = student;
    await studentPage.addStudent(student);
    await studentPage.verifyStudentDetails(student);
  });

  test('TC-04: Find the newly added student by name', async () => {
    const student = {
      ...studentPage.newStudents[1],
      name: `Playwright Student ${randomUUID().slice(0, 8)}`,
      email: `student-${randomUUID()}@example.com`
    };
    createdStudent = student;
    await studentPage.addStudent(student);
    const existingStudent = studentPage.getStudentCardByName(studentPage.existingStudents[0].name);
    await expect(existingStudent).toBeVisible();
    await studentPage.searchStudent(student.name);
    await expect(existingStudent).toHaveCount(0);
    await studentPage.verifyStudentDetails(student);
  });
});
