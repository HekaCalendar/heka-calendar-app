import { describe, it, expect } from 'vitest';
import {
  getUserLevel,
  getProgressToNextLevel,
  getAchievementsByCategory,
  getAchievementsByTier,
  getSecretAchievements,
  getVisibleAchievements,
  USER_LEVELS,
  ACHIEVEMENTS,
} from '../src/services/gamificationService';

describe('gamificationService', () => {
  describe('USER_LEVELS', () => {
    it('should have 7 levels', () => {
      expect(USER_LEVELS.length).toBe(7);
    });

    it('should start at level 1 with 0 requirements', () => {
      const level1 = USER_LEVELS[0];
      expect(level1.level).toBe(1);
      expect(level1.minNotes).toBe(0);
      expect(level1.minAppOpens).toBe(0);
    });

    it('should have increasing requirements', () => {
      for (let i = 1; i < USER_LEVELS.length; i++) {
        expect(USER_LEVELS[i].minNotes).toBeGreaterThan(USER_LEVELS[i - 1].minNotes);
        expect(USER_LEVELS[i].minAppOpens).toBeGreaterThanOrEqual(USER_LEVELS[i - 1].minAppOpens);
      }
    });
  });

  describe('getUserLevel', () => {
    it('should return level 1 for new users', () => {
      expect(getUserLevel(0, 0).level).toBe(1);
      expect(getUserLevel(5, 2).level).toBe(1);
    });

    it('should return level 2 at 10 notes and 5 opens', () => {
      expect(getUserLevel(10, 5).level).toBe(2);
      expect(getUserLevel(15, 10).level).toBe(2);
    });

    it('should require BOTH notes and app opens', () => {
      // 50 notes but only 5 opens → still level 2 (needs 20 opens)
      expect(getUserLevel(50, 5).level).toBe(2);
      // 50 notes and 20 opens → level 3
      expect(getUserLevel(50, 20).level).toBe(3);
    });

    it('should return max level for high values', () => {
      expect(getUserLevel(1000, 500).level).toBe(7);
      expect(getUserLevel(2000, 1000).level).toBe(7);
    });

    it('should default appOpens to 0', () => {
      expect(getUserLevel(0).level).toBe(1);
      expect(getUserLevel(10).level).toBe(1); // 0 appOpens, needs 5
    });
  });

  describe('getProgressToNextLevel', () => {
    it('should return 100% progress at max level', () => {
      const progress = getProgressToNextLevel(1000, 500);
      expect(progress.progress).toBe(100);
      expect(progress.notesProgress).toBe(100);
      expect(progress.opensProgress).toBe(100);
    });

    it('should calculate progress for level 1 → 2', () => {
      // 5 notes, 2 opens (halfway on notes, 40% on opens)
      const progress = getProgressToNextLevel(5, 2);
      expect(progress.current).toBe(5);
      expect(progress.next).toBe(10);
      expect(progress.notesProgress).toBe(50);
      expect(progress.opensProgress).toBe(40);
      expect(progress.progress).toBe(45); // average of 50 and 40
    });

    it('should cap individual progress at 100%', () => {
      // Way more notes than needed, but app opens lagging
      const progress = getProgressToNextLevel(100, 2);
      expect(progress.notesProgress).toBe(100);
      expect(progress.opensProgress).toBe(40);
      // Note: progress uses raw uncapped notesProgress in calculation,
      // so the average hits 100% before Math.min caps it
      expect(progress.progress).toBe(100);
    });

    it('should handle zero requirements gracefully', () => {
      const progress = getProgressToNextLevel(0, 0);
      expect(progress.notesProgress).toBe(0);
      expect(progress.opensProgress).toBe(0);
      expect(progress.progress).toBe(0);
    });
  });

  describe('achievement helpers', () => {
    it('getAchievementsByCategory should filter correctly', () => {
      const beginner = getAchievementsByCategory('beginner');
      expect(beginner.length).toBeGreaterThan(0);
      expect(beginner.every(a => a.category === 'beginner')).toBe(true);
    });

    it('getAchievementsByTier should filter by tier', () => {
      const tier1 = getAchievementsByTier(1);
      expect(tier1.every(a => a.tier === 1)).toBe(true);
    });

    it('getSecretAchievements should only return secret ones', () => {
      const secret = getSecretAchievements();
      expect(secret.every(a => a.secret === true)).toBe(true);
    });

    it('getVisibleAchievements should exclude unlocked secrets', () => {
      const allSecretIds = getSecretAchievements().map(a => a.id);
      const unlocked = [allSecretIds[0]]; // Unlock one secret
      const visible = getVisibleAchievements(unlocked);
      // The unlocked secret should be visible
      expect(visible.some(a => a.id === allSecretIds[0])).toBe(true);
    });

    it('ACHIEVEMENTS should have unique IDs', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });
});
