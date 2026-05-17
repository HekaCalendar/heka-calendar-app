import json, os, sys, glob, re

sys.stdout.reconfigure(encoding='utf-8')

# Rename trackerReminders -> reflectionReminders in all journal.json files
folders = ['public/locales', 'src/i18n/locales']

for folder in folders:
    for path in glob.glob(f'{folder}/*/journal.json'):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        content = content.replace('"trackerReminders"', '"reflectionReminders"')
        content = content.replace('"trackerRemindersDesc"', '"reflectionRemindersDesc"')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {path}')

# Update source code files
src_files = [
    'src/types/notifications.ts',
    'src/services/notificationEngine.ts',
    'src/components/notification/UnifiedNotificationSettings.tsx',
    'src/components/notification/JournalNotificationSettings.tsx',
    'src/components/JournalSettings.tsx',
]

for path in src_files:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        old = content
        content = content.replace('trackerReminders', 'reflectionReminders')
        content = content.replace('tracker-reminder', 'reflection-reminder')
        if content != old:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {path}')
        else:
            print(f'No changes needed: {path}')

print('\nDone!')
