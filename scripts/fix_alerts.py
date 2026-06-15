import re

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all dialogService.showAlert({ description: ... ); calls and fix closing braces.
    pattern = r"dialogService\.showAlert\(\{ description:"
    positions = [m.start() for m in re.finditer(pattern, content)]

    # We need to insert ' }' before the final ');' of each call.
    # Process from end to start so positions remain valid.
    new_content = content
    for start in reversed(positions):
        # Find the end of this call by scanning from start
        i = start + len("dialogService.showAlert({ description:")
        depth = 1  # we're inside showAlert(...), opened at start + len(...)
        # Actually we're at the opening of options object too, so depth for {} is 1 and () is 1
        brace_depth = 1
        paren_depth = 1
        while i < len(new_content):
            c = new_content[i]
            if c == '{':
                brace_depth += 1
            elif c == '}':
                brace_depth -= 1
            elif c == '(':
                paren_depth += 1
            elif c == ')':
                paren_depth -= 1
                if paren_depth == 0:
                    # This is the closing paren of showAlert call.
                    # Insert '}' before it to close options object.
                    new_content = new_content[:i] + '}' + new_content[i:]
                    break
            i += 1

    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f'fixed {path}')

fix_file('src/components/day-panel/useDayPanel.ts')
fix_file('src/components/DayPanel.tsx')
