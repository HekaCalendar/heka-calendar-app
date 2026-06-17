/**
 * Batch-translate English locale JSON files to all supported languages
 * using the Moonshot API.
 *
 * Translates in small chunks to avoid context-window truncation.
 *
 * Usage: npx tsx scripts/translate-locales.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_KEY = process.env.MOONSHOT_API_KEY;
const API_BASE = process.env.MOONSHOT_API_BASE || 'https://api.moonshot.ai/v1';
const MODEL = 'moonshot-v1-32k';

const LOCALES_DIR = path.resolve(__dirname, '../src/i18n/locales');

const NAMESPACES = [
  'dayPanel', 'celestial', 'settings',
  'coach', 'journal', 'circle', 'achievements', 'print', 'wizard',
];

// 30 languages total; English is the source
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

interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

/**
 * Flatten a nested object into dot-notation key-value pairs.
 */
function flatten(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') {
      result[fullKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flatten(value, fullKey));
    }
  }
  return result;
}

/**
 * Rebuild a nested object from dot-notation key-value pairs.
 */
function unflatten(flat: Record<string, string>): any {
  const result: any = {};
  for (const key of Object.keys(flat)) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) current[part] = {};
      current = current[part];
    }
    current[parts[parts.length - 1]] = flat[key];
  }
  return result;
}

async function translateChunk(
  chunk: Record<string, string>,
  targetLang: string
): Promise<Record<string, string>> {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;

  const lines = Object.entries(chunk)
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const messages: ChatMessage[] = [
    {
      role: 'system',
      content:
        `You are a professional translator. Translate the VALUES on the right side of each "key=value" line from English to ${langName}.\n` +
        `Rules:\n` +
        `1. ONLY translate the VALUE (after the = sign). Do NOT translate the KEY.\n` +
        `2. Preserve all placeholders like {{month}}, {{year}}, {{count}}, {{percent}}, {{day}}, {{suffix}}, {{items}}, {{days}}, {{location}}, {{time}}, {{planet}}, {{sign}}, {{name}}, {{error}}, {{minutes}}, {{orb}}, {{date}}, {{total}} exactly as they appear.\n` +
        `3. Preserve all HTML tags like <0>, <1>, <strong>, <em>, <br />, etc.\n` +
        `4. Preserve all emoji and special characters.\n` +
        `5. Output in the exact same "key=value" format, one per line.\n` +
        `6. Do NOT add markdown, explanations, or extra text.\n` +
        `7. For RTL languages (Arabic, Hebrew), output RTL text.`,
    },
    {
      role: 'user',
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

  // Parse key=value lines from response
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

async function translateNamespace(namespace: string, lang: string) {
  const enPath = path.join(LOCALES_DIR, 'en', `${namespace}.json`);
  if (!fs.existsSync(enPath)) {
    console.warn(`  Missing English source: ${enPath}`);
    return;
  }

  // Skip wizard namespace — already translated
  if (namespace === 'wizard') {
    return;
  }

  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const flat = flatten(enJson);
  const keys = Object.keys(flat);

  const targetDir = path.join(LOCALES_DIR, lang);
  const targetPath = path.join(targetDir, `${namespace}.json`);

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  console.log(`  Translating ${namespace} → ${lang} (${keys.length} keys)...`);

  const CHUNK_SIZE = 40;
  const translatedFlat: Record<string, string> = {};

  for (let i = 0; i < keys.length; i += CHUNK_SIZE) {
    const chunkKeys = keys.slice(i, i + CHUNK_SIZE);
    const chunk: Record<string, string> = {};
    for (const k of chunkKeys) chunk[k] = flat[k];

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const result = await translateChunk(chunk, lang);
        for (const k of chunkKeys) {
          if (result[k]) {
            translatedFlat[k] = result[k];
          } else {
            console.warn(`    Missing key in response: ${k}, using English fallback`);
            translatedFlat[k] = flat[k];
          }
        }
        console.log(`    Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(keys.length / CHUNK_SIZE)} OK`);
        break;
      } catch (err) {
        attempts++;
        console.error(`    Chunk ${Math.floor(i / CHUNK_SIZE) + 1} attempt ${attempts} failed:`, (err as Error).message);
        if (attempts >= maxAttempts) {
          console.error(`    Giving up on chunk, using English fallback`);
          for (const k of chunkKeys) translatedFlat[k] = flat[k];
          break;
        }
        await new Promise(r => setTimeout(r, 2000 * attempts));
      }
    }

    // Small delay between chunks to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  const translatedJson = unflatten(translatedFlat);
  const output = JSON.stringify(translatedJson, null, 2) + '\n';
  fs.writeFileSync(targetPath, output, 'utf-8');
  console.log(`  ✓ ${namespace} → ${lang} (${keys.length} keys)`);
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  BATCH TRANSLATION SCRIPT (chunked)');
  console.log(`  Model: ${MODEL}`);
  console.log(`  Namespaces: ${NAMESPACES.join(', ')}`);
  console.log(`  Languages:  ${TARGET_LANGUAGES.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  let completed = 0;
  let total = NAMESPACES.length * TARGET_LANGUAGES.length;

  for (const namespace of NAMESPACES) {
    console.log(`\n📦 Namespace: ${namespace}`);
    for (const lang of TARGET_LANGUAGES) {
      await translateNamespace(namespace, lang);
      completed++;
      console.log(`  Progress: ${completed}/${total}`);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DONE!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
