#!/usr/bin/env python3
"""Merge a set of keys from the English locale into all other locales."""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOCALES = ROOT / "src" / "i18n" / "locales"

SUPPORTED = [
    'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru',
    'tr', 'pl', 'nl', 'sv', 'el', 'he', 'th', 'vi', 'id', 'uk', 'ro', 'cs',
    'hu', 'da', 'fi', 'no', 'sk', 'bg',
]


def deep_merge(target, source):
    for key, value in source.items():
        if isinstance(value, dict) and key in target and isinstance(target[key], dict):
            deep_merge(target[key], value)
        else:
            target[key] = value


def main():
    if len(sys.argv) < 2:
        print('Usage: python merge-locale-keys.py <namespace>')
        print('       Merges any missing keys from English into all target locales.')
        sys.exit(1)

    namespace = sys.argv[1]
    en_path = LOCALES / 'en' / f'{namespace}.json'
    en_data = json.loads(en_path.read_text(encoding='utf-8'))

    for lang in SUPPORTED:
        target_path = LOCALES / lang / f'{namespace}.json'
        if not target_path.exists():
            target_data = {}
        else:
            target_data = json.loads(target_path.read_text(encoding='utf-8'))
        deep_merge(target_data, en_data)
        target_path.write_text(json.dumps(target_data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Merged {namespace} -> {lang}')


if __name__ == '__main__':
    main()
