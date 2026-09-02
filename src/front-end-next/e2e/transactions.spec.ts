import { test, expect } from '@playwright/test';
import { skipIfServerDown, loginAsCustomer } from './helpers';

test.describe('Transactions page', () => {
  test.beforeEach(async ({ page, request }) => {
    await skipIfServerDown(request);
    await loginAsCustomer(page);
    await page.goto('/transactions');
    await expect(page.locator('.page-header h1')).toHaveText('Transactions');
  });

  test('selecting an account reveals Export CSV button and filters', async ({ page }) => {
    // Filters are visible even before account selection
    await expect(page.getByText('Select Account')).toBeVisible();
    await expect(page.locator('.ant-select').filter({ hasText: 'All Types' })).toBeVisible();
    await expect(page.locator('.ant-select').filter({ hasText: 'All Statuses' })).toBeVisible();
    await expect(page.locator('.ant-picker')).toBeVisible();

    // Export CSV should not be visible before selecting an account
    await expect(page.getByRole('button', { name: 'Export CSV' })).toBeHidden();

    // Open the account selector and pick the first account
    await page.locator('.ant-select').first().click();
    const option = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option').first();
    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();

    // Export CSV appears once an account is selected
    await expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible({ timeout: 10000 });

    // Table is rendered
    await expect(page.locator('.ant-table')).toBeVisible();
  });

  test('type filter narrows visible transactions', async ({ page }) => {
    await page.locator('.ant-select').first().click();
    const option = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option').first();
    if (!(await option.isVisible().catch(() => false))) {
      test.skip(true, 'customer has no accounts in this environment');
    }
    await option.click();

    const rows = page.locator('.ant-table-tbody .ant-table-row');
    let hasRows = true;
    try {
      await rows.first().waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      hasRows = false;
    }
    if (!hasRows) {
      test.skip(true, 'selected account has no transactions in this environment');
    }

    // Apply DEPOSIT type filter
    await page.locator('.ant-select').filter({ hasText: 'All Types' }).click();
    await page
      .locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option')
      .filter({ hasText: 'DEPOSIT' })
      .first()
      .click();

    // Reset Filters button appears once a filter is active
    await expect(page.getByRole('button', { name: 'Reset Filters' })).toBeVisible();

    // Every visible row (if any) has a DEPOSIT tag
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator('.ant-tag').first()).toContainText('DEPOSIT');
    }
  });
});
