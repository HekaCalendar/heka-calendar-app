// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  analyzeContent,
  scoreInsights,
  selectBestInsight,
  type ThemeScore,
  type GeneratedInsight,
} from '../src/oracle/oracleEngine';

describe('oracleEngine', () => {
  describe('analyzeContent', () => {
    it('returns empty array for empty text', () => {
      expect(analyzeContent('')).toEqual([]);
    });

    it('detects relationship theme', () => {
      const result = analyzeContent('I love my partner so much');
      const relationship = result.find(r => r.theme === 'relationships');
      expect(relationship).toBeDefined();
      expect(relationship?.matchedKeywords).toContain('love');
      expect(relationship?.archetype).toBe('The Lover');
    });

    it('detects career theme', () => {
      const result = analyzeContent('My work project is advancing my career');
      const career = result.find(r => r.theme === 'career');
      expect(career).toBeDefined();
      expect(career?.matchedKeywords).toContain('work');
    });

    it('detects multiple themes in mixed content', () => {
      const result = analyzeContent('I started a new relationship and feel happy about the change');
      const themes = result.map(r => r.theme);
      expect(themes).toContain('relationships');
      expect(themes).toContain('beginnings');
      expect(themes).toContain('joy');
      expect(themes).toContain('change');
    });

    it('sorts by score descending', () => {
      const result = analyzeContent('love love love work work');
      expect(result[0].score).toBeGreaterThanOrEqual(result[1]?.score ?? 0);
    });

    it('is case-insensitive', () => {
      const lower = analyzeContent('love and joy');;
      const upper = analyzeContent('LOVE AND JOY');
      expect(lower.map(r => r.theme)).toEqual(upper.map(r => r.theme));
    });

    it('matches whole words only', () => {
      const result = analyzeContent('lovely workplace');
      // "lovely" should NOT match "love" since it's a whole-word match
      const relationship = result.find(r => r.theme === 'relationships');
      expect(relationship).toBeUndefined();
    });

    it('handles fear and conflict together', () => {
      const result = analyzeContent('I am afraid of the conflict at work');
      expect(result.map(r => r.theme)).toContain('fear');
      expect(result.map(r => r.theme)).toContain('conflict');
    });
  });

  describe('scoreInsights', () => {
    const baseInsight: GeneratedInsight = {
      id: 'test-1',
      text: 'Test insight',
      score: 50,
      celestialEvent: {
        type: 'transit',
        orb: 2,
        strength: 7,
        description: 'test',
      },
      themeMatch: { theme: 'beginnings', score: 80, matchedKeywords: ['start'], archetype: 'Initiator' },
      confidence: 'high',
      requiresBirthChart: false,
    };

    it('returns insights sorted by score descending', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 30 },
        { ...baseInsight, id: 'b', score: 90 },
        { ...baseInsight, id: 'c', score: 50 },
      ];
      const scored = scoreInsights(insights);
      expect(scored[0].id).toBe('b');
      expect(scored[1].id).toBe('c');
      expect(scored[2].id).toBe('a');
    });

    it('boosts score for preferred themes', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 50, themeMatch: { theme: 'relationships', score: 80, matchedKeywords: ['love'], archetype: 'Lover' } },
      ];
      const scored = scoreInsights(insights, {
        preferredThemes: ['relationships'],
        preferredTone: 'balanced',
        ratedInsights: {},
        dismissedPatterns: [],
      });
      expect(scored[0].score).toBe(60);
    });

    it('penalizes dismissed patterns', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 50 },
      ];
      const scored = scoreInsights(insights, {
        preferredThemes: [],
        preferredTone: 'balanced',
        ratedInsights: {},
        dismissedPatterns: ['a'],
      });
      expect(scored[0].score).toBe(30);
    });

    it('adjusts score based on historical rating', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 50 },
      ];
      // rating 5 → (5-3)*5 = +10
      const scoredHigh = scoreInsights(insights, {
        preferredThemes: [],
        preferredTone: 'balanced',
        ratedInsights: { 'a': 5 },
        dismissedPatterns: [],
      });
      expect(scoredHigh[0].score).toBe(60);

      // rating 1 → (1-3)*5 = -10
      const scoredLow = scoreInsights(insights, {
        preferredThemes: [],
        preferredTone: 'balanced',
        ratedInsights: { 'a': 1 },
        dismissedPatterns: [],
      });
      expect(scoredLow[0].score).toBe(40);
    });
  });

  describe('selectBestInsight', () => {
    const baseInsight: GeneratedInsight = {
      id: 'test',
      text: 'Test',
      score: 50,
      celestialEvent: {
        type: 'transit',
        orb: 2,
        strength: 7,
        description: 'test',
      },
      themeMatch: { theme: 'beginnings', score: 80, matchedKeywords: ['start'], archetype: 'Initiator' },
      confidence: 'high',
      requiresBirthChart: false,
    };

    it('returns first insight above threshold', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'b', score: 95 },
        { ...baseInsight, id: 'a', score: 85 },
      ];
      expect(selectBestInsight(insights)?.id).toBe('b');
    });

    it('returns null when no insights meet threshold', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 10 },
      ];
      expect(selectBestInsight(insights)).toBeNull();
    });

    it('returns null for empty array', () => {
      expect(selectBestInsight([])).toBeNull();
    });

    it('filters out below-threshold before selecting', () => {
      const insights: GeneratedInsight[] = [
        { ...baseInsight, id: 'a', score: 95 },
        { ...baseInsight, id: 'b', score: 5 },
      ];
      expect(selectBestInsight(insights)?.id).toBe('a');
    });
  });
});
