import { Page } from '@playwright/test';

/**
 * Seed localStorage to skip onboarding and tutorials.
 */
export async function skipOnboarding(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('heka-setup-v1', JSON.stringify({ isComplete: true, language: 'en' }));
    localStorage.setItem('heka-tutorial-v3', JSON.stringify({ completed: true }));
    localStorage.setItem('heka-version', '2.2.16');
  });
}
