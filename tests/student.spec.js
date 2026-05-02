import { test, expect } from '@playwright/test';
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
    const existingStudent = studentPage.existingStudents[0];
    await studentPage.verifyStudentPresent(existingStudent.name);
  });

  test('TC-03: Add a new student successfully', async () => {
    const newStudent = studentPage.newStudents[0];
    const initialCount = await studentPage.getStudentCount();
    
    await studentPage.addStudent(newStudent);
    
    const newCount = await studentPage.getStudentCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('TC-04: Verify newly added student is visible', async () => {
    const newStudent = studentPage.newStudents[1];
    await studentPage.addStudent(newStudent);
    await studentPage.verifyStudentPresent(newStudent.name);
  });
});