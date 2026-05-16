#!/usr/bin/env python3
"""
Remove incorrectly-inserted English veil strings and replace with
proper Google Translate translations for all 29 non-English languages.
"""

import re
from deep_translator import GoogleTranslator

strings = {
    "tutorialVeilTitle": "The Veil of Forms",
    "tutorialVeilSubtitle": "From Egyptian Gold to Nature Spirit",
    "tutorialVeilBody": "Six living palettes. Egyptian Gold, deep as temple amber. Cyberpunk Neon, electric and unbound. Nordic Frost, clean as glacier light. Solar Flare, burning with cosmic fire. Void Walker, ethereal in the dark. Nature Spirit, rooted in living earth. Six typefaces from sacred serif to tech mono. Every border, every glow, every letter -- yours.",
}

# Google Translate target codes
langs = [
    ("es", "es"),
    ("fr", "fr"),
    ("de", "de"),
    ("it", "it"),
    ("pt", "pt"),
    ("zh", "zh-CN"),
    ("ja", "ja"),
    ("ko", "ko"),
    ("ar", "ar"),
    ("hi", "hi"),
    ("ru", "ru"),
    ("tr", "tr"),
    ("pl", "pl"),
    ("nl", "nl"),
    ("sv", "sv"),
    ("el", "el"),
    ("he", "iw"),   # Google uses 'iw' for Hebrew
    ("th", "th"),
    ("vi", "vi"),
    ("id", "id"),
    ("uk", "uk"),
    ("ro", "ro"),
    ("cs", "cs"),
    ("hu", "hu"),
    ("da", "da"),
    ("fi", "fi"),
    ("no", "no"),
    ("sk", "sk"),
    ("bg", "bg"),
]


def translate(text: str, target: str) -> str:
    try:
        t = GoogleTranslator(source="en", target=target)
        result = t.translate(text)
        # Escape double quotes for TS string literal
        return result.replace('"', '\\"')
    except Exception as e:
        print(f"  ERROR: {e}")
        return text.replace('"', '\\"')


def main():
    ts_path = "src/data/languages.ts"
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Step 1: Remove ALL existing tutorialVeil lines (both correct and incorrect)
    content = re.sub(r'\n?    tutorialVeilTitle: "[^"]*",\n', '\n', content)
    content = re.sub(r'\n?    tutorialVeilSubtitle: "[^"]*",\n', '\n', content)
    content = re.sub(r'\n?    tutorialVeilBody: "[^"]*",\n', '\n', content)

    # Step 2: For each language, insert properly translated strings after tutorialCelestialBody
    for code, gt_code in langs:
        print(f"Translating {code}...")

        translated = {
            k: translate(v, gt_code)
            for k, v in strings.items()
        }

        block = (
            f'    tutorialVeilTitle: "{translated["tutorialVeilTitle"]}",\n'
            f'    tutorialVeilSubtitle: "{translated["tutorialVeilSubtitle"]}",\n'
            f'    tutorialVeilBody: "{translated["tutorialVeilBody"]}",\n'
        )

        # Find tutorialCelestialBody line for this language
        lang_start = content.find(f"  {code}: {{")
        if lang_start == -1:
            print(f"  WARNING: could not find {code} block")
            continue

        match = re.search(r'tutorialCelestialBody: "[^"]*"', content[lang_start:])
        if not match:
            print(f"  WARNING: could not find tutorialCelestialBody in {code}")
            continue

        insert_pos = lang_start + match.end()
        comma_pos = content.find(",", insert_pos)
        if comma_pos == -1:
            print(f"  WARNING: no comma after tutorialCelestialBody in {code}")
            continue

        insert_after = comma_pos + 1
        content = content[:insert_after] + "\n" + block + content[insert_after:]
        print(f"  DONE {code}")

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("\nAll translations inserted successfully.")


if __name__ == "__main__":
    main()
