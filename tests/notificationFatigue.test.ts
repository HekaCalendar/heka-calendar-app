/**
 * Notification Fatigue Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationFatigue } from '../src/services/notificationFatigue';

const STORAGE_KEY = 'heka-notification-fatigue';

describe('NotificationFatigue', () => {
  beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);
    NotificationFatigue.reset();
  });

  describe('shouldSuppress', () => {
    it('never suppresses core notifications', () => {
      expect(NotificationFatigue.shouldSuppress('core')).toBe(false);
    });

    it('suppresses ambient when fatigued', () => {
      // Trigger fatigue with 5 consecutive dismisses
      for (let i = 0; i < 5; i++) {
        NotificationFatigue.recordDismissed();
      }
      expect(NotificationFatigue.shouldSuppress('ambient')).toBe(true);
    });

    it('does not suppress standard when fatigued', () => {
      for (let i = 0; i < 5; i++) {
        NotificationFatigue.recordDismissed();
      }
      expect(NotificationFatigue.shouldSuppress('standard')).toBe(false);
    });

    it('does not immediately reset fatigue after one tap', () => {
      for (let i = 0; i < 5; i++) {
        NotificationFatigue.recordDismissed();
      }
      expect(NotificationFatigue.shouldSuppress('ambient')).toBe(true);

      // One tap resets consecutive dismisses but fatigue mode has a cooldown
      NotificationFatigue.recordTapped(8);
      expect(NotificationFatigue.getProfile().consecutiveDismisses).toBe(0);
      // Fatigue cooldown persists until days pass
      expect(NotificationFatigue.getProfile().isFatigued).toBe(true);
    });
  });

  describe('getAdaptiveCap', () => {
    it('returns base cap when no fatigue', () => {
      expect(NotificationFatigue.getAdaptiveCap(3, 'standard')).toBe(3);
      expect(NotificationFatigue.getAdaptiveCap(2, 'ambient')).toBe(2);
    });

    it('reduces cap in fatigue mode', () => {
      for (let i = 0; i < 5; i++) {
        NotificationFatigue.recordDismissed();
      }
      // Fatigue mode reduces multiplier to 0.5
      const cap = NotificationFatigue.getAdaptiveCap(3, 'standard');
      expect(cap).toBeLessThan(3);
      expect(cap).toBeGreaterThanOrEqual(1);
    });

    it('zeros ambient cap in fatigue mode', () => {
      for (let i = 0; i < 5; i++) {
        NotificationFatigue.recordDismissed();
      }
      expect(NotificationFatigue.getAdaptiveCap(2, 'ambient')).toBe(1); // max(1, floor(2*0.5)) = 1
    });

    it('core cap is always infinity', () => {
      expect(NotificationFatigue.getAdaptiveCap(Infinity, 'core')).toBe(Infinity);
    });
  });

  describe('recordDelivered', () => {
    it('tracks delivered count', () => {
      NotificationFatigue.recordDelivered(8);
      const profile = NotificationFatigue.getProfile();
      expect(profile.delivered7d).toBeGreaterThan(0);
    });
  });

  describe('getProfile', () => {
    it('returns default profile when none stored', () => {
      const profile = NotificationFatigue.getProfile();
      expect(profile.consecutiveDismisses).toBe(0);
      expect(profile.tapThroughRate).toBe(0.5);
      expect(profile.adaptiveCapMultiplier).toBe(1);
    });
  });
});
