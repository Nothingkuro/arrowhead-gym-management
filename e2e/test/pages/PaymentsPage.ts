import { By, Key, type WebDriver, type WebElement } from 'selenium-webdriver';
import { Select } from 'selenium-webdriver/lib/select';
import { buttonByText, DEFAULT_TIMEOUT_MS, waitForUrlContains, waitForVisible } from '../utils/driverFactory';

export type PaymentMethod = 'CASH' | 'GCASH';

export class PaymentsPage {
  constructor(
    private readonly driver: WebDriver,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async openFromSidebar(): Promise<void> {
    await this.clickSidebarLink('/dashboard/payments');
    await this.waitUntilLoaded();
  }

  async openMembersFromSidebar(): Promise<void> {
    await this.clickSidebarLink('/dashboard/members');
    await waitForUrlContains(this.driver, '/dashboard/members', this.timeoutMs);
  }

  async waitUntilLoaded(): Promise<void> {
    await waitForUrlContains(this.driver, '/dashboard/payments', this.timeoutMs);
    await waitForVisible(this.driver, By.xpath('//h1[normalize-space()="Process Payment"]'), this.timeoutMs);
    await waitForVisible(this.driver, By.id('paymentMethod'), this.timeoutMs);

    await this.getEnabledMemberSearchInput();
  }

  async searchAndSelectMember(searchText: string, fullName: string): Promise<void> {
    const searchInput = await this.getEnabledMemberSearchInput();

    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "nearest"});', searchInput);
    await searchInput.click();

    try {
      await searchInput.sendKeys(Key.CONTROL, 'a');
      await searchInput.sendKeys(Key.DELETE);
      await searchInput.sendKeys(searchText);
    } catch {
      // Fallback for occasional headless driver key-modifier interaction issues.
      await searchInput.clear();
      await searchInput.sendKeys(searchText);
    }

    const memberSuggestion = await waitForVisible(
      this.driver,
      By.xpath(`//div[contains(@class, "max-h-40")]//button[.//span[normalize-space()="${fullName}"]]`),
      this.timeoutMs,
    );

    await memberSuggestion.click();

    await this.driver.wait(async () => {
      const value = await searchInput.getAttribute('value');
      return value === fullName;
    }, this.timeoutMs);
  }

  async selectPaymentMethod(method: PaymentMethod): Promise<void> {
    const paymentMethodSelect = await waitForVisible(this.driver, By.id('paymentMethod'), this.timeoutMs);
    const select = new Select(paymentMethodSelect);

    await select.selectByVisibleText(method);

    await this.driver.wait(async () => {
      const value = await paymentMethodSelect.getAttribute('value');
      return value === method;
    }, this.timeoutMs);
  }

  async selectPlanByName(planName: string): Promise<void> {
    const rowLocator = By.xpath(`//table//tbody/tr[td[1][normalize-space()="${planName}"]]`);
    const row = await waitForVisible(this.driver, rowLocator, this.timeoutMs);

    await row.click();

    await this.driver.wait(async () => {
      const selectedRow = await this.driver.findElements(
        By.xpath(`//table//tbody/tr[@aria-selected="true" and td[1][normalize-space()="${planName}"]]`),
      );
      return selectedRow.length > 0;
    }, this.timeoutMs);
  }

  async submitPayment(): Promise<void> {
    const submitButton = await waitForVisible(this.driver, buttonByText('Submit'), this.timeoutMs);

    await this.driver.wait(async () => submitButton.isEnabled(), this.timeoutMs);
    await submitButton.click();
  }

  async assertSubmitSuccess(): Promise<void> {
    await waitForVisible(
      this.driver,
      By.xpath('//p[normalize-space()="Payment recorded successfully."]'),
      this.timeoutMs,
    );
  }

  private async clickSidebarLink(path: '/dashboard/payments' | '/dashboard/members'): Promise<void> {
    const link = await this.driver.wait(async () => {
      const candidates = await this.driver.findElements(By.css(`a[href="${path}"]`));

      for (const candidate of candidates) {
        if (await candidate.isDisplayed()) {
          return candidate;
        }
      }

      return null;
    }, this.timeoutMs);

    if (!link) {
      throw new Error(`Sidebar link not found for path ${path}`);
    }

    await this.driver.executeScript('arguments[0].scrollIntoView({block: "center", inline: "nearest"});', link);

    try {
      await link.click();
    } catch {
      await this.driver.executeScript('arguments[0].click();', link);
    }
  }

  private async getEnabledMemberSearchInput(): Promise<WebElement> {
    const input = await this.driver.wait(async () => {
      const inputs = await this.driver.findElements(By.css('input[placeholder="Search member..."]'));

      for (const input of inputs) {
        if (await input.isDisplayed() && await input.isEnabled()) {
          return input;
        }
      }

      return null;
    }, this.timeoutMs);

    if (!input) {
      throw new Error('Enabled member search input not found on payments page.');
    }

    return input;
  }
}
