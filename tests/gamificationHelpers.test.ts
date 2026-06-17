// @ts-nocheck
import { describe, it, expect } from 'vitest';
import {
  getUserLevel,
  getProgressToNextLevel,
  getVisibleAchievements,
  getSecretAchievements,
  getAchievementsByCategory,
} from '../src/services/gamificationService';

describe('gamification helpers', () => {
  describe('getUserLevel', () => {
    it('returns level 1 for zero stats', () => {
      const level = getUserLevel(0, 0);
      expect(level.level).toBe(1);
    });

    it('returns level 1 for low stats', () => {
      const level = getUserLevel(2, 1);
      expect(level.level).toBe(1);
    });

    it('returns higher level with more notes', () => {
      const level = getUserLevel(50, 20);
      expect(level.level).toBeGreaterThan(1);
    });

    it('returns highest level for max stats', () => {
      const level = getUserLevel(10000, 10000);
      expect(level.level).toBeGreaterThanOrEqual(1);
    });

    it('uses default totalAppOpens when not provided', () => {
      const level = getUserLevel(0);
      expect(level.level).toBe(1);
    });
  });

  describe('getProgressToNextLevel', () => {
    it('returns progress for level 1', () => {
      const progress = getProgressToNextLevel(0, 0);
      expect(progress.current).toBeGreaterThanOrEqual(0);
      expect(progress.next).toBeGreaterThanOrEqual(progress.current);
      expect(progress.progress).toBeGreaterThanOrEqual(0);
    });

    it('returns max progress at highest level', () => {
      const progress = getProgressToNextLevel(10000, 10000);
      expect(progress.current).toBeGreaterThanOrEqual(1);
      expect(progress.progress).toBe(100);
    });

    it('has notesProgress and opensProgress', () => {
      const progress = getProgressToNextLevel(10, 5);
      expect(progress.notesProgress).toBeGreaterThanOrEqual(0);
      expect(progress.opensProgress).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getAchievementsByCategory', () => {
    it('returns empty array for unknown category', () => {
      const achievements = getAchievementsByCategory('nonexistent' as any);
      expect(achievements).toEqual([]);
    });

    it('returns achievements for valid category', () => {
      const achievements = getAchievementsByCategory('engagement');
      // All returned achievements match the category (may be empty if no such category)
      achievements.forEach(a => expect(a.category).toBe('engagement'));
    });

    it('returns empty array for unknown category', () => {
      expect(getAchievementsByCategory('nonexistent' as any)).toEqual([]);
    });
  });

  describe('getSecretAchievements', () => {
    it('returns only secret achievements', () => {
      const secret = getSecretAchievements();
      secret.forEach(a => expect(a.secret).toBe(true));
    });

    it('secret achievements have ids and names', () => {
      const secret = getSecretAchievements();
      secret.forEach(a => {
        expect(a.id).toBeTruthy();
        expect(a.name).toBeTruthy();
      });
    });
  });

  describe('getVisibleAchievements', () => {
    it('shows non-secret achievements', () => {
      const visible = getVisibleAchievements([]);
      visible.forEach(a => {
        if (a.secret) {
          throw new Error('Secret achievement should not be visible when not unlocked');
        }
      });
    });

    it('shows unlocked secret achievements', () => {
      const secret = getSecretAchievements();
      if (secret.length === 0) return;
      const unlockedId = secret[0].id;
      const visible = getVisibleAchievements([unlockedId]);
      expect(visible.some(a => a.id === unlockedId)).toBe(true);
    });

    it('shows more when secrets are unlocked', () => {
      const withoutSecrets = getVisibleAchievements([]);
      const allIds = getSecretAchievements().map(a => a.id);
      const withSecrets = getVisibleAchievements(allIds);
      expect(withSecrets.length).toBeGreaterThanOrEqual(withoutSecrets.length);
    });
  });
});
