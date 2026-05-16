/**
 * Focused translation script for newly-added keys.
 * Translates only the specified keys to all target languages.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.MOONSHOT_API_KEY;
const API_BASE = process.env.MOONSHOT_API_BASE || 'https://api.moonshot.ai/v1';
const MODEL = 'moonshot-v1-32k';

const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');
const PUBLIC_LOCALES_DIR = path.resolve(__dirname, '../public/locales');

const TARGET_LANGUAGES = [
  'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru',
  'tr', 'pl', 'nl', 'sv', 'el', 'he', 'th', 'vi', 'id', 'uk', 'ro', 'cs',
  'hu', 'da', 'fi', 'no', 'sk', 'bg',
];

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
  zh: 'Chinese (Simplified)', ja: 'Japanese', ko: 'Korean', ar: 'Arabic',
  hi: 'Hindi', ru: 'Russian', tr: 'Turkish', pl: 'Polish', nl: 'Dutch',
  sv: 'Swedish', el: 'Greek', he: 'Hebrew', th: 'Thai', vi: 'Vietnamese',
  id: 'Indonesian', uk: 'Ukrainian', ro: 'Romanian', cs: 'Czech',
  hu: 'Hungarian', da: 'Danish', fi: 'Finnish', no: 'Norwegian',
  sk: 'Slovak', bg: 'Bulgarian',
};

interface KeyToTranslate {
  namespace: string;
  key: string;
  value: string;
}

const KEYS_TO_TRANSLATE: KeyToTranslate[] = [
  { namespace: 'wizard', key: 'tutorialContinueHint', value: 'Tap or press space to continue' },
  { namespace: 'celestial', key: 'agriculturalGuidance', value: 'Agricultural guidance' },
  { namespace: 'celestial', key: 'calculatingSolarTimes', value: 'Calculating solar times...' },
];

async function translateKeys(
  keys: KeyToTranslate[],
  targetLang: string
): Promise<Record<string, string>> {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;

  const lines = keys
    .map(({ namespace, key, value }) => `${namespace}:${key}=${value}`)
    .join('\n');

  const messages = [
    {
      role: 'system' as const,
      content:
        `You are a professional translator. Translate the VALUES on the right side of each "namespace:key=value" line from English to ${langName}.\n` +
        `Rules:\n` +
        `1. ONLY translate the VALUE (after the = sign). Do NOT translate the namespace or key.\n` +
        `2. Preserve all placeholders like {{month}}, {{year}}, {{count}} exactly as they appear.\n` +
        `3. Preserve all emoji and special characters.\n` +
        `4. Output in the exact same "namespace:key=value" format, one per line.\n` +
        `5. Do NOT add markdown, explanations, or extra text.\n` +
        `6. For RTL languages (Arabic, Hebrew), output RTL text.`,
    },
    {
      role: 'user' as const,
      content: lines,
    },
  ];

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Moonshot API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';

  const translated: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const fullKey = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (fullKey) translated[fullKey] = v;
  }

  return translated;
}

async function updateNamespaceFile(
  namespace: string,
  lang: string,
  updates: Record<string, string>
) {
  const targetDir = path.join(LOCALES_DIR, lang);
  const publicTargetDir = path.join(PUBLIC_LOCALES_DIR, lang);
  const targetPath = path.join(targetDir, `${namespace}.json`);
  const publicTargetPath = path.join(publicTargetDir, `${namespace}.json`);

  const json = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  for (const [key, value] of Object.entries(updates)) {
    json[key] = value;
  }

  const output = JSON.stringify(json, null, 2) + '\n';
  fs.writeFileSync(targetPath, output, 'utf-8');
  fs.writeFileSync(publicTargetPath, output, 'utf-8');
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  FOCUSED TRANSLATION SCRIPT');
  console.log(`  Keys: ${KEYS_TO_TRANSLATE.map(k => k.key).join(', ')}`);
  console.log(`  Languages: ${TARGET_LANGUAGES.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const lang of TARGET_LANGUAGES) {
    console.log(`Translating → ${lang}...`);
    try {
      const result = await translateKeys(KEYS_TO_TRANSLATE, lang);

      // Group by namespace
      const byNamespace: Record<string, Record<string, string>> = {};
      for (const { namespace, key } of KEYS_TO_TRANSLATE) {
        const fullKey = `${namespace}:${key}`;
        const value = result[fullKey];
        if (value) {
          if (!byNamespace[namespace]) byNamespace[namespace] = {};
          byNamespace[namespace][key] = value;
          console.log(`  ✓ ${namespace}.${key}: ${value}`);
        } else {
          console.warn(`  ✗ Missing translation for ${namespace}.${key}, using English fallback`);
          if (!byNamespace[namespace]) byNamespace[namespace] = {};
          const enValue = KEYS_TO_TRANSLATE.find(k => k.namespace === namespace && k.key === key)?.value || '';
          byNamespace[namespace][key] = enValue;
        }
      }

      for (const [namespace, updates] of Object.entries(byNamespace)) {
        await updateNamespaceFile(namespace, lang, updates);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  FAILED for ${lang}:`, (err as Error).message);
    }
  }

  // Also update English files (source of truth)
  for (const { namespace, key, value } of KEYS_TO_TRANSLATE) {
    const enPath = path.join(LOCALES_DIR, 'en', `${namespace}.json`);
    const publicEnPath = path.join(PUBLIC_LOCALES_DIR, 'en', `${namespace}.json`);
    const json = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    json[key] = value;
    const output = JSON.stringify(json, null, 2) + '\n';
    fs.writeFileSync(enPath, output, 'utf-8');
    fs.writeFileSync(publicEnPath, output, 'utf-8');
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DONE!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
