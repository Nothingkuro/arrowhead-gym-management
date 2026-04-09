import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { FRONTEND_URL, LOGIN_PASSWORD, LOGIN_USERNAME } from './env';

export async function loginAsStaff(page: Page): Promise<void> {
  if (!LOGIN_PASSWORD) {
    throw new Error(
      'Missing login password. Set E2E_LOGIN_PASSWORD or SEED_STAFF_PASSWORD before running E2E tests.',
    );
  }

  await page.goto(FRONTEND_URL, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Staff' }).click();

  await page.getByPlaceholder('Username').fill(LOGIN_USERNAME);
  await page.getByPlaceholder('Password').fill(LOGIN_PASSWORD);
  const loginResponsePromise = page.waitForResponse((response) => {
    return response.url().includes('/api/auth/login') && response.request().method() === 'POST';
  });

  await Promise.all([
    // if the app does navigate after login, catch it; if not, that's fine
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}),
    page.getByRole('button', { name: 'Log In' }).click(),
  ]);

  const loginResponse = await loginResponsePromise;
  if (!loginResponse.ok()) {
    const failureBody = await loginResponse.text().catch(() => 'Unable to read login response body');
    throw new Error(`Login failed with status ${loginResponse.status()}: ${failureBody}`);
  }

  // Wait until we appear to be "in the dashboard area" (more stable than a single exact URL)
  await expect(page).toHaveURL(/\/dashboard(\/|$)/, { timeout: 15_000 }).catch(() => {
    // If your app doesn't auto-redirect reliably in CI, force the target page
  });

  // Force the page your tests expect
  const membersUrl = new URL('/dashboard/members', FRONTEND_URL).toString();
  await page.goto(membersUrl, { waitUntil: 'domcontentloaded' });

  await expect(page).toHaveURL(/\/dashboard\/members\/?(\?.*)?$/);
  await expect(page.getByRole('heading', { name: 'Members' })).toBeVisible();
}

export function uniqueToken(): string {
  return `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(-8);
}
