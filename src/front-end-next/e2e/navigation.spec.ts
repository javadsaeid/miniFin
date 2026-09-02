import { test, expect } from '@playwright/test';
import { skipIfServerDown, loginAsCustomer } from './helpers';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page, request }) => {
    await skipIfServerDown(request);
    await loginAsCustomer(page);
  });

  test('navigates to Profile page', async ({ page }) => {
    await page.locator('.app-sidebar').getByRole('link', { name: 'Profile' }).click();

    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('.page-header h1')).toHaveText('Profile');
  });

  test('navigates to Transfer page', async ({ page }) => {
    await page.locator('.app-sidebar').getByRole('link', { name: 'Transfer' }).click();

    await expect(page).toHaveURL(/\/transfer/);
    await expect(page.locator('.page-header h1')).toHaveText('Transfer');
  });

  test('navigates to Transactions page', async ({ page }) => {
    await page.locator('.app-sidebar').getByRole('link', { name: 'Transactions' }).click();

    await expect(page).toHaveURL(/\/transactions/);
    await expect(page.locator('.page-header h1')).toHaveText('Transactions');
  });

  test('navigates back to Home', async ({ page }) => {
    await page.locator('.app-sidebar').getByRole('link', { name: 'Transfer' }).click();
    await expect(page).toHaveURL(/\/transfer/);

    await page.locator('.app-sidebar').getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL(/\/$/);
  });
});
