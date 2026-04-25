import pathlib

css = pathlib.Path('src/components/store/store.css').read_text(encoding='utf-8')
css_escaped = css.replace('\\', '\\\\').replace('`', '\\`')

ts = f"""export const STORE_CSS = `\n{css_escaped}
`;
"""

pathlib.Path('src/components/store/storeCss.ts').write_text(ts, encoding='utf-8')
print('Written', len(ts), 'bytes')
