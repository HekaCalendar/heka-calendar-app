#!/usr/bin/env python3
"""
Translate tutorialAssembly strings for all 29 non-English languages.
"""

import re
from deep_translator import GoogleTranslator

strings = {
    "tutorialAssemblyTitle": "The Assembly",
    "tutorialAssemblySubtitle": "Your voice shapes the sky",
    "tutorialAssemblyBody": "Propose a holiday. Cast your vote. Watch the roadmap bend to the will of the collective. Birth Chart Sharing. AI Voice Guidance. iCal Sync. Dream Journals. Smart Notifications. Every feature you see was chosen by the community. Every holiday was born from a single suggestion. You are not a user. You are a founder.",
}

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
    ("he", "iw"),
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
        return result.replace('"', '\\"')
    except Exception as e:
        print(f"  ERROR: {e}")
        return text.replace('"', '\\"')


def main():
    ts_path = "src/data/languages.ts"
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    for code, gt_code in langs:
        print(f"Translating {code}...")
        translated = {k: translate(v, gt_code) for k, v in strings.items()}

        block = (
            f'    tutorialAssemblyTitle: "{translated["tutorialAssemblyTitle"]}",\n'
            f'    tutorialAssemblySubtitle: "{translated["tutorialAssemblySubtitle"]}",\n'
            f'    tutorialAssemblyBody: "{translated["tutorialAssemblyBody"]}",\n'
        )

        lang_start = content.find(f"  {code}: {{")
        if lang_start == -1:
            print(f"  WARNING: could not find {code} block")
            continue

        match = re.search(r'tutorialCircleBody: "[^"]*"', content[lang_start:])
        if not match:
            print(f"  WARNING: could not find tutorialCircleBody in {code}")
            continue

        insert_pos = lang_start + match.end()
        comma_pos = content.find(",", insert_pos)
        if comma_pos == -1:
            print(f"  WARNING: no comma after tutorialCircleBody in {code}")
            continue

        insert_after = comma_pos + 1
        content = content[:insert_after] + "\n" + block + content[insert_after:]
        print(f"  DONE {code}")

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("\nAll translations inserted successfully.")


if __name__ == "__main__":
    main()
