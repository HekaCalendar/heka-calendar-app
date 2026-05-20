import { describe, it, expect } from 'vitest';
import {
  seededRandom,
  pickTemplate,
  formatTemplate,
} from '../src/services/notificationTemplates';

describe('notificationTemplates', () => {
  describe('seededRandom', () => {
    it('returns a number between 0 and 1', () => {
      const r = seededRandom('test-seed');
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    });

    it('returns consistent results for same seed', () => {
      const r1 = seededRandom('consistent');
      const r2 = seededRandom('consistent');
      expect(r1).toBe(r2);
    });

    it('returns different results for different seeds', () => {
      const r1 = seededRandom('seed-a');
      const r2 = seededRandom('seed-b');
      expect(r1).not.toBe(r2);
    });

    it('handles empty string seed', () => {
      const r = seededRandom('');
      expect(typeof r).toBe('number');
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThan(1);
    });
  });

  describe('pickTemplate', () => {
    it('picks from array deterministically', () => {
      const templates = [
        { title: 'A', body: 'a' },
        { title: 'B', body: 'b' },
        { title: 'C', body: 'c' },
      ];
      const picked = pickTemplate(templates, 'fixed-seed');
      expect(templates).toContain(picked);
    });

    it('picks same template for same seed', () => {
      const templates = [
        { title: 'A', body: 'a' },
        { title: 'B', body: 'b' },
      ];
      const p1 = pickTemplate(templates, 'same');
      const p2 = pickTemplate(templates, 'same');
      expect(p1).toBe(p2);
    });

    it('picks from single-item array', () => {
      const templates = [{ title: 'Only', body: 'one' }];
      expect(pickTemplate(templates, 'any')).toEqual(templates[0]);
    });
  });

  describe('formatTemplate', () => {
    it('replaces variables in title and body', () => {
      const template = { title: 'Hello {name}', body: 'You have {count} messages' };
      const result = formatTemplate(template, { name: 'Alice', count: '5' });
      expect(result.title).toBe('Hello Alice');
      expect(result.body).toBe('You have 5 messages');
    });

    it('replaces multiple occurrences', () => {
      const template = { title: '{greet} {greet}', body: 'Test' };
      const result = formatTemplate(template, { greet: 'Hi' });
      expect(result.title).toBe('Hi Hi');
    });

    it('leaves unreplaced placeholders if variable missing', () => {
      const template = { title: 'Hello {name}', body: 'Test' };
      const result = formatTemplate(template, {});
      expect(result.title).toBe('Hello {name}');
    });

    it('handles empty vars object', () => {
      const template = { title: 'Static', body: 'No vars' };
      const result = formatTemplate(template, {});
      expect(result.title).toBe('Static');
      expect(result.body).toBe('No vars');
    });
  });
});
