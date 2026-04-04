import type { WebDriver } from 'selenium-webdriver';
import { LoginPage } from '../pages/LoginPage';
import { createDriver, quitDriver } from '../utils/driverFactory';

const FRONTEND_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173';
const LOGIN_USERNAME = process.env.E2E_LOGIN_USERNAME ?? process.env.SEED_STAFF_USERNAME ?? 'staff';
const LOGIN_PASSWORD = process.env.E2E_LOGIN_PASSWORD ?? process.env.SEED_STAFF_PASSWORD;

describe('Login smoke e2e', () => {
  let driver: WebDriver | undefined;
  let loginPage: LoginPage;

  beforeAll(async () => {
    if (!LOGIN_PASSWORD) {
      throw new Error(
        'Missing login password. Set E2E_LOGIN_PASSWORD or SEED_STAFF_PASSWORD before running E2E tests.',
      );
    }

    driver = await createDriver();
    loginPage = new LoginPage(driver);
  });

  afterAll(async () => {
    await quitDriver(driver);
  });

  it('logs in and shows the members page', async () => {
    await loginPage.open(FRONTEND_URL);
    await loginPage.login({
      role: 'Staff',
      username: LOGIN_USERNAME,
      password: LOGIN_PASSWORD as string,
    });

    await loginPage.waitForMembersPage();

    const currentUrl = await driver?.getCurrentUrl();
    expect(currentUrl).toContain('/dashboard/members');
  });
});
