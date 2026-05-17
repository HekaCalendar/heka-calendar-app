import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

translations = {
  'en': 'Community',
  'de': 'Gemeinschaft',
  'es': 'Comunidad',
  'fr': 'Communauté',
  'it': 'Comunità',
  'pt': 'Comunidade',
  'zh': '社区',
  'ja': 'コミュニティ',
  'ko': '커뮤니티',
  'ar': 'المجتمع',
  'hi': 'समुदाय',
  'ru': 'Сообщество',
  'tr': 'Topluluk',
  'pl': 'Społeczność',
  'nl': 'Gemeenschap',
  'sv': 'Gemenskap',
  'el': 'Κοινότητα',
  'he': 'קהילה',
  'th': 'ชุมชน',
  'vi': 'Cộng đồng',
  'id': 'Komunitas',
  'uk': 'Спільнота',
  'ro': 'Comunitate',
  'cs': 'Komunita',
  'hu': 'Közösség',
  'da': 'Fællesskab',
  'fi': 'Yhteisö',
  'no': 'Samfunn',
  'sk': 'Komunita',
  'bg': 'Общност',
}

fixed = 0
for lang, trans in sorted(translations.items()):
    path = f'public/locales/{lang}/journal.json'
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        old = data['navigation']['tracker']
        data['navigation']['tracker'] = trans
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        fixed += 1
        print(f'{lang}: OK')

print(f'\nTotal: {fixed} files updated')
