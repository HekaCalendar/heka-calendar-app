import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:4173/app/';

test('v3 tutorial completion persists across tab close', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Seed setup complete so we land directly on the v3 tutorial
  await page.addInitScript(() => {
    localStorage.setItem('heka-setup-v1', JSON.stringify({ isComplete: true, language: 'en' }));
    localStorage.setItem('heka-version', '2.2.22');
  });

  await page.goto(APP_URL);

  // Wait for the cinematic welcome/tutorial to mount
  await page.waitForSelector('.tt-welcome', { timeout: 15000 });

  // Use the skip button to complete the tutorial immediately
  await page.click('.tt-welcome__skip', { timeout: 10000 });

  // Give localStorage write a moment and verify the flag was written
  await page.waitForTimeout(500);
  const completed = await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('heka-tutorial-v3');
      return raw ? JSON.parse(raw).completed === true : false;
    } catch {
      return false;
    }
  });
  expect(completed).toBe(true);

  // Close the tab and open a fresh one in the same browser context
  await page.close();
  const newPage = await context.newPage();
  await newPage.goto(APP_URL);

  // The tutorial should NOT appear again
  await expect(newPage.locator('.tt-welcome')).toHaveCount(0, { timeout: 10000 });

  await context.close();
});
