#!/usr/bin/env python3
"""
Translate tutorialVeil strings for all 29 non-English languages.
Inserts them after tutorialCelestialBody in each language block.
"""

import re
import json
import os

from openai import OpenAI

api_key = os.environ.get("MOONSHOT_API_KEY", "sk-8JNqXestnCRmab9hPbvKdM19RMh7Bx7V5TBye6RYBCzzpFwj")
client = OpenAI(api_key=api_key, base_url="https://api.moonshot.ai/v1")

strings = {
    "tutorialVeilTitle": "The Veil of Forms",
    "tutorialVeilSubtitle": "From Egyptian Gold to Nature Spirit",
    "tutorialVeilBody": "Six living palettes. Egyptian Gold, deep as temple amber. Cyberpunk Neon, electric and unbound. Nordic Frost, clean as glacier light. Solar Flare, burning with cosmic fire. Void Walker, ethereal in the dark. Nature Spirit, rooted in living earth. Six typefaces from sacred serif to tech mono. Every border, every glow, every letter -- yours.",
}

langs = [
    ("es", "Spanish"),
    ("fr", "French"),
    ("de", "German"),
    ("it", "Italian"),
    ("pt", "Portuguese"),
    ("zh", "Chinese (Simplified)"),
    ("ja", "Japanese"),
    ("ko", "Korean"),
    ("ar", "Arabic"),
    ("hi", "Hindi"),
    ("ru", "Russian"),
    ("tr", "Turkish"),
    ("pl", "Polish"),
    ("nl", "Dutch"),
    ("sv", "Swedish"),
    ("el", "Greek"),
    ("he", "Hebrew"),
    ("th", "Thai"),
    ("vi", "Vietnamese"),
    ("id", "Indonesian"),
    ("uk", "Ukrainian"),
    ("ro", "Romanian"),
    ("cs", "Czech"),
    ("hu", "Hungarian"),
    ("da", "Danish"),
    ("fi", "Finnish"),
    ("no", "Norwegian"),
    ("sk", "Slovak"),
    ("bg", "Bulgarian"),
]


def translate(text: str, target_lang: str) -> str:
    system = (
        "You are a professional translator for a premium calendar app called HEKA. "
        "Translate the given text into the target language. "
        "Preserve the poetic, elite tone. Keep proper nouns like 'Egyptian Gold', 'Cyberpunk Neon', 'Nordic Frost', 'Solar Flare', 'Void Walker', 'Nature Spirit' as-is or transliterated if the script requires it. "
        "Do NOT add explanations. Return ONLY the translated text."
    )
    try:
        resp = client.chat.completions.create(
            model="moonshot-v1-8k",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": f"Translate into {target_lang}:\n\n{text}"},
            ],
            temperature=0.3,
        )
        return resp.choices[0].message.content.strip().strip('"')
    except Exception as e:
        print(f"ERROR translating to {target_lang}: {e}")
        return text


def main():
    ts_path = "src/data/languages.ts"
    with open(ts_path, "r", encoding="utf-8") as f:
        content = f.read()

    for code, lang_name in langs:
        print(f"Translating {code} ({lang_name})...")
        translated = {k: translate(v, lang_name) for k, v in strings.items()}

        # Build insertion block
        block = (
            f'    tutorialVeilTitle: "{translated["tutorialVeilTitle"]}",\n'
            f'    tutorialVeilSubtitle: "{translated["tutorialVeilSubtitle"]}",\n'
            f'    tutorialVeilBody: "{translated["tutorialVeilBody"]}",\n'
        )

        # Find the tutorialCelestialBody line for this language and insert after it
        # Pattern: tutorialCelestialBody: "...",
        lang_start = content.find(f"  {code}: {{")
        if lang_start == -1:
            print(f"  WARNING: could not find {code} block")
            continue

        # Find tutorialCelestialBody within this language block
        search_start = lang_start
        cb_pattern = r'tutorialCelestialBody: "[^"]*"'
        match = re.search(cb_pattern, content[search_start:])
        if not match:
            print(f"  WARNING: could not find tutorialCelestialBody in {code}")
            continue

        insert_pos = search_start + match.end()
        # Insert the block right after the closing quote (before the comma or after it)
        # The match ends at the closing quote, but there's a comma after
        # Let's find the comma after the match
        comma_pos = content.find(",", insert_pos)
        if comma_pos == -1:
            print(f"  WARNING: no comma after tutorialCelestialBody in {code}")
            continue
        insert_after = comma_pos + 1
        content = content[:insert_after] + "\n" + block + content[insert_after:]
        print(f"  DONE {code}")

    with open(ts_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("\nAll translations inserted.")


if __name__ == "__main__":
    main()
