/**
 * Simple client-side profanity filter for community submissions.
 * This is a lightweight first-line defense; serious moderation requires backend ML.
 */

const BASE_WORDS = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'cock', 'pussy',
  'whore', 'slut', 'bastard', 'damn', 'hell',
];

// Generate common leet substitutions and variants
function generateVariants(word: string): string[] {
  const variants = new Set<string>([word]);
  const subs: Record<string, string[]> = {
    a: ['a', '@', '4'],
    e: ['e', '3'],
    i: ['i', '1', '!'],
    o: ['o', '0'],
    s: ['s', '$', '5'],
    t: ['t', '7', '+'],
    u: ['u', 'v'],
  };

  // Simple single-char replacements
  const chars = word.split('');
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (subs[c]) {
      for (const sub of subs[c]) {
        const mutated = word.slice(0, i) + sub + word.slice(i + 1);
        variants.add(mutated);
      }
    }
  }

  return Array.from(variants);
}

const PROFANITY_PATTERNS: RegExp[] = [];

function escapeRegexChar(c: string): string {
  // Escape regex metacharacters so they are treated as literals
  return /[.*+?^${}()|[\]\\]/.test(c) ? '\\' + c : c;
}

(function buildPatterns() {
  const allVariants = new Set<string>();
  for (const w of BASE_WORDS) {
    generateVariants(w).forEach(v => allVariants.add(v));
  }
  for (const v of allVariants) {
    // Match as whole word with optional internal spacing (e.g., "f u c k")
    const spaced = v.split('').map(escapeRegexChar).join('\\s*');
    PROFANITY_PATTERNS.push(new RegExp(`\\b${spaced}\\b`, 'i'));
  }
})();

export function containsProfanity(text: string): boolean {
  if (!text || typeof text !== 'string') return false;
  const normalized = text.toLowerCase().replace(/[-_.]+/g, '');
  return PROFANITY_PATTERNS.some(p => p.test(normalized));
}

export function filterProfanity(text: string): string {
  if (!text || typeof text !== 'string') return text;
  let result = text;
  for (const pattern of PROFANITY_PATTERNS) {
    result = result.replace(pattern, (match) => '*'.repeat(match.length));
  }
  return result;
}
