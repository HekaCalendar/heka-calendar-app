/**
 * Batch translate new keys across multiple namespaces.
 * Reads English source, translates missing keys to all languages.
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

function unflatten(flat: Record<string, string>): any {
  const result: any = {};
  // Sort keys so shorter (parent) keys come before longer (child) keys
  const sortedKeys = Object.keys(flat).sort((a, b) => a.length - b.length);

  for (const key of sortedKeys) {
    const parts = key.split('.');
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!(part in current)) {
        current[part] = {};
      } else if (typeof current[part] === 'string') {
        // Parent exists as a string but a child needs it to be an object.
        // This happens when the LLM incorrectly returns a leaf key that
        // conflicts with an existing nested structure. Overwrite with object.
        current[part] = {};
      }
      current = current[part];
    }
    current[parts[parts.length - 1]] = flat[key];
  }
  return result;
}

/** Remove keys that are prefixes of other keys in the same set. */
function filterPrefixConflicts(flat: Record<string, string>): Record<string, string> {
  const keys = Object.keys(flat).sort();
  const filtered: Record<string, string> = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // Check if any longer key starts with this key + '.'
    const isPrefix = keys.some((other, j) => j !== i && other.startsWith(key + '.'));
    if (!isPrefix) {
      filtered[key] = flat[key];
    } else {
      console.warn(`    Removing conflicting prefix key "${key}" (nested children exist)`);
    }
  }
  return filtered;
}

async function translateChunk(
  chunk: Record<string, string>,
  targetLang: string
): Promise<Record<string, string>> {
  const langName = LANGUAGE_NAMES[targetLang] || targetLang;
  const lines = Object.entries(chunk).map(([k, v]) => `${k}=${v}`).join('\n');

  const messages = [
    {
      role: 'system' as const,
      content:
        `You are a professional translator. Translate the VALUES on the right side of each "key=value" line from English to ${langName}.\n` +
        `Rules:\n` +
        `1. ONLY translate the VALUE (after the = sign). Do NOT translate the KEY.\n` +
        `2. Preserve all placeholders like {{month}}, {{year}}, {{count}}, {{day}}, {{planet}}, {{sign}}, {{name}}, {{date}}, {{time}}, {{location}}, {{elevation}}, {{days}}, {{percent}}, {{error}}, {{minutes}}, {{orb}}, {{total}}, {{suffix}}, {{items}} exactly as they appear.\n` +
        `3. Preserve all HTML tags like <0>, <1>, <strong>, <em>, <br />, etc.\n` +
        `4. Preserve all emoji and special characters.\n` +
        `5. Output in the exact same "key=value" format, one per line.\n` +
        `6. Do NOT add markdown, explanations, or extra text.\n` +
        `7. For RTL languages (Arabic, Hebrew), output RTL text.`,
    },
    { role: 'user' as const, content: lines },
  ];

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${API_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.2 }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Moonshot API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || '';

  const rawTranslated: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (k) rawTranslated[k] = v;
  }
  // Filter out keys that are prefixes of other keys to prevent unflatten crashes
  return filterPrefixConflicts(rawTranslated);
}

async function translateNamespace(namespace: string, lang: string) {
  const enPath = path.join(LOCALES_DIR, 'en', `${namespace}.json`);
  if (!fs.existsSync(enPath)) {
    console.warn(`  Missing English source: ${enPath}`);
    return;
  }

  const enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  const flat = flatten(enJson);
  const keys = Object.keys(flat);

  const targetDir = path.join(LOCALES_DIR, lang);
  const publicTargetDir = path.join(PUBLIC_LOCALES_DIR, lang);
  const targetPath = path.join(targetDir, `${namespace}.json`);
  const publicTargetPath = path.join(publicTargetDir, `${namespace}.json`);

  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  if (!fs.existsSync(publicTargetDir)) fs.mkdirSync(publicTargetDir, { recursive: true });

  let existingFlat: Record<string, string> = {};
  if (fs.existsSync(targetPath)) {
    try {
      const existingJson = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
      existingFlat = flatten(existingJson);
    } catch { /* ignore */ }
  }

  // Find keys that are new or different
  const keysToTranslate: string[] = [];
  for (const k of keys) {
    if (!existingFlat[k] || existingFlat[k] === flat[k]) {
      keysToTranslate.push(k);
    }
  }

  if (keysToTranslate.length === 0) {
    console.log(`  ${namespace} → ${lang}: up to date`);
    return;
  }

  console.log(`  Translating ${namespace} → ${lang} (${keysToTranslate.length} new keys)...`);

  const CHUNK_SIZE = 40;
  const translatedFlat: Record<string, string> = { ...existingFlat };

  for (let i = 0; i < keysToTranslate.length; i += CHUNK_SIZE) {
    const chunkKeys = keysToTranslate.slice(i, i + CHUNK_SIZE);
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
        console.log(`    Chunk ${Math.floor(i / CHUNK_SIZE) + 1}/${Math.ceil(keysToTranslate.length / CHUNK_SIZE)} OK`);
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

    await new Promise(r => setTimeout(r, 300));
  }

  const translatedJson = unflatten(translatedFlat);
  const output = JSON.stringify(translatedJson, null, 2) + '\n';
  fs.writeFileSync(targetPath, output, 'utf-8');
  fs.writeFileSync(publicTargetPath, output, 'utf-8');
  console.log(`  ✓ ${namespace} → ${lang} (${keysToTranslate.length} keys updated)`);
}

async function main() {
  const namespaces = process.argv.slice(2);
  if (namespaces.length === 0) {
    console.log('Usage: npx tsx scripts/batch-translate-namespaces.ts <namespace1> <namespace2> ...');
    console.log('Example: npx tsx scripts/batch-translate-namespaces.ts settings celestial coach');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  BATCH TRANSLATION SCRIPT');
  console.log(`  Namespaces: ${namespaces.join(', ')}`);
  console.log(`  Languages:  ${TARGET_LANGUAGES.join(', ')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  for (const namespace of namespaces) {
    console.log(`\n📦 Namespace: ${namespace}`);
    for (const lang of TARGET_LANGUAGES) {
      await translateNamespace(namespace, lang);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  DONE!');
  console.log('═══════════════════════════════════════════════════════════════');
}

main().catch(console.error);
