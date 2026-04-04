import { By, type WebDriver } from 'selenium-webdriver';
import {
  buttonByText,
  DEFAULT_TIMEOUT_MS,
  waitForUrlContains,
  waitForVisible,
} from '../utils/driverFactory';

export type LoginRole = 'Staff' | 'Owner';

export interface LoginCredentials {
  role: LoginRole;
  username: string;
  password: string;
}

export class LoginPage {
  constructor(
    private readonly driver: WebDriver,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async open(baseUrl: string): Promise<void> {
    await this.driver.get(baseUrl);
    await waitForVisible(this.driver, buttonByText('Staff'), this.timeoutMs);
  }

  async selectRole(role: LoginRole): Promise<void> {
    const usernameFieldLocator = By.css('input[placeholder="Username"]');

    if (await this.isCredentialsStepVisible()) {
      return;
    }

    const roleButton = await waitForVisible(this.driver, buttonByText(role), this.timeoutMs);
    await roleButton.click();

    try {
      await waitForVisible(this.driver, usernameFieldLocator, this.timeoutMs);
      return;
    } catch {
      await this.driver.executeScript('arguments[0].click();', roleButton);
      await waitForVisible(this.driver, usernameFieldLocator, this.timeoutMs);
    }
  }

  async enterUsername(username: string): Promise<void> {
    const usernameInput = await waitForVisible(
      this.driver,
      By.css('input[placeholder="Username"]'),
      this.timeoutMs,
    );

    await usernameInput.clear();
    await usernameInput.sendKeys(username);
  }

  async enterPassword(password: string): Promise<void> {
    const passwordInput = await waitForVisible(
      this.driver,
      By.css('input[placeholder="Password"]'),
      this.timeoutMs,
    );

    await passwordInput.clear();
    await passwordInput.sendKeys(password);
  }

  async submit(): Promise<void> {
    const submitButton = await waitForVisible(this.driver, buttonByText('Log In'), this.timeoutMs);
    await submitButton.click();
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.selectRole(credentials.role);
    await this.enterUsername(credentials.username);
    await this.enterPassword(credentials.password);
    await this.submit();
  }

  async waitForMembersPage(): Promise<void> {
    await waitForUrlContains(this.driver, '/dashboard/members', this.timeoutMs);
    await waitForVisible(
      this.driver,
      By.xpath('//h1[normalize-space()="Members"]'),
      this.timeoutMs,
    );
  }

  private async isCredentialsStepVisible(): Promise<boolean> {
    const usernameFields = await this.driver.findElements(By.css('input[placeholder="Username"]'));
    if (usernameFields.length === 0) {
      return false;
    }

    return usernameFields[0].isDisplayed();
  }
}
