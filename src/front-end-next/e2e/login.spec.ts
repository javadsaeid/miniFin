import { test, expect } from '@playwright/test';
import { skipIfServerDown, loginAsCustomer } from './helpers';

test.describe('Login', () => {
  test.beforeEach(async ({ request }) => {
    await skipIfServerDown(request);
  });

  test('logs in with customer demo credentials and redirects to home', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('.auth-form-title')).toContainText('Welcome back');

    await page.getByPlaceholder('Email address').fill('customer@minifin.com');
    await page.getByPlaceholder('Password').fill('customer123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
    await expect(page.locator('.page-header h1, .home-hero, h1').first()).toBeVisible();

    // Auth data persisted in localStorage
    const token = await page.evaluate(() => localStorage.getItem('minifin_token'));
    expect(token).toBeTruthy();
  });

  test('logs in via customer demo card', async ({ page }) => {
    await page.goto('/login');

    await page.locator('.demo-card.customer').click();

    await expect(page).toHaveURL(/\/$/, { timeout: 15000 });
  });

  test('shows authenticated navigation after login', async ({ page }) => {
    await loginAsCustomer(page);

    const sidebar = page.locator('.app-sidebar');
    await expect(sidebar.getByRole('link', { name: 'Profile' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Transfer' })).toBeVisible();
    await expect(sidebar.getByRole('link', { name: 'Transactions' })).toBeVisible();
  });
});
