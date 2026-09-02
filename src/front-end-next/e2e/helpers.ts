import { Page, test, APIRequestContext } from '@playwright/test';

export const CUSTOMER = { email: 'customer@minifin.com', password: 'customer123' };
export const ADMIN = { email: 'admin@minifin.com', password: 'admin123' };

export async function skipIfServerDown(request: APIRequestContext) {
  try {
    await request.get('/', { timeout: 5000 });
  } catch {
    test.skip(true, 'miniFin app not reachable at https://localhost:8443 — start the Docker stack first');
  }
}

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByPlaceholder('Email address').fill(email);
  await page.getByPlaceholder('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL('**/', { timeout: 15000 });
}

export async function loginAsCustomer(page: Page) {
  await login(page, CUSTOMER.email, CUSTOMER.password);
}

export async function loginAsAdmin(page: Page) {
  await login(page, ADMIN.email, ADMIN.password);
}
