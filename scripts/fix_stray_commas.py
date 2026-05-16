with open('src/data/languages.ts', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    # Check if this line is just a comma (with whitespace) and previous line was tutorialCelestialBody
    if i > 0 and lines[i-1].strip().startswith('tutorialCelestialBody:') and line.strip() == ',':
        # Skip this stray comma line
        i += 1
        continue
    new_lines.append(line)
    i += 1

with open('src/data/languages.ts', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Fixed stray commas')
