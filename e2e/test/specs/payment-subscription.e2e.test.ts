import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { WebDriver } from 'selenium-webdriver';
import { By } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { MemberProfilePage } from '../pages/MemberProfilePage';
import { MembersPage } from '../pages/MembersPage';
import { PaymentsPage } from '../pages/PaymentsPage';
import { createDriver, quitDriver } from '../utils/driverFactory';

const FRONTEND_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const LOGIN_USERNAME = process.env.E2E_LOGIN_USERNAME ?? process.env.SEED_STAFF_USERNAME ?? 'staff';
const LOGIN_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? process.env.SEED_STAFF_PASSWORD;
const ARTIFACT_DIR = path.resolve(__dirname, '../../artifacts');

const SEEDED_ACTIVE_MEMBER = {
  fullName: 'Carlos Reyes',
  contactNumber: '09170000001',
};

describe('Payment and subscription tracking e2e', () => {
  let driver: WebDriver | undefined;
  let loginPage: LoginPage;
  let membersPage: MembersPage;
  let paymentsPage: PaymentsPage;
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
    paymentsPage = new PaymentsPage(driver);
    memberProfilePage = new MemberProfilePage(driver);
  });

  afterAll(async () => {
    await quitDriver(driver);
  });

  async function collectDiagnostics(label: string): Promise<void> {
    if (!driver) {
      return;
    }

    await mkdir(ARTIFACT_DIR, { recursive: true });
    const safeLabel = label.replace(/[^a-zA-Z0-9_-]/g, '-');

    const currentUrl = await driver.getCurrentUrl().catch(() => 'unavailable');
    const pageTitle = await driver.getTitle().catch(() => 'unavailable');
    const bodyText = await driver
      .findElement(By.css('body'))
      .getText()
      .then((text) => text.slice(0, 2000))
      .catch(() => 'unavailable');

    await writeFile(
      path.join(ARTIFACT_DIR, `${safeLabel}.txt`),
      `url=${currentUrl}\ntitle=${pageTitle}\n\nbody:\n${bodyText}\n`,
      'utf8',
    );

    const screenshot = await driver.takeScreenshot().catch(() => undefined);
    if (screenshot) {
      await writeFile(path.join(ARTIFACT_DIR, `${safeLabel}.png`), screenshot, 'base64');
    }
  }

  beforeEach(async () => {
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        await loginPage.open(FRONTEND_URL);
        await loginPage.login({
          role: 'Staff',
          username: LOGIN_USERNAME,
          password: LOGIN_PASSWORD as string,
        });

        await loginPage.waitForMembersPage();
        await membersPage.waitUntilLoaded();
        return;
      } catch (error) {
        await collectDiagnostics(`beforeEach-attempt-${attempt}`);
        if (attempt === maxAttempts) {
          throw error;
        }
      }
    }
  });

  it('staff processes payment on the payments page', async () => {
    await paymentsPage.openFromSidebar();
    await paymentsPage.searchAndSelectMember(SEEDED_ACTIVE_MEMBER.contactNumber, SEEDED_ACTIVE_MEMBER.fullName);
    await paymentsPage.selectPaymentMethod('GCASH');
    await paymentsPage.selectPlanByName('Quarterly Plus');
    await paymentsPage.submitPayment();
    await paymentsPage.assertSubmitSuccess();
  });

  it('staff views member payment history and filters by April', async () => {
    await paymentsPage.openFromSidebar();
    await paymentsPage.searchAndSelectMember(SEEDED_ACTIVE_MEMBER.contactNumber, SEEDED_ACTIVE_MEMBER.fullName);
    await paymentsPage.selectPaymentMethod('CASH');
    await paymentsPage.selectPlanByName('Daily Pass');
    await paymentsPage.submitPayment();
    await paymentsPage.assertSubmitSuccess();

    await paymentsPage.openMembersFromSidebar();
    await membersPage.waitUntilLoaded();
    await membersPage.searchMember(SEEDED_ACTIVE_MEMBER.contactNumber);
    await membersPage.openMemberByFullName(SEEDED_ACTIVE_MEMBER.fullName);

    await memberProfilePage.waitUntilLoaded();
    await memberProfilePage.openPaymentHistoryTab();
    await memberProfilePage.filterPaymentHistoryByMonth('April');
    await memberProfilePage.assertPaymentHistoryIncludes('April');
    await memberProfilePage.assertPaymentHistoryExcludes('March');
  });
});
