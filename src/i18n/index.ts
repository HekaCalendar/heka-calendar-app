/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * I18N CONFIGURATION — On-demand localization
 * Only the active language + English fallback are loaded at runtime.
 * This avoids bundling all 30 languages into the initial JS payload.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// ── Lazy-load translation files ──────────────────────────────────────────────
// Vite's import.meta.glob returns a map of dynamic importers. Each language
// becomes its own chunk thanks to vite.config.ts manualChunks.
const allModules = import.meta.glob('./locales/**/*.json');

const NAMESPACES = [
  'common',
  'calendar',
  'dayPanel',
  'celestial',
  'settings',
  'coach',
  'journal',
  'circle',
  'achievements',
  'print',
  'wizard',
  'auth',
  'notifications',
  'certificate',
  'info',
  'tutorial',
  'stats',
] as const;

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

async function loadLanguageResources(lang: string): Promise<Record<string, any>> {
  const resources: Record<string, any> = {};
  await Promise.all(
    NAMESPACES.map(async (ns) => {
      const loader = allModules[`./locales/${lang}/${ns}.json`];
      if (!loader) return;
      try {
        const module = (await loader()) as { default?: unknown } | unknown;
        resources[ns] = (module as { default?: unknown }).default ?? module;
      } catch (e) {
        // Missing namespace for a language is acceptable — i18next will fall back to English.
        console.warn(`[i18n] Failed to load ${lang}/${ns}`, e);
      }
    })
  );
  return resources;
}

export async function initI18n(language: string): Promise<void> {
  if (initialized) {
    await changeLanguage(language);
    return;
  }

  const [primary, fallback] = await Promise.all([
    loadLanguageResources(language),
    loadLanguageResources('en'),
  ]);

  const resources: Record<string, Record<string, any>> = {};
  resources['en'] = fallback;
  if (language !== 'en') {
    resources[language] = primary;
  }

  await i18n
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_I18N_LANGUAGES,
      ns: NAMESPACES,
      defaultNS: 'common',
      fallbackNS: 'common',
      resources,
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

export async function changeLanguage(language: string): Promise<any> {
  if (!initialized) {
    return initI18n(language);
  }

  if (!i18n.hasResourceBundle(language, 'common')) {
    const resources = await loadLanguageResources(language);
    Object.entries(resources).forEach(([ns, data]) => {
      i18n.addResourceBundle(language, ns, data, true, true);
    });
  }

  applyRTLDirection(language);
  return i18n.changeLanguage(language);
}

export default i18n;
