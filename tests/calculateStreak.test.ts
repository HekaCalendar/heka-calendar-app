/**
 * Streak Calculation Tests
 */

import { describe, it, expect } from 'vitest';
import { calculateStreak } from '../src/components/oracle/utils';

function makeEntry(dateStr: string) {
  return { date: dateStr, content: 'test' };
}

describe('calculateStreak', () => {
  it('returns 0 for empty entries', () => {
    expect(calculateStreak([])).toBe(0);
  });

  it('returns 1 for a single entry today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(calculateStreak([makeEntry(today)])).toBe(1);
  });

  it('returns 1 for a single entry yesterday', () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterday = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(calculateStreak([makeEntry(yesterday)])).toBe(1);
  });

  it('returns 0 for entries older than yesterday', () => {
    const d = new Date();
    d.setDate(d.getDate() - 2);
    const twoDaysAgo = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    expect(calculateStreak([makeEntry(twoDaysAgo)])).toBe(0);
  });

  it('counts consecutive days correctly', () => {
    const t = new Date();
    const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    const yesterday = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;
    const d2 = new Date(); d2.setDate(d2.getDate() - 2);
    const twoDaysAgo = `${d2.getFullYear()}-${String(d2.getMonth() + 1).padStart(2, '0')}-${String(d2.getDate()).padStart(2, '0')}`;

    expect(calculateStreak([
      makeEntry(today),
      makeEntry(yesterday),
      makeEntry(twoDaysAgo),
    ])).toBe(3);
  });

  it('stops at gaps', () => {
    const t = new Date();
    const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    const yesterday = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;
    const d3 = new Date(); d3.setDate(d3.getDate() - 3);
    const threeDaysAgo = `${d3.getFullYear()}-${String(d3.getMonth() + 1).padStart(2, '0')}-${String(d3.getDate()).padStart(2, '0')}`;

    expect(calculateStreak([
      makeEntry(today),
      makeEntry(yesterday),
      makeEntry(threeDaysAgo),
    ])).toBe(2);
  });

  it('handles multiple entries on same day', () => {
    const t = new Date();
    const today = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    const d1 = new Date(); d1.setDate(d1.getDate() - 1);
    const yesterday = `${d1.getFullYear()}-${String(d1.getMonth() + 1).padStart(2, '0')}-${String(d1.getDate()).padStart(2, '0')}`;

    expect(calculateStreak([
      makeEntry(today),
      makeEntry(today),
      makeEntry(yesterday),
      makeEntry(yesterday),
    ])).toBe(2);
  });
});
