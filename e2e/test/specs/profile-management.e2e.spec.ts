import { expect, test } from '@playwright/test';
import { loginAsOwner, uniqueToken } from '../support/auth';
import { resetDatabase } from '../support/db';

test.describe('Profile management e2e', () => {
  test.beforeAll(() => {
    resetDatabase('profile-management-beforeAll');
  });

  test.beforeEach(async ({ page }) => {
    await loginAsOwner(page);
    await page.getByRole('link', { name: 'Profile' }).click();
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await expect(page.getByRole('heading', { name: 'Profiles' })).toBeVisible();
  });

  test('owner updates admin and staff credentials', async ({ page }) => {
    const token = uniqueToken();
    const newAdminUsername = `owner_${token}`;
    const newStaffUsername = `staff_${token}`;
    const newAdminPassword = `Owner${token}Pass`;
    const newStaffPassword = `Staff${token}Pass`;

    await expect(page.getByText('Created At').first()).toBeVisible();
    await expect(page.getByText('Last Updated').first()).toBeVisible();

    const updateAdminResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PUT'
      && response.url().includes('/api/profile')
      && response.ok()
    ));

    await page.getByPlaceholder('Admin username').fill(newAdminUsername);
    await page.getByPlaceholder('Admin new password').fill(newAdminPassword);
    await page.getByRole('button', { name: 'Save Admin Profile' }).click();

    await updateAdminResponsePromise;
    await expect(page.getByText('Admin credentials updated successfully.')).toBeVisible();
    await expect(page.getByPlaceholder('Admin username')).toHaveValue(newAdminUsername);

    const updateStaffResponsePromise = page.waitForResponse((response) => (
      response.request().method() === 'PUT'
      && response.url().includes('/api/users/')
      && response.ok()
    ));

    await page.getByPlaceholder('Staff username').fill(newStaffUsername);
    await page.getByPlaceholder('Staff new password').fill(newStaffPassword);
    await page.getByRole('button', { name: 'Save Staff Profile' }).click();

    await updateStaffResponsePromise;
    await expect(page.getByText('Staff credentials updated successfully.')).toBeVisible();
    await expect(page.getByPlaceholder('Staff username')).toHaveValue(newStaffUsername);
  });
});
