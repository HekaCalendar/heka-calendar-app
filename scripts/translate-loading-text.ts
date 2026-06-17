/**
 * Translate the index.html loading text to all supported languages.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.MOONSHOT_API_KEY;
const API_BASE = process.env.MOONSHOT_API_BASE || 'https://api.moonshot.ai/v1';
const MODEL = 'moonshot-v1-32k';

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

const TEXT_TO_TRANSLATE = 'Loading HEKA Calendar';

async function translateText(text: string, targetLang: string): Promise<string> {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;

  const messages = [
    {
      role: 'system' as const,
      content:
        `You are a professional translator. Translate the following text from English to ${langName}.\n` +
        `Rules:\n` +
        `1. ONLY output the translated text, nothing else.\n` +
        `2. Do NOT translate the brand name "HEKA". Keep it as-is.\n` +
        `3. Do NOT add markdown, explanations, or extra text.`,
    },
    {
      role: 'user' as const,
      content: text,
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
  return data.choices?.[0]?.message?.content?.trim() || text;
}

async function main() {
  console.log('Translating "Loading HEKA Calendar" to all languages...\n');

  const results: Record<string, string> = { en: TEXT_TO_TRANSLATE };

  for (const lang of TARGET_LANGUAGES) {
    try {
      const translated = await translateText(TEXT_TO_TRANSLATE, lang);
      results[lang] = translated;
      console.log(`${lang}: ${translated}`);
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  FAILED for ${lang}:`, (err as Error).message);
      results[lang] = TEXT_TO_TRANSLATE;
    }
  }

  const outputPath = path.resolve(__dirname, '../loading-text-translations.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2) + '\n', 'utf-8');
  console.log(`\nSaved to ${outputPath}`);
}

main().catch(console.error);
