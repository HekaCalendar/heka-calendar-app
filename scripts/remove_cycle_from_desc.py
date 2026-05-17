import json, os, sys, glob, re

sys.stdout.reconfigure(encoding='utf-8')

# Remove parenthetical phrases containing cycle-related words from reflectionRemindersDesc
# This handles the pattern: (cycle, mood, sleep, energy...) or (ciclo, humor, sueño, energía...)

cycle_pattern = re.compile(r'\s*\([^)]*(?:cycle|ciclo|ciclu|cyklus|cykel|zyklus|sykli|siklus|цикл|دورة|चक्र|周期|주기|chukr)[^)]*\)', re.IGNORECASE)

for folder in ['public/locales', 'src/i18n/locales']:
    for path in glob.glob(f'{folder}/*/journal.json'):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Use regex to find and replace the parenthetical
        new_content = cycle_pattern.sub('', content)
        
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            lang = os.path.basename(os.path.dirname(path))
            print(f'Removed cycle phrase from {lang} ({folder})')

print('\nDone!')
