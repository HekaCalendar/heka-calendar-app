/**
 * Add and translate HEKA calendar month abbreviations to all supported languages.
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

const MONTH_KEYS: Record<string, string> = {
  'months.apr': 'Apr',
  'months.may': 'May',
  'months.jun': 'Jun',
  'months.jul': 'Jul',
  'months.aug': 'Aug',
  'months.hex': 'Hex',
  'months.sep': 'Sep',
  'months.oct': 'Oct',
  'months.nov': 'Nov',
  'months.dec': 'Dec',
  'months.jan': 'Jan',
  'months.feb': 'Feb',
  'months.mar': 'Mar',
};

async function translateChunk(
  chunk: Record<string, string>,
  targetLang: string
): Promise<Record<string, string>> {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;

  const lines = Object.entries(chunk)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const messages = [
    {
      role: 'system' as const,
      content:
        `You are a professional translator. Translate the VALUES on the right side of each "key=value" line from English to ${langName}.\n` +
        `These are month abbreviations for a 13-month calendar.\n` +
        `Rules:\n` +
        `1. ONLY translate the VALUE (after the = sign). Do NOT translate the KEY.\n` +
        `2. For standard months (Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec, Jan, Feb, Mar), use the standard 3-letter abbreviation in ${langName}.\n` +
        `3. For "months.hex", this is the 13th month of the calendar (between August and September). Translate it as a short 3-letter abbreviation that fits naturally in ${langName}. It can be a transliteration or a meaningful short word.\n` +
        `4. Output in the exact same "key=value" format, one per line.\n` +
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
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (k) translated[k] = v;
  }

  return translated;
}

async function updateLocaleFile(lang: string, updates: Record<string, string>) {
  const targetPath = path.join(LOCALES_DIR, lang, 'common.json');
  const publicTargetPath = path.join(PUBLIC_LOCALES_DIR, lang, 'common.json');

  const json = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  if (!json.months) json.months = {};
  for (const [key, value] of Object.entries(updates)) {
    const monthKey = key.replace('months.', '');
    json.months[monthKey] = value;
  }

  const output = JSON.stringify(json, null, 2) + '\n';
  fs.writeFileSync(targetPath, output, 'utf-8');
  fs.writeFileSync(publicTargetPath, output, 'utf-8');
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  TRANSLATING HEKA MONTH NAMES');
  console.log(`  Languages: ${TARGET_LANGUAGES.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const lang of TARGET_LANGUAGES) {
    console.log(`Translating → ${lang}...`);
    try {
      const result = await translateChunk(MONTH_KEYS, lang);

      const updates: Record<string, string> = {};
      for (const key of Object.keys(MONTH_KEYS)) {
        if (result[key]) {
          updates[key] = result[key];
          console.log(`  ✓ ${key}: ${result[key]}`);
        } else {
          console.warn(`  ✗ Missing ${key}, using English fallback`);
          updates[key] = MONTH_KEYS[key];
        }
      }

      await updateLocaleFile(lang, updates);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  FAILED for ${lang}:`, (err as Error).message);
    }
  }

  // Update English source
  const enPath = path.join(LOCALES_DIR, 'en', 'common.json');
  const publicEnPath = path.join(PUBLIC_LOCALES_DIR, 'en', 'common.json');
  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  if (!enJson.months) enJson.months = {};
  for (const [key, value] of Object.entries(MONTH_KEYS)) {
    const monthKey = key.replace('months.', '');
    enJson.months[monthKey] = value;
  }
  const output = JSON.stringify(enJson, null, 2) + '\n';
  fs.writeFileSync(enPath, output, 'utf-8');
  fs.writeFileSync(publicEnPath, output, 'utf-8');

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DONE!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
