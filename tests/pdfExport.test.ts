import { describe, it, expect } from 'vitest';
import { generateDiaryPDF } from '../src/services/pdfExport';
import type { DiaryEntry } from '../src/oracle/diaryTypes';

describe('pdfExport', () => {
  describe('generateDiaryPDF', () => {
    it('returns a string containing HTML', () => {
      const result = generateDiaryPDF([], { title: 'Test Journal' });
      expect(typeof result).toBe('string');
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('<html');
    });

    it('sorts entries chronologically by timestamp', () => {
      const entries: DiaryEntry[] = [
        {
          id: '2',
          date: '2024-02-01',
          timestamp: '2024-02-01T12:00:00Z',
          content: 'February entry',
          createdAt: '2024-02-01T12:00:00Z',
          updatedAt: '2024-02-01T12:00:00Z',
        },
        {
          id: '1',
          date: '2024-01-01',
          timestamp: '2024-01-01T10:00:00Z',
          content: 'January entry',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
        {
          id: '3',
          date: '2024-03-01',
          timestamp: '2024-03-01T08:00:00Z',
          content: 'March entry',
          createdAt: '2024-03-01T08:00:00Z',
          updatedAt: '2024-03-01T08:00:00Z',
        },
      ];

      const result = generateDiaryPDF(entries);
      const janIndex = result.indexOf('January entry');
      const febIndex = result.indexOf('February entry');
      const marIndex = result.indexOf('March entry');

      expect(janIndex).toBeGreaterThan(-1);
      expect(febIndex).toBeGreaterThan(-1);
      expect(marIndex).toBeGreaterThan(-1);
      expect(janIndex).toBeLessThan(febIndex);
      expect(febIndex).toBeLessThan(marIndex);
    });

    it('groups entries by month', () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-15',
          timestamp: '2024-01-15T10:00:00Z',
          content: 'Mid January',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
        },
        {
          id: '2',
          date: '2024-01-20',
          timestamp: '2024-01-20T10:00:00Z',
          content: 'Late January',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
        },
        {
          id: '3',
          date: '2024-02-05',
          timestamp: '2024-02-05T10:00:00Z',
          content: 'Early February',
          createdAt: '2024-02-05T10:00:00Z',
          updatedAt: '2024-02-05T10:00:00Z',
        },
      ];

      const result = generateDiaryPDF(entries);
      // Each month group should be wrapped in a section with class month-section
      const sectionMatches = result.match(/class="month-section"/g);
      expect(sectionMatches).toHaveLength(2);
    });

    it('handles empty entries array', () => {
      const result = generateDiaryPDF([], { title: 'Empty Journal' });
      expect(typeof result).toBe('string');
      expect(result).toContain('<!DOCTYPE html>');
      expect(result).toContain('Empty Journal');
      expect(result).toContain('0 entries');
    });

    it('escapes HTML in entry content', () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-01',
          timestamp: '2024-01-01T10:00:00Z',
          content: '<script>alert("xss")</script>',
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
      ];

      const result = generateDiaryPDF(entries);
      expect(result).not.toContain('<script>');
      expect(result).toContain('&lt;script&gt;');
    });

    it('escapes HTML in insight text', () => {
      const entries: DiaryEntry[] = [
        {
          id: '1',
          date: '2024-01-01',
          timestamp: '2024-01-01T10:00:00Z',
          content: 'Entry with insight',
          insight: {
            id: 'i1',
            text: '<b>Malicious</b> insight',
            confidence: 'high',
            score: 95,
            matchedTheme: 'growth',
            celestialEvent: { type: 'moon', description: 'Full moon', strength: 0.9 },
            usedBirthChart: false,
            dismissed: false,
          },
          createdAt: '2024-01-01T10:00:00Z',
          updatedAt: '2024-01-01T10:00:00Z',
        },
      ];

      const result = generateDiaryPDF(entries);
      expect(result).not.toContain('<b>Malicious</b>');
      expect(result).toContain('&lt;b&gt;Malicious&lt;/b&gt;');
    });

    it('uses default title when none provided', () => {
      const result = generateDiaryPDF([]);
      expect(result).toContain('HEKA Journal');
    });
  });
});
