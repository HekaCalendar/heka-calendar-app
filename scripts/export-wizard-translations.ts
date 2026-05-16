/**
 * Export WIZARD_STRINGS from src/data/languages.ts into i18next wizard.json files
 */

import { WIZARD_STRINGS, SUPPORTED_LANGUAGES } from '../src/data/languages';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.resolve(__dirname, '../src/i18n/locales');

for (const lang of SUPPORTED_LANGUAGES) {
  const code = lang.code;
  const strings = WIZARD_STRINGS[code];
  if (!strings) {
    console.warn(`No strings found for ${code}`);
    continue;
  }

  const langDir = path.join(localesDir, code);
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const outPath = path.join(langDir, 'wizard.json');
  fs.writeFileSync(outPath, JSON.stringify(strings, null, 2) + '\n', 'utf-8');
  console.log(`Written ${outPath}`);
}

console.log('Done!');
