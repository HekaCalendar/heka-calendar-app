import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../src/utils/htmlEscape';

describe('escapeHtml', () => {
  it('escapes standard HTML special characters', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;'
    );
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('value="x"')).toBe('value=&quot;x&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("value='x'")).toBe('value=&#39;x&#39;');
  });

  it('escapes ampersands', () => {
    expect(escapeHtml('A & B & C')).toBe('A &amp; B &amp; C');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('handles plain text without special chars', () => {
    expect(escapeHtml('Hello World')).toBe('Hello World');
  });

  it('handles Unicode characters', () => {
    expect(escapeHtml('你好 <world> 🌍')).toBe('你好 &lt;world&gt; 🌍');
  });

  it('prevents XSS via nested tags', () => {
    const malicious = '<img src=x onerror=alert(1)>';
    expect(escapeHtml(malicious)).toBe(
      '&lt;img src=x onerror=alert(1)&gt;'
    );
  });
});
