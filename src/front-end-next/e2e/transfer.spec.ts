import { test, expect } from '@playwright/test';
import { skipIfServerDown, loginAsCustomer } from './helpers';

test.describe('Transfer page', () => {
  test.beforeEach(async ({ page, request }) => {
    await skipIfServerDown(request);
    await loginAsCustomer(page);
    await page.goto('/transfer');
    await expect(page.locator('.page-header h1')).toHaveText('Transfer');
  });

  test('selecting Transfer type shows Destination Account field', async ({ page }) => {
    // Choose "Transfer" as the transaction type
    await page.getByLabel('Transaction Type').click();
    await page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').getByText('Transfer', { exact: true }).first().click();

    await expect(page.getByLabel('Destination Account')).toBeVisible();
  });

  test('destination field label renders for Withdraw type as well', async ({ page }) => {
    await page.getByLabel('Transaction Type').click();
    await page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden)').getByText('Withdraw', { exact: true }).first().click();

    await expect(page.locator('text=Destination Account')).toBeVisible();
  });

  test('core form fields are present', async ({ page }) => {
    await expect(page.getByLabel('Transaction Type')).toBeVisible();
    await expect(page.getByLabel('From Account')).toBeVisible();
    await expect(page.getByLabel('Amount')).toBeVisible();
    await expect(page.getByLabel('Description')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Transaction' })).toBeVisible();
    await expect(page.getByText('Your Accounts')).toBeVisible();
  });
});
