/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * I18N CONFIGURATION — Full app localization for 30 languages
 * Initialized with user's wizard-selected language from setupSlice
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import English base translations directly (bundled) so they're always available
import enCommon from './locales/en/common.json';
import enCalendar from './locales/en/calendar.json';
import enDayPanel from './locales/en/dayPanel.json';
import enCelestial from './locales/en/celestial.json';
import enSettings from './locales/en/settings.json';
import enCoach from './locales/en/coach.json';
import enJournal from './locales/en/journal.json';
import enCircle from './locales/en/circle.json';
import enAchievements from './locales/en/achievements.json';
import enPrint from './locales/en/print.json';

const bundledResources = {
  en: {
    common: enCommon,
    calendar: enCalendar,
    dayPanel: enDayPanel,
    celestial: enCelestial,
    settings: enSettings,
    coach: enCoach,
    journal: enJournal,
    circle: enCircle,
    achievements: enAchievements,
    print: enPrint,
  },
};

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

/**
 * Custom fetch-based backend for i18next.
 * Replaces i18next-http-backend to avoid Node.js `require` issues in Capacitor.
 */
const fetchBackend = {
  type: 'backend' as const,
  init() {},
  read(language: string, namespace: string, callback: (err: Error | null, data?: any) => void) {
    fetch(`/locales/${language}/${namespace}.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${language}/${namespace}`);
        return res.json();
      })
      .then((data) => callback(null, data))
      .catch((err) => callback(err as Error));
  },
};

export async function initI18n(language: string): Promise<void> {
  if (initialized) {
    await i18n.changeLanguage(language);
    applyRTLDirection(language);
    return;
  }

  await i18n
    .use(fetchBackend)
    .use(initReactI18next)
    .init({
      lng: language,
      fallbackLng: 'en',
      supportedLngs: SUPPORTED_I18N_LANGUAGES,
      ns: ['common', 'calendar', 'dayPanel', 'celestial', 'settings', 'coach', 'journal', 'circle', 'achievements', 'print'],
      defaultNS: 'common',
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
  applyRTLDirection(language);
  return i18n.changeLanguage(language);
}

export default i18n;
