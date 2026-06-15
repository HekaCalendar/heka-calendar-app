import re

path = 'src/components/PrintPreview.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import if not present
if 'dialogService' not in content:
    content = content.replace(
        "import { getErrorMessage } from '../utils/errorUtils';",
        "import { getErrorMessage } from '../utils/errorUtils';\nimport { dialogService } from './ui/DialogProvider';"
    )

# Replace alert(...) with dialogService.showAlert({ description: ... })
def replace_alerts(text):
    result = []
    i = 0
    while i < len(text):
        match = re.match(r'\balert\s*\(', text[i:])
        if match:
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

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('replaced PrintPreview alerts')
