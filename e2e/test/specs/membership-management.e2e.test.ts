import type { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { MemberProfilePage } from '../pages/MemberProfilePage';
import { MembersPage, type MemberFormValues } from '../pages/MembersPage';
import { createDriver, quitDriver } from '../utils/driverFactory';

const FRONTEND_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const LOGIN_USERNAME = process.env.E2E_LOGIN_USERNAME ?? process.env.SEED_STAFF_USERNAME ?? 'staff';
const LOGIN_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? process.env.SEED_STAFF_PASSWORD;

function buildUniqueMember(seed: string): MemberFormValues {
  const uniqueToken = `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-8);

  return {
    firstName: `${seed}First${uniqueToken.slice(0, 3)}`,
    lastName: `${seed}Last${uniqueToken.slice(3)}`,
    contactNumber: `09${uniqueToken}1`,
    notes: `${seed} notes ${uniqueToken}`,
  };
}

describe('Membership management e2e', () => {
  let driver: WebDriver | undefined;
  let loginPage: LoginPage;
  let membersPage: MembersPage;
  let memberProfilePage: MemberProfilePage;

  beforeAll(async () => {
    if (!LOGIN_PASSWORD) {
      throw new Error(
        'Missing login password. Set E2E_LOGIN_PASSWORD or SEED_STAFF_PASSWORD before running E2E tests.',
      );
    }

    driver = await createDriver();
    loginPage = new LoginPage(driver);
    membersPage = new MembersPage(driver);
    memberProfilePage = new MemberProfilePage(driver);
  });

  afterAll(async () => {
    await quitDriver(driver);
  });

  beforeEach(async () => {
    await loginPage.open(FRONTEND_URL);
    await loginPage.login({
      role: 'Staff',
      username: LOGIN_USERNAME,
      password: LOGIN_PASSWORD as string,
    });
    await membersPage.waitUntilLoaded();
  });

  it('staff login', async () => {
    const currentUrl = await driver?.getCurrentUrl();
    expect(currentUrl).toContain('/dashboard/members');
  });

  it('staff adds new member', async () => {
    const newMember = buildUniqueMember('AddMember');

    await membersPage.addMember(newMember);
    await membersPage.searchMember(newMember.contactNumber);

    const createdRow = await membersPage.waitForMemberRow(`${newMember.firstName} ${newMember.lastName}`);
    expect(await createdRow.isDisplayed()).toBe(true);
  });

  it('staff filters active list, searches member, edits profile fields, then deactivates', async () => {
    const targetMember = buildUniqueMember('ManageMember');
    const nextContactLastDigit = targetMember.contactNumber.endsWith('8') ? '7' : '8';
    const updatedMember: MemberFormValues = {
      firstName: `${targetMember.firstName}Updated`,
      lastName: `${targetMember.lastName}Updated`,
      contactNumber: `${targetMember.contactNumber.slice(0, -1)}${nextContactLastDigit}`,
      notes: `${targetMember.notes} updated`,
    };

    await membersPage.addMember(targetMember);
    await membersPage.applyActiveFilter();
    await membersPage.searchMember(targetMember.contactNumber);
    await membersPage.openMemberByFullName(`${targetMember.firstName} ${targetMember.lastName}`);

    await memberProfilePage.waitUntilLoaded();
    await memberProfilePage.editProfile(updatedMember);
    await memberProfilePage.assertNameBanner(`${updatedMember.firstName} ${updatedMember.lastName}`);
    await memberProfilePage.assertContactNumber(updatedMember.contactNumber);
    await memberProfilePage.assertNotes(updatedMember.notes);

    await memberProfilePage.deactivateMember();
    await memberProfilePage.assertDeactivateButtonDisabled();
  });
});
