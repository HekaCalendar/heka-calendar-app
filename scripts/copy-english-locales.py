#!/usr/bin/env python3
"""Copy English namespace files to all supported locales as fallback."""
import json
import pathlib
import shutil
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOCALES = ROOT / "src" / "i18n" / "locales"

SUPPORTED = [
    'es', 'fr', 'de', 'it', 'pt', 'zh', 'ja', 'ko', 'ar', 'hi', 'ru',
    'tr', 'pl', 'nl', 'sv', 'el', 'he', 'th', 'vi', 'id', 'uk', 'ro', 'cs',
    'hu', 'da', 'fi', 'no', 'sk', 'bg',
]


def main():
    namespaces = sys.argv[1:] or ['info', 'tutorial', 'stats']
    for ns in namespaces:
        src = LOCALES / 'en' / f'{ns}.json'
        if not src.exists():
            print(f'Missing English source: {src}')
            continue
        for lang in SUPPORTED:
            dst_dir = LOCALES / lang
            dst_dir.mkdir(parents=True, exist_ok=True)
            dst = dst_dir / f'{ns}.json'
            shutil.copy2(src, dst)
            print(f'Copied {ns} -> {lang}')


if __name__ == '__main__':
    main()
