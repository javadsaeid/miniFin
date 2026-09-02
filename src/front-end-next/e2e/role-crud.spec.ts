import { test, expect } from '@playwright/test';
import { skipIfServerDown, loginAsAdmin } from './helpers';

test.describe('Admin Panel — Roles CRUD', () => {
  test.beforeEach(async ({ page, request }) => {
    await skipIfServerDown(request);
    await loginAsAdmin(page);
  });

  test('admin can open Admin Panel and sees Roles tab with CRUD controls', async ({ page }) => {
    await page.locator('.app-sidebar').getByRole('link', { name: 'Admin Panel' }).click();

    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('.page-header h1')).toHaveText('Admin Panel');

    // Switch to Roles tab
    await page.getByRole('tab', { name: /Roles/ }).click();

    // Create button visible
    await expect(page.getByRole('button', { name: 'Create Role' })).toBeVisible();

    // Roles table renders with seeded roles
    const rolesTable = page.locator('.ant-tabs-tabpane-active .ant-table');
    await expect(rolesTable).toBeVisible();
    await expect(rolesTable.getByRole('cell').filter({ hasText: 'ADMIN' }).first()).toBeVisible();

    // Edit and Delete action buttons per row
    await expect(rolesTable.locator('.anticon-edit').first()).toBeVisible();
    await expect(rolesTable.locator('.anticon-delete').first()).toBeVisible();
  });

  test('Create Role button opens modal with Role Name field', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('tab', { name: /Roles/ }).click();
    await page.getByRole('button', { name: 'Create Role' }).click();

    const modal = page.locator('.ant-modal-content');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Create Role')).toBeVisible();
    await expect(modal.getByLabel('Role Name')).toBeVisible();

    await modal.getByRole('button', { name: 'Cancel' }).click();
    await expect(modal).toBeHidden();
  });

  test('Edit Role button opens modal prefilled with role name', async ({ page }) => {
    await page.goto('/admin');
    await page.getByRole('tab', { name: /Roles/ }).click();

    const rolesTable = page.locator('.ant-tabs-tabpane-active .ant-table');
    await rolesTable.locator('.anticon-edit').first().click();

    const modal = page.locator('.ant-modal-content');
    await expect(modal).toBeVisible();
    await expect(modal.getByText('Edit Role')).toBeVisible();
    await expect(modal.getByLabel('Role Name')).not.toHaveValue('');

    await modal.getByRole('button', { name: 'Cancel' }).click();
  });
});
