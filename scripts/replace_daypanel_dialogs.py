import re

path = 'src/components/DayPanel.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace standalone alert(...) calls
# We need to balance parentheses. Use a stack-based approach.
def replace_alerts(text):
    result = []
    i = 0
    while i < len(text):
        match = re.match(r'\balert\s*\(', text[i:])
        if match:
            start = i
            i += match.end()
            depth = 1
            arg_start = i
            while i < len(text) and depth > 0:
                if text[i] == '(':
                    depth += 1
                elif text[i] == ')':
                    depth -= 1
                i += 1
            arg = text[arg_start:i-1]
            result.append(f'dialogService.showAlert({{ description: {arg} }})')
        else:
            result.append(text[i])
            i += 1
    return ''.join(result)

content = replace_alerts(content)

# Replace confirm(...) in if statements: if (!confirm(...)) return;
# and if (confirm(...)) { ... }
def replace_confirms(text):
    result = []
    i = 0
    while i < len(text):
        # Match if (confirm(...)) or if (!confirm(...))
        match = re.match(r'(\s*)if\s*\(\s*(!?)\s*confirm\s*\(', text[i:])
        if match:
            prefix = match.group(1)
            neg = match.group(2) == '!'
            i += match.end()
            depth = 1
            arg_start = i
            while i < len(text) and depth > 0:
                if text[i] == '(':
                    depth += 1
                elif text[i] == ')':
                    depth -= 1
                i += 1
            arg = text[arg_start:i-1]
            # Now i points after the closing paren of confirm. We need to find the closing paren of if.
            # There might be spaces and then ) or )) etc.
            # Consume whitespace
            while i < len(text) and text[i].isspace():
                i += 1
            # The if condition closing paren
            if i < len(text) and text[i] == ')':
                i += 1
            result.append(f'{prefix}const confirmed = await dialogService.showConfirm({{ description: {arg} }});\n')
            if neg:
                result.append(f'{prefix}if (!confirmed) return;')
            else:
                result.append(f'{prefix}if (!confirmed) return;')
        else:
            result.append(text[i])
            i += 1
    return ''.join(result)

content = replace_confirms(content)

# Add async to useCallback callbacks that now contain await
# Replace "const name = useCallback(() => {" with "const name = useCallback(async () => {" if body contains 'await dialogService'
def add_async(text):
    # Find all useCallback definitions and check if they contain await dialogService
    pattern = r'(const\s+\w+\s*=\s*useCallback\s*\(\s*\(\s*\)\s*=>\s*\{)'
    def repl(m):
        # Find the matching closing brace
        start = m.end()
        depth = 1
        i = start
        while i < len(text) and depth > 0:
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
            i += 1
        body = text[start:i]
        if 'await dialogService' in body:
            return '(const name = useCallback(async () => {'  # placeholder, will fix below
        return m.group(0)
    return re.sub(pattern, repl, text)

# Actually, simpler: globally replace "useCallback(() => {" with "useCallback(async () => {" only in lines containing await dialogService
# We'll do line-based
lines = content.split('\n')
async_needed = False
for idx, line in enumerate(lines):
    if 'useCallback(() => {' in line:
        # Check subsequent lines until matching brace
        async_needed = False
        depth = 1
        j = idx + 1
        while j < len(lines) and depth > 0:
            for c in lines[j]:
                if c == '{':
                    depth += 1
                elif c == '}':
                    depth -= 1
                    if depth == 0:
                        break
            if 'await dialogService' in lines[j]:
                async_needed = True
            if depth == 0:
                break
            j += 1
        if async_needed:
            lines[idx] = line.replace('useCallback(() => {', 'useCallback(async () => {')

content = '\n'.join(lines)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('replaced DayPanel dialogs')
