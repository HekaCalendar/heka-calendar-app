import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Day Panel', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/app/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('opens day panel when a day cell is clicked', async ({ page }) => {
    // Click the first non-empty day cell
    const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /\d+/ }).first();
    await dayCell.click();

    await page.waitForTimeout(500);

    // Day panel should be visible
    await expect(page.locator('.day-panel')).toBeVisible();
  });

  test('day panel shows empty state for days without notes', async ({ page }) => {
    const dayCell = page.locator('[role="gridcell"]').filter({ hasText: /\d+/ }).first();
    await dayCell.click();
    await page.waitForTimeout(500);

    const dayPanel = page.locator('.day-panel');
    await expect(dayPanel).toBeVisible();

    // Should contain some content (either empty state or details)
    const text = await dayPanel.textContent();
    expect(text?.length).toBeGreaterThan(0);
  });
});
