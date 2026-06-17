import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Journal Modal', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/app/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('opens journal modal from header', async ({ page }) => {
    await page.locator('.btn-journal').click();
    await page.waitForTimeout(500);

    // OracleJournal renders inside .oracle-journal-overlay
    await expect(page.locator('.oracle-journal-overlay')).toBeVisible();
  });

  test('can close journal modal', async ({ page }) => {
    await page.locator('.btn-journal').click();
    await page.waitForTimeout(500);

    await expect(page.locator('.oracle-journal-overlay')).toBeVisible();

    // Click the back button inside OracleHeader to close
    await page.locator('.back-btn').click();
    await page.waitForTimeout(300);

    // Modal should be gone or hidden
    const overlay = page.locator('.oracle-journal-overlay');
    const count = await overlay.count();
    if (count > 0) {
      const visible = await overlay.first().isVisible().catch(() => false);
      expect(visible).toBe(false);
    }
  });
});
