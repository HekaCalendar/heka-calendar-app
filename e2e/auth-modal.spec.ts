import { test, expect } from '@playwright/test';
import { skipOnboarding } from './setup';

test.describe('Auth Modal', () => {
  test.beforeEach(async ({ page }) => {
    await skipOnboarding(page);
    await page.goto('/');
    await page.waitForSelector('.app-title', { state: 'visible', timeout: 15000 });
  });

  test('opens auth modal from settings', async ({ page }) => {
    await page.getByText('Sign In').click();
    await page.waitForTimeout(300);

    await expect(page.locator('.auth-modal')).toBeVisible();
    await expect(page.getByText('Sign In').first()).toBeVisible();
  });

  test('switches from login to signup view', async ({ page }) => {
    await page.getByText('Sign In').click();
    await page.waitForTimeout(300);

    await expect(page.locator('.auth-modal')).toBeVisible();

    await page.getByText('Create Account').first().click();
    await page.waitForTimeout(300);

    // auth.json: "signUp": "Create Account"
    await expect(page.getByText('Create Account').nth(1)).toBeVisible();
  });
});
