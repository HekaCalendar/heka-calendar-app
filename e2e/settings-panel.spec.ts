import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Settings Panel', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/app/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('settings toggle buttons are visible', async ({ page }) => {
    await expect(page.getByText('Control Panel')).toBeVisible();
    await expect(page.getByText('Pure Mode')).toBeVisible();
  });

  test('opens control panel settings modal', async ({ page }) => {
    await page.getByText('Control Panel').click();
    await page.waitForTimeout(300);

    await expect(page.locator('[role="dialog"]')).toBeVisible();
    await expect(page.getByText('Calendar Settings')).toBeVisible();
  });

  test('toggles pure mode', async ({ page }) => {
    const pureBtn = page.getByText('Pure Mode');
    await pureBtn.click();
    await page.waitForTimeout(500);

    // After toggling pure mode, the button text should change to "Exit Pure"
    await expect(page.getByText('Exit Pure')).toBeVisible();

    // Toggle back
    await page.getByText('Exit Pure').click();
    await page.waitForTimeout(500);
    await expect(page.getByText('Pure Mode')).toBeVisible();
  });
});
