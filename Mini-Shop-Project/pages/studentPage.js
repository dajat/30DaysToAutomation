import { expect } from '@playwright/test';

class StudentPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.getByRole('heading', { name: 'Student Management' });
    this.pageSubtitle = page.getByText('Manage your students and their information');
    this.addStudentButton = page.getByRole('button', { name: 'Add Student' });
    this.searchInput = page.getByPlaceholder('Search students...');
    this.studentCountBadge = page.getByText(/\d+\s+Students?/i);
    this.studentTab = page.getByRole('link', { name: /Students/i });

    this.modal = page.getByRole('dialog');
    this.inputStudentName = this.modal.getByPlaceholder('Enter full name');
    this.inputStudentEmail = this.modal.getByPlaceholder('student@email.com');
    this.inputPhone = this.modal.getByPlaceholder('(555) 123-4567');
    this.inputAddress = this.modal.getByPlaceholder('Full address');
    this.selectGrade = this.modal.getByRole('button', { name: /Select grade/i });
    this.inputParentName = this.modal.getByPlaceholder('Parent/Guardian name');
    this.inputParentEmail = this.modal.getByPlaceholder('parent@email.com');
    this.submitButton = this.modal.getByRole('button', { name: 'Add Student' });
    this.cancelButton = this.modal.getByRole('button', { name: 'Cancel' });

    this.existingStudents = [
      { name: 'Emma Johnson' },
      { name: 'Michael Chen' },
      { name: 'Sofia Rodriguez' }
    ];
    this.newStudents = [
      {
        name: 'John Doe', email: 'john.doe@email.com', grade: 'Grade 10',
        phone: '(555) 000-1111', address: '123 Test St',
        parentName: 'Jane Doe', parentEmail: 'jane.doe@email.com'
      },
      { name: 'Alice Smith', email: 'alice.s@email.com', grade: 'Grade 11' }
    ];
  }

  async navigate() {
    await this.studentTab.click();
    await expect(this.pageTitle).toBeVisible();
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async verifyPageTitle() {
    await expect(this.pageTitle).toHaveText('Student Management');
  }

  getStudentCardByName(studentName) {
    return this.page.locator('div').filter({ hasText: studentName })
      .filter({ has: this.page.getByText(/Grade \d+/) }).last();
  }

  async verifyStudentPresent(studentName) {
    await expect(this.getStudentCardByName(studentName)).toBeVisible();
  }

  async getStudentCount() {
    await expect(this.studentCountBadge).toBeVisible();
    const badgeText = await this.studentCountBadge.textContent();
    const match = badgeText?.match(/(\d+)/);
    if (!match) throw new Error(`Could not parse student count from: ${badgeText}`);
    return Number(match[1]);
  }

  async clickAddStudent() {
    await this.addStudentButton.click();
    await expect(this.modal).toBeVisible();
  }

  async selectGradeOption(grade) {
    await this.selectGrade.click();
    await this.page.getByRole('option', { name: grade, exact: true }).click();
  }

  async addStudent(studentData) {
    await this.clickAddStudent();
    await this.inputStudentName.fill(studentData.name);
    await this.inputStudentEmail.fill(studentData.email);
    await this.selectGradeOption(studentData.grade);

    if (studentData.phone) await this.inputPhone.fill(studentData.phone);
    if (studentData.address) await this.inputAddress.fill(studentData.address);
    if (studentData.parentName) await this.inputParentName.fill(studentData.parentName);
    if (studentData.parentEmail) await this.inputParentEmail.fill(studentData.parentEmail);

    await this.submitButton.click();
    await expect(this.modal).toBeHidden();
  }

  async searchStudent(searchTerm) {
    await this.searchInput.fill(searchTerm);
  }
}

export { StudentPage };
