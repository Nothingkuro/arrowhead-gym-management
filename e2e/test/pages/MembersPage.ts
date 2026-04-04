import { By, Key, type WebDriver } from 'selenium-webdriver';
import { buttonByText, DEFAULT_TIMEOUT_MS, waitForVisible } from '../utils/driverFactory';

export interface MemberFormValues {
  firstName: string;
  lastName: string;
  contactNumber: string;
  notes: string;
}

export class MembersPage {
  constructor(
    private readonly driver: WebDriver,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async waitUntilLoaded(): Promise<void> {
    await waitForVisible(this.driver, By.xpath('//h1[normalize-space()="Members"]'), this.timeoutMs);
    await waitForVisible(this.driver, By.css('input[placeholder="Search member..."]'), this.timeoutMs);
  }

  async addMember(member: MemberFormValues): Promise<void> {
    await this.openAddMemberModal();
    await this.fillMemberForm(member);
    await this.submitMemberForm('Submit');
  }

  async applyActiveFilter(): Promise<void> {
    const filterButton = await waitForVisible(this.driver, buttonByText('Filter'), this.timeoutMs);
    await filterButton.click();

    const activeOption = await waitForVisible(this.driver, buttonByText('Active'), this.timeoutMs);
    await activeOption.click();
  }

  async searchMember(searchText: string): Promise<void> {
    const searchInput = await waitForVisible(
      this.driver,
      By.css('input[placeholder="Search member..."]'),
      this.timeoutMs,
    );

    await searchInput.click();
    await searchInput.sendKeys(Key.CONTROL, 'a');
    await searchInput.sendKeys(Key.DELETE);
    await searchInput.sendKeys(searchText);

    await this.driver.wait(async () => {
      const value = await searchInput.getAttribute('value');
      return value === searchText;
    }, this.timeoutMs);
  }

  async openMemberByFullName(fullName: string): Promise<void> {
    const memberRow = await this.waitForMemberRow(fullName);
    await memberRow.click();
  }

  async waitForMemberRow(fullName: string, timeoutMs?: number) {
    const effectiveTimeoutMs = timeoutMs ?? this.timeoutMs;
    const rowLocator = By.xpath(
      `//span[@title="${fullName}"]/ancestor::div[contains(@class, "cursor-pointer")][1]`,
    );

    return waitForVisible(this.driver, rowLocator, effectiveTimeoutMs);
  }

  private async openAddMemberModal(): Promise<void> {
    const firstNameLocator = By.css('input[placeholder="First Name"]');

    const openInputs = await this.driver.findElements(firstNameLocator);
    if (openInputs.length > 0 && await openInputs[0].isDisplayed()) {
      return;
    }

    const addMemberButton = await waitForVisible(
      this.driver,
      By.xpath('//button[.//span[normalize-space()="Member"]]'),
      this.timeoutMs,
    );

    await addMemberButton.click();

    try {
      await waitForVisible(this.driver, firstNameLocator, this.timeoutMs);
      return;
    } catch {
      await this.driver.executeScript('arguments[0].click();', addMemberButton);
      await waitForVisible(this.driver, firstNameLocator, this.timeoutMs);
    }
  }

  private async fillMemberForm(member: MemberFormValues): Promise<void> {
    await this.setInputValue(By.css('input[placeholder="First Name"]'), member.firstName);
    await this.setInputValue(By.css('input[placeholder="Last Name"]'), member.lastName);
    await this.setInputValue(By.css('input[placeholder="Contact Number"]'), member.contactNumber);
    await this.setInputValue(By.css('textarea[placeholder="Notes"]'), member.notes);
  }

  private async setInputValue(locator: By, value: string): Promise<void> {
    const input = await waitForVisible(this.driver, locator, this.timeoutMs);
    await input.click();
    await input.sendKeys(Key.CONTROL, 'a');
    await input.sendKeys(Key.DELETE);
    await input.sendKeys(value);
  }

  private async submitMemberForm(submitButtonText: string): Promise<void> {
    const submitButton = await waitForVisible(this.driver, buttonByText(submitButtonText), this.timeoutMs);
    await submitButton.click();

    await this.driver.wait(async () => {
      const modalInputs = await this.driver.findElements(By.css('input[placeholder="First Name"]'));
      if (modalInputs.length === 0) {
        return true;
      }

      const errorMessages = await this.driver.findElements(By.css('div.text-red-600'));
      if (errorMessages.length === 0) {
        return false;
      }

      return errorMessages[0].isDisplayed();
    }, this.timeoutMs);

    const modalInputs = await this.driver.findElements(By.css('input[placeholder="First Name"]'));
    if (modalInputs.length > 0) {
      const errorMessages = await this.driver.findElements(By.css('div.text-red-600'));
      const message = errorMessages.length > 0
        ? await errorMessages[0].getText()
        : 'Member modal did not close after submit.';
      throw new Error(`Add member failed in E2E: ${message}`);
    }
  }
}
