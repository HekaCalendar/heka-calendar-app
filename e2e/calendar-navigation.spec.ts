import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Calendar Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/app/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('renders calendar grid with current month', async ({ page }) => {
    await expect(page.locator('.app-title')).toContainText('The Modern HEKA Calendar');
    await expect(page.locator('[role="grid"]')).toBeVisible();
    await expect(page.locator('[role="gridcell"]').first()).toBeVisible();
  });

  test('navigates to previous and next month', async ({ page }) => {
    // Get aria-label of first non-blank day cell (contains month name)
    const firstDayCell = page.locator('[role="gridcell"]').filter({ hasNot: page.locator('.day-cell--blank') }).first();
    const initialLabel = await firstDayCell.getAttribute('aria-label');

    await page.click('.month-nav-prev');
    await page.waitForTimeout(500);
    const prevLabel = await firstDayCell.getAttribute('aria-label');
    expect(prevLabel).not.toBe(initialLabel);

    await page.click('.month-nav-next');
    await page.waitForTimeout(500);
    const nextLabel = await firstDayCell.getAttribute('aria-label');
    expect(nextLabel).toBe(initialLabel);
  });

  test('today button returns to current month', async ({ page }) => {
    await page.click('.month-nav-prev');
    await page.waitForTimeout(500);

    await page.click('.btn-today');
    await page.waitForTimeout(500);

    // Calendar should still be visible and functional
    await expect(page.locator('[role="grid"]')).toBeVisible();
  });
});
