import { Page } from '@playwright/test';

/**
 * Seed localStorage to skip onboarding and tutorials.
 */
export async function skipOnboarding(page: Page) {
  const appVersion = process.env.npm_package_version || '2.2.22';
  await page.addInitScript((version: string) => {
    localStorage.setItem('heka-setup-v1', JSON.stringify({ isComplete: true, language: 'en' }));
    localStorage.setItem('heka-tutorial-v3', JSON.stringify({ completed: true }));
    localStorage.setItem('heka-version', version);
  }, appVersion);
}
