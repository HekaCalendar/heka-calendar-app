import json
import glob
import os

daily_oracle_en = {
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

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)

    changed = False

    # 1. navigation: remove celestial, ensure dailyDraw = "Daily Draw"
    if 'navigation' in data and isinstance(data['navigation'], dict):
        nav = data['navigation']
        if 'celestial' in nav:
            del nav['celestial']
            changed = True
        if nav.get('dailyDraw') != "Daily Draw":
            nav['dailyDraw'] = "Daily Draw"
            changed = True

    # 2. hero: remove viewTransits, ensure dailyOracle = "Daily Oracle"
    if 'hero' in data and isinstance(data['hero'], dict):
        hero = data['hero']
        if 'viewTransits' in hero:
            del hero['viewTransits']
            changed = True
        if hero.get('dailyOracle') != "Daily Oracle":
            hero['dailyOracle'] = "Daily Oracle"
            changed = True

    # 3. oracle: ensure daily and dailyDrawTooltip are English fallback
    if 'oracle' in data and isinstance(data['oracle'], dict):
        oracle = data['oracle']
        if oracle.get('daily') != "Daily":
            oracle['daily'] = "Daily"
            changed = True
        if oracle.get('dailyDrawTooltip') != "Daily Oracle draw available":
            oracle['dailyDrawTooltip'] = "Daily Oracle draw available"
            changed = True

    # 4. dailyOracle: overwrite with English fallback values
    if 'dailyOracle' not in data:
        data['dailyOracle'] = daily_oracle_en.copy()
        changed = True
    else:
        do = data['dailyOracle']
        for k, v in daily_oracle_en.items():
            if do.get(k) != v:
                do[k] = v
                changed = True
        # remove any extra keys in dailyOracle not in the spec
        extra = [k for k in list(do.keys()) if k not in daily_oracle_en]
        for k in extra:
            del do[k]
            changed = True

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write('\n')

    return changed

# Update both public and src directories
paths = []
paths.extend(glob.glob(r'public\locales\*\journal.json'))
paths.extend(glob.glob(r'src\i18n\locales\*\journal.json'))

updated = 0
for p in paths:
    if fix_file(p):
        updated += 1
        print(f'Updated {p}')
    else:
        print(f'No changes needed for {p}')

print(f'\nTotal files updated: {updated}/{len(paths)}')
