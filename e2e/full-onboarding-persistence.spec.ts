import { test, expect } from '@playwright/test';

const APP_URL = process.env.APP_URL || 'http://localhost:4173/app/';

test('setup + tutorial completion persists across tab close', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(APP_URL);

  // --- Setup Wizard ---
  await page.waitForSelector('.setup-wizard-overlay', { timeout: 15000 });

  // Step 1: Language (English selected by default) -> Next
  await page.click('.setup-wizard__nav-btn--next', { timeout: 5000 });

  // Step 2: Mode -> SYNC (default) -> Next
  await page.click('.setup-wizard__nav-btn--next', { timeout: 5000 });

  // Step 3: Permissions -> Next (defaults)
  await page.click('.setup-wizard__nav-btn--next', { timeout: 5000 });

  // Step 4: AI -> Next (defaults)
  await page.click('.setup-wizard__nav-btn--next', { timeout: 5000 });

  // Step 5: Complete -> Enter HEKA
  await page.click('.setup-step--complete button', { timeout: 5000 });

  // --- v3 Tutorial ---
  await page.waitForSelector('.tt-welcome', { timeout: 15000 });
  await page.click('.tt-welcome__skip', { timeout: 10000 });

  // Wait for main app to be visible
  await page.waitForSelector('.app-main', { timeout: 15000 });

  // Verify persisted flags
  const setupComplete = await page.evaluate(() => {
    const raw = localStorage.getItem('heka-setup-v1');
    return raw ? JSON.parse(raw).isComplete === true : false;
  });
  const tutorialComplete = await page.evaluate(() => {
    const raw = localStorage.getItem('heka-tutorial-v3');
    return raw ? JSON.parse(raw).completed === true : false;
  });
  expect(setupComplete).toBe(true);
  expect(tutorialComplete).toBe(true);

  // Close tab and reopen
  await page.close();
  const newPage = await context.newPage();
  await newPage.goto(APP_URL);

  // Should NOT show setup wizard or tutorial
  await expect(newPage.locator('.setup-wizard-overlay')).toHaveCount(0, { timeout: 10000 });
  await expect(newPage.locator('.tt-welcome')).toHaveCount(0, { timeout: 10000 });
  await expect(newPage.locator('.app-main')).toHaveCount(1, { timeout: 15000 });

  await context.close();
});
