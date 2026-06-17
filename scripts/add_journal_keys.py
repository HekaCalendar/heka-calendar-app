import json
import glob
import os

files = glob.glob(r'src\i18n\locales\*\journal.json')

daily_oracle = {
    "title": "Daily Oracle",
    "revealCard": "Reveal Card",
    "oneDrawPerDay": "One draw per day",
    "theMessage": "The Message",
    "theShadow": "The Shadow",
    "theInvitation": "The Invitation",
    "journalAboutThis": "Journal About This",
    "archive": "Archive",
    "back": "Back",
    "archiveTitle": "Card Archive",
    "cardsDrawn": "cards drawn",
    "filterAll": "All",
    "noCardsYet": "No cards drawn yet",
    "loadingArchive": "Loading archive...",
    "loadError": "Could not connect to the celestial field",
    "retry": "Try Again",
    "consultingOracle": "Consulting the Oracle...",
    "shufflingTheEthers": "Shuffling the ethers"
}

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 1. navigation: replace "celestial" with "dailyDraw"
    if 'navigation' in data and isinstance(data['navigation'], dict):
        nav = data['navigation']
        if 'celestial' in nav:
            # preserve order
            new_nav = {}
            for k, v in nav.items():
                if k == 'celestial':
                    new_nav['dailyDraw'] = "Daily Draw"
                else:
                    new_nav[k] = v
            data['navigation'] = new_nav
        else:
            # if missing, just add
            nav['dailyDraw'] = "Daily Draw"

    # 2. hero: replace "viewTransits" with "dailyOracle"
    if 'hero' in data and isinstance(data['hero'], dict):
        hero = data['hero']
        if 'viewTransits' in hero:
            new_hero = {}
            for k, v in hero.items():
                if k == 'viewTransits':
                    new_hero['dailyOracle'] = "Daily Oracle"
                else:
                    new_hero[k] = v
            data['hero'] = new_hero
        else:
            hero['dailyOracle'] = "Daily Oracle"

    # 3. oracle: add "daily" and "dailyDrawTooltip"
    if 'oracle' in data and isinstance(data['oracle'], dict):
        oracle = data['oracle']
        oracle['daily'] = "Daily"
        oracle['dailyDrawTooltip'] = "Daily Oracle draw available"

    # 4. add top-level "dailyOracle"
    if 'dailyOracle' not in data:
        data['dailyOracle'] = daily_oracle

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

print(f"Updated {len(files)} files.")
