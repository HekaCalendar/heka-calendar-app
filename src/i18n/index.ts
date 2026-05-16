/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * I18N CONFIGURATION — Full app localization for 30 languages
 * ALL translations are bundled at build time for Capacitor compatibility.
 * No fetch/XHR backend — avoids file:// CORS issues in WebView.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ── Bundle ALL translations at build time ──────────────────────────────────
// Vite's import.meta.glob eagerly loads every JSON under ./locales/
// This works in web, Capacitor, and Tauri without any runtime fetch.

const allModules = import.meta.glob('./locales/**/*.json', { eager: true });

const bundledResources: Record<string, Record<string, any>> = {};

for (const [path, module] of Object.entries(allModules)) {
  const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
  if (!match) continue;
  const [, lang, ns] = match;
  if (!bundledResources[lang]) bundledResources[lang] = {};
  bundledResources[lang][ns] = (module as any).default ?? module;
}

export const SUPPORTED_I18N_LANGUAGES = [
  'en', 'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru',
  'tr', 'pl', 'nl', 'sv', 'el', 'he', 'th', 'vi', 'id', 'uk', 'ro', 'cs',
  'hu', 'da', 'fi', 'no', 'sk', 'bg',
];

export const RTL_LANGUAGES = ['ar', 'he'];

export function isRTLLanguage(lang: string): boolean {
  return RTL_LANGUAGES.includes(lang);
}

let initialized = false;

export async function initI18n(language: string): Promise<void> {
  if (initialized) {
    await i18n.changeLanguage(language);
    applyRTLDirection(language);
    return;
  }

  await i18n
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_I18N_LANGUAGES,
      ns: ['common', 'calendar', 'dayPanel', 'celestial', 'settings', 'coach', 'journal', 'circle', 'achievements', 'print', 'wizard', 'auth'],
      defaultNS: 'common',
      fallbackNS: 'common',
      resources: bundledResources,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  initialized = true;
  applyRTLDirection(language);
}

export function applyRTLDirection(language: string): void {
  const isRTL = isRTLLanguage(language);
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
}

export function changeLanguage(language: string): Promise<any> {
  if (!initialized) {
    return initI18n(language);
  }
  applyRTLDirection(language);
  return i18n.changeLanguage(language);
}

export default i18n;
