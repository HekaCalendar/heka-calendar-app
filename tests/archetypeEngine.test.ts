// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  detectArchetype,
  getArchetypeDialect,
  getArchetypeDescription,
  type UserArchetype,
} from '../src/oracle/archetypeEngine';
import type { PlannerTask } from '../src/types';
import type { DiaryEntry } from '../src/oracle/diaryTypes';

describe('archetypeEngine', () => {
  describe('detectArchetype', () => {
    it('returns warrior for workout-heavy tasks', () => {
      const tasks = [
        { id: '1', userId: 'u1', content: 'Gym workout and lifting weights', category: 'fitness' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', userId: 'u1', content: 'Run 5km and train hard', category: 'fitness' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', userId: 'u1', content: 'Compete in boxing match', category: 'fitness' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '4', userId: 'u1', content: 'Power through strength training', category: 'fitness' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ] as unknown as PlannerTask[];
      const result = detectArchetype(tasks, []);
      expect(result.archetype).toBe('warrior');
      expect(result.confidence).toBeGreaterThan(0);
    });

    it('returns monk for meditation-heavy entries', () => {
      const entries = [
        { id: '1', content: 'Meditated for 30 minutes in silence', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', createdAt: '2024-01-01', updatedAt: '2024-01-01', detectedThemes: ['peace', 'stillness'] },
        { id: '2', content: 'Practiced breathwork and mindfulness', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', createdAt: '2024-01-01', updatedAt: '2024-01-01', detectedThemes: ['spirit', 'gratitude'] },
      ] as unknown as DiaryEntry[];
      const result = detectArchetype([], entries);
      expect(result.archetype).toBe('monk');
    });

    it('returns artist for creative-heavy tasks', () => {
      const tasks = [
        { id: '1', userId: 'u1', content: 'Paint a canvas and create art', category: 'creative' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', userId: 'u1', content: 'Design something beautiful and aesthetic', category: 'creative' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', userId: 'u1', content: 'Write poetry and express feelings', category: 'creative' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ] as unknown as PlannerTask[];
      const result = detectArchetype(tasks, []);
      expect(result.archetype).toBe('artist');
    });

    it('returns strategist for planning-heavy tasks', () => {
      const tasks = [
        { id: '1', userId: 'u1', content: 'Plan strategy and organize goals', category: 'work' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '2', userId: 'u1', content: 'Analyze data and research market', category: 'work' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
        { id: '3', userId: 'u1', content: 'System design and workflow optimization', category: 'work' as const, hekaDate: { year: 2024, month: 1, day: 1 }, dayKey: 'heka:2024:1:1', timezone: 'UTC', createdAt: '2024-01-01', updatedAt: '2024-01-01' },
      ] as unknown as PlannerTask[];
      const result = detectArchetype(tasks, []);
      expect(result.archetype).toBe('strategist');
    });

    it('returns mystic for intuition-heavy entries', () => {
      const entries = [
        { id: '1', content: 'Had a vivid dream about transformation', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', createdAt: '2024-01-01', updatedAt: '2024-01-01', detectedThemes: ['dreams', 'intuition'] },
        { id: '2', content: 'Consulted tarot cards and felt guided', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', createdAt: '2024-01-01', updatedAt: '2024-01-01', detectedThemes: ['mystery', 'guidance'] },
      ] as unknown as DiaryEntry[];
      const result = detectArchetype([], entries);
      expect(result.archetype).toBe('mystic');
    });

    it('returns phoenix for transformation-heavy entries', () => {
      const entries: DiaryEntry[] = [
        { id: '1', content: 'Started a new chapter and transformed my life', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', detectedThemes: ['change', 'rebirth'] },
        { id: '2', content: 'Overcame crisis and emerged stronger', date: '2024-01-01', timestamp: '2024-01-01T00:00:00Z', detectedThemes: ['resilience', 'growth'] },
      ] as DiaryEntry[];
      const result = detectArchetype([], entries);
      expect(result.archetype).toBe('phoenix');
    });

    it('returns zero confidence for no data', () => {
      const result = detectArchetype([], []);
      expect(result.confidence).toBe(0);
      expect(result.dominantKeywords).toEqual([]);
    });

    it('returns scores object with all archetypes', () => {
      const tasks: PlannerTask[] = [
        { id: '1', content: 'Workout', completed: false },
      ] as PlannerTask[];
      const result = detectArchetype(tasks, []);
      expect(result.scores).toHaveProperty('warrior');
      expect(result.scores).toHaveProperty('monk');
      expect(result.scores).toHaveProperty('artist');
      expect(result.scores).toHaveProperty('strategist');
      expect(result.scores).toHaveProperty('mystic');
      expect(result.scores).toHaveProperty('phoenix');
    });

    it('reduces confidence when race is close', () => {
      // Mixed content that could match multiple archetypes
      const tasks: PlannerTask[] = [
        { id: '1', content: 'Workout and meditate', completed: false },
      ] as PlannerTask[];
      const result = detectArchetype(tasks, []);
      // With close scores, confidence should be reduced
      expect(result.confidence).toBeLessThan(1);
    });
  });

  describe('getArchetypeDialect', () => {
    it('returns a greeting for warrior', () => {
      const greeting = getArchetypeDialect('warrior', 'greeting');
      expect(greeting).not.toBeNull();
      expect(greeting!.length).toBeGreaterThan(0);
    });

    it('returns motivation for monk', () => {
      const motivation = getArchetypeDialect('monk', 'motivation');
      expect(motivation).not.toBeNull();
      expect(motivation!.length).toBeGreaterThan(0);
    });

    it('returns celebration for artist', () => {
      const celebration = getArchetypeDialect('artist', 'celebration');
      expect(celebration).not.toBeNull();
      expect(celebration!.length).toBeGreaterThan(0);
    });

    it('returns wisdom for strategist', () => {
      const wisdom = getArchetypeDialect('strategist', 'wisdom');
      expect(wisdom).not.toBeNull();
      expect(wisdom!.length).toBeGreaterThan(0);
    });

    it('returns celestial for mystic', () => {
      const celestial = getArchetypeDialect('mystic', 'celestial');
      expect(celestial).not.toBeNull();
      expect(celestial!.length).toBeGreaterThan(0);
    });

    it('returns task for phoenix', () => {
      const task = getArchetypeDialect('phoenix', 'task');
      expect(task).not.toBeNull();
      expect(task!.length).toBeGreaterThan(0);
    });

    it('returns null for undefined archetype', () => {
      expect(getArchetypeDialect(undefined, 'greeting')).toBeNull();
    });

    it('returns null for invalid archetype', () => {
      expect(getArchetypeDialect('invalid' as UserArchetype, 'greeting')).toBeNull();
    });
  });

  describe('getArchetypeDescription', () => {
    it('returns description for warrior', () => {
      expect(getArchetypeDescription('warrior')).toContain('discipline');
    });

    it('returns description for monk', () => {
      expect(getArchetypeDescription('monk')).toContain('stillness');
    });

    it('returns description for artist', () => {
      expect(getArchetypeDescription('artist')).toContain('Creation');
    });

    it('returns description for strategist', () => {
      expect(getArchetypeDescription('strategist')).toContain('systems');
    });

    it('returns description for mystic', () => {
      expect(getArchetypeDescription('mystic')).toContain('Intuition');
    });

    it('returns description for phoenix', () => {
      expect(getArchetypeDescription('phoenix')).toContain('Transformation');
    });

    it('returns fallback for undefined', () => {
      expect(getArchetypeDescription(undefined)).toContain('still forming');
    });
  });
});
