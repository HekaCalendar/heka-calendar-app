import re

with open('src/data/languages.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add new fields to WizardStrings interface (after aiSetUpLater)
old_interface = "  aiSetUpLater: string;\n  tutorialWelcomeSubtitle: string;"
new_interface = "  aiSetUpLater: string;\n  hekaCoachTitle: string;\n  hekaCoachDesc: string;\n  hekaAIDesc: string;\n  apiKeyHelp: string;\n  tutorialWelcomeSubtitle: string;"
content = content.replace(old_interface, new_interface)

# 2. Fix trueDesc in all languages
fixes = [
    ('trueDesc: "13 months of 28 days. Follows its own pure cycle', 
     'trueDesc: "12 months of 28 days + March of 29–30 days. Follows its own pure astronomical cycle'),
    ('trueDesc: "13 meses de 28 días. Sigue su propio ciclo puro',
     'trueDesc: "12 meses de 28 días + marzo de 29–30 días. Sigue su propio ciclo puro'),
    ('trueDesc: "13 mois de 28 jours. Suit son propre cycle pur',
     'trueDesc: "12 mois de 28 jours + mars de 29–30 jours. Suit son propre cycle pur'),
    ('trueDesc: "13 Monate à 28 Tage. Folgt seinem eigenen reinen Zyklus',
     'trueDesc: "12 Monate à 28 Tage + März mit 29–30 Tagen. Folgt seinem eigenen reinen Zyklus'),
    ('trueDesc: "13 mesi di 28 giorni. Segue il proprio ciclo puro',
     'trueDesc: "12 mesi di 28 giorni + marzo di 29–30 giorni. Segue il proprio ciclo puro'),
    ('trueDesc: "13 meses de 28 dias. Segue seu próprio ciclo puro',
     'trueDesc: "12 meses de 28 dias + março de 29–30 dias. Segue seu próprio ciclo puro'),
    ('trueDesc: "13个月，每月28天。遵循自己的纯周期',
     'trueDesc: "12个月，每月28天 + 三月29–30天。遵循自己的纯周期'),
    ('trueDesc: "13ヶ月、各28日。独自の純粋な周期に従う',
     'trueDesc: "12ヶ月、各28日 + 3月は29–30日。独自の純粋な周期に従う'),
    ('trueDesc: "13개월, 각 28일. 자체의 순수한 주기를 따름',
     'trueDesc: "12개월, 각 28일 + 3월은 29–30일. 자체의 순수한 주기를 따름'),
    ('trueDesc: "13 شهراً من 28 يوماً. يتبع دورته النقية الخاصة',
     'trueDesc: "12 شهراً من 28 يوماً + مارس 29–30 يوماً. يتبع دورته النقية الخاصة'),
    ('trueDesc: "13 महीने, 28 दिन प्रत्येक. अपने शुद्ध चक्र का पालन करता है',
     'trueDesc: "12 महीने, 28 दिन प्रत्येक + मार्च 29–30 दिन. अपने शुद्ध चक्र का पालन करता है'),
    ('trueDesc: "13 месяцев по 28 дней. Следует своему чистому циклу',
     'trueDesc: "12 месяцев по 28 дней + март 29–30 дней. Следует своему чистому циклу'),
    ('trueDesc: "13 ay, her biri 28 gün. Kendi saf döngüsünü izler',
     'trueDesc: "12 ay, her biri 28 gün + mart 29–30 gün. Kendi saf döngüsünü izler'),
    ('trueDesc: "13 miesięcy po 28 dni. Podąża za własnym czystym cyklem',
     'trueDesc: "12 miesięcy po 28 dni + marzec 29–30 dni. Podąża za własnym czystym cyklem'),
    ('trueDesc: "13 maanden van 28 dagen. Volgt zijn eigen pure cyclus',
     'trueDesc: "12 maanden van 28 dagen + maart 29–30 dagen. Volgt zijn eigen pure cyclus'),
    ('trueDesc: "13 månader á 28 dagar. Följer sin egen rena cykel',
     'trueDesc: "12 månader á 28 dagar + mars 29–30 dagar. Följer sin egen rena cykel'),
    ('trueDesc: "13 μήνες των 28 ημερών. Ακολουθεί τον δικό του καθαρό κύκλο',
     'trueDesc: "12 μήνες των 28 ημερών + Μάρτιος 29–30 ημέρες. Ακολουθεί τον δικό του καθαρό κύκλο'),
    ('trueDesc: "13 חודשים של 28 יום. עוקב אחרי המחזור הנקי שלו',
     'trueDesc: "12 חודשים של 28 יום + מרץ 29–30 יום. עוקב אחרי המחזור הנקי שלו'),
    ('trueDesc: "13 เดือน ๆ ละ 28 วัน. ปฏิบัติตามวัฏจักรบริสุทธิ์ของตนเอง',
     'trueDesc: "12 เดือน ๆ ละ 28 วัน + มีนาคม 29–30 วัน. ปฏิบัติตามวัฏจักรบริสุทธิ์ของตนเอง'),
    ('trueDesc: "13 tháng, mỗi tháng 28 ngày. Tuân theo chu kỳ thuần khiết của riêng nó',
     'trueDesc: "12 tháng, mỗi tháng 28 ngày + tháng 3 29–30 ngày. Tuân theo chu kỳ thuần khiết của riêng nó'),
    ('trueDesc: "13 bulan, masing-masing 28 hari. Mengikuti siklus murninya sendiri',
     'trueDesc: "12 bulan, masing-masing 28 hari + Maret 29–30 hari. Mengikuti siklus murninya sendiri'),
    ('trueDesc: "13 місяців по 28 днів. Дотримується власного чистого циклу',
     'trueDesc: "12 місяців по 28 днів + березень 29–30 днів. Дотримується власного чистого циклу'),
    ('trueDesc: "13 luni de câte 28 zile. Urmează propriul ciclu pur',
     'trueDesc: "12 luni de câte 28 zile + martie 29–30 zile. Urmează propriul ciclu pur'),
    ('trueDesc: "13 měsíců po 28 dnech. Následuje vlastní čistý cyklus',
     'trueDesc: "12 měsíců po 28 dnech + březen 29–30 dní. Následuje vlastní čistý cyklus'),
    ('trueDesc: "13 hónap 28 napból. Követi saját tiszta ciklusát',
     'trueDesc: "12 hónap 28 napból + március 29–30 nap. Követi saját tiszta ciklusát'),
    ('trueDesc: "13 måneder á 28 dage. Følger sin egen rene cyklus',
     'trueDesc: "12 måneder á 28 dage + marts 29–30 dage. Følger sin egen rene cyklus'),
    ('trueDesc: "13 kuukautta, 28 päivää kukin. Noudattaa omaa puhdasta sykliään',
     'trueDesc: "12 kuukautta, 28 päivää kukin + maaliskuu 29–30 päivää. Noudattaa omaa puhdasta sykliään'),
    ('trueDesc: "13 måneder á 28 dager. Følger sin egen rene syklus',
     'trueDesc: "12 måneder á 28 dager + mars 29–30 dager. Følger sin egen rene syklus'),
    ('trueDesc: "13 mesiacov po 28 dňoch. Nasleduje vlastný čistý cyklus',
     'trueDesc: "12 mesiacov po 28 dňoch + marec 29–30 dní. Nasleduje vlastný čistý cyklus'),
]

for old, new in fixes:
    if old in content:
        content = content.replace(old, new)
    else:
        import sys
        sys.stdout.reconfigure(encoding='utf-8')
        print(f'WARNING: not found: {old[:60]}...')

# 3. Add new fields before selectModePrompt in each language block
pattern = r"(    selectModePrompt: [^,\n]+,\n  },)"
replacement = r"""    hekaCoachTitle: 'HEKA Coach',
    hekaCoachDesc: 'Built-in celestial intelligence. No API key needed.',
    hekaAIDesc: 'Connect your own AI provider for deeper personalization.',
    apiKeyHelp: 'How to get a key',
\1"""

content = re.sub(pattern, replacement, content)

with open('src/data/languages.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print('Done!')
