import { Builder, By, type Locator, type WebDriver, type WebElement, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import chromedriver from 'chromedriver';

export const DEFAULT_TIMEOUT_MS = 10_000;

export interface DriverFactoryOptions {
  headless?: boolean;
  timeoutMs?: number;
}

function asBoolean(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === '1' || normalized === 'true' || normalized === 'yes';
}

function shouldRunHeadless(explicit?: boolean): boolean {
  if (typeof explicit === 'boolean') {
    return explicit;
  }

  return asBoolean(process.env.E2E_HEADLESS) || asBoolean(process.env.CI);
}

export async function createDriver(options: DriverFactoryOptions = {}): Promise<WebDriver> {
  const chromeOptions = new chrome.Options();

  if (shouldRunHeadless(options.headless)) {
    chromeOptions.addArguments('--headless=new');
  }

  chromeOptions.addArguments('--window-size=1440,900');
  chromeOptions.addArguments('--disable-gpu');
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');

  const serviceBuilder = new chrome.ServiceBuilder(chromedriver.path);

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .setChromeService(serviceBuilder)
    .build();

  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  await driver.manage().setTimeouts({
    implicit: 0,
    pageLoad: 30_000,
    script: 30_000,
  });

  await driver.wait(async () => {
    const readyState = await driver.executeScript('return document.readyState');
    return readyState === 'complete';
  }, timeoutMs);

  return driver;
}

export async function waitForVisible(
  driver: WebDriver,
  locator: Locator,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<WebElement> {
  const element = await driver.wait(until.elementLocated(locator), timeoutMs);
  await driver.wait(until.elementIsVisible(element), timeoutMs);
  return element;
}

export async function waitForUrlContains(
  driver: WebDriver,
  value: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<void> {
  await driver.wait(until.urlContains(value), timeoutMs);
}

export async function waitForText(
  driver: WebDriver,
  locator: Locator,
  text: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<void> {
  await driver.wait(until.elementTextContains(await waitForVisible(driver, locator, timeoutMs), text), timeoutMs);
}

export function buttonByText(text: string): Locator {
  return By.xpath(`//button[normalize-space()="${text}"]`);
}

export async function quitDriver(driver: WebDriver | undefined): Promise<void> {
  if (!driver) {
    return;
  }

  await driver.quit();
}
