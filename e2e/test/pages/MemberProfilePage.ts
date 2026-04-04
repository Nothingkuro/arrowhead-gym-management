import { By, Key, type WebDriver } from 'selenium-webdriver';
import { buttonByText, DEFAULT_TIMEOUT_MS, waitForText, waitForUrlContains, waitForVisible } from '../utils/driverFactory';
import type { MemberFormValues } from './MembersPage';

export class MemberProfilePage {
  constructor(
    private readonly driver: WebDriver,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  async waitUntilLoaded(): Promise<void> {
    await waitForUrlContains(this.driver, '/dashboard/members/', this.timeoutMs);
    await waitForVisible(this.driver, buttonByText('Edit Profile'), this.timeoutMs);
  }

  async editProfile(values: MemberFormValues): Promise<void> {
    const editButton = await waitForVisible(this.driver, buttonByText('Edit Profile'), this.timeoutMs);
    await editButton.click();

    await waitForVisible(this.driver, By.css('input[placeholder="First Name"]'), this.timeoutMs);

    await this.setInputValue(By.css('input[placeholder="First Name"]'), values.firstName);
    await this.setInputValue(By.css('input[placeholder="Last Name"]'), values.lastName);
    await this.setInputValue(By.css('input[placeholder="Contact Number"]'), values.contactNumber);
    await this.setInputValue(By.css('textarea[placeholder="Notes"]'), values.notes);

    const saveChangesButton = await waitForVisible(this.driver, buttonByText('Save Changes'), this.timeoutMs);
    await saveChangesButton.click();

    await this.driver.wait(async () => {
      const modalInputs = await this.driver.findElements(By.css('input[placeholder="First Name"]'));
      return modalInputs.length === 0;
    }, this.timeoutMs);
  }

  async deactivateMember(): Promise<void> {
    const deactivateButton = await waitForVisible(this.driver, buttonByText('Deactivate'), this.timeoutMs);
    await deactivateButton.click();
    await waitForVisible(
      this.driver,
      By.xpath('//span[normalize-space()="Status"]/following-sibling::span//span[normalize-space()="INACTIVE"]'),
      this.timeoutMs,
    );
  }

  async assertNameBanner(fullName: string): Promise<void> {
    await waitForVisible(
      this.driver,
      By.xpath(`//h1[normalize-space()="${fullName}"]`),
      this.timeoutMs,
    );
  }

  async assertContactNumber(contactNumber: string): Promise<void> {
    await waitForText(
      this.driver,
      By.xpath('//span[normalize-space()="Contact Number"]/following-sibling::span'),
      contactNumber,
      this.timeoutMs,
    );
  }

  async assertNotes(notes: string): Promise<void> {
    await waitForText(
      this.driver,
      By.xpath('//span[normalize-space()="Notes:"]/following-sibling::div'),
      notes,
      this.timeoutMs,
    );
  }

  async assertDeactivateButtonDisabled(): Promise<void> {
    const deactivateButton = await waitForVisible(this.driver, buttonByText('Deactivate'), this.timeoutMs);

    await this.driver.wait(async () => {
      return !(await deactivateButton.isEnabled());
    }, this.timeoutMs);
  }

  private async setInputValue(locator: By, value: string): Promise<void> {
    const input = await waitForVisible(this.driver, locator, this.timeoutMs);
    await input.click();
    await input.sendKeys(Key.CONTROL, 'a');
    await input.sendKeys(Key.DELETE);
    await input.sendKeys(value);
  }
}
