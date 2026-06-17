import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Search Modal', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/app/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('opens search modal from header', async ({ page }) => {
    await page.getByText('Search', { exact: false }).first().click();
    await page.waitForTimeout(300);

    await expect(page.locator('.modal-overlay')).toBeVisible();
  });

  test('can type a query in search input', async ({ page }) => {
    await page.getByText('Search', { exact: false }).first().click();
    await page.waitForTimeout(300);

    const input = page.locator('.modal-overlay input[type="text"]');
    await input.fill('january');
    await page.waitForTimeout(500);

    await expect(input).toHaveValue('january');
  });
});
