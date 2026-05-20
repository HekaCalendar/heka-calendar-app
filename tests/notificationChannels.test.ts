import { describe, it, expect } from 'vitest';
import {
  HEKA_CHANNELS,
  NOTIFICATION_ACTIONS,
  getChannelForTier,
  getChannelForCelebration,
  getActionsForType,
} from '../src/services/notificationChannels';

describe('notificationChannels', () => {
  describe('HEKA_CHANNELS', () => {
    it('has core channel', () => {
      expect(HEKA_CHANNELS.heka_core).toBeDefined();
      expect(HEKA_CHANNELS.heka_core.importance).toBe(5);
      expect(HEKA_CHANNELS.heka_core.vibration).toBe(true);
    });

    it('has standard channel', () => {
      expect(HEKA_CHANNELS.heka_standard).toBeDefined();
      expect(HEKA_CHANNELS.heka_standard.importance).toBe(4);
    });

    it('has ambient channel', () => {
      expect(HEKA_CHANNELS.heka_ambient).toBeDefined();
      expect(HEKA_CHANNELS.heka_ambient.importance).toBe(2);
      expect(HEKA_CHANNELS.heka_ambient.vibration).toBe(false);
    });

    it('has celebration channel', () => {
      expect(HEKA_CHANNELS.heka_celebration).toBeDefined();
      expect(HEKA_CHANNELS.heka_celebration.importance).toBe(4);
    });

    it('each channel has required fields', () => {
      for (const ch of Object.values(HEKA_CHANNELS)) {
        expect(ch.id).toBeTruthy();
        expect(ch.name).toBeTruthy();
        expect(ch.description).toBeTruthy();
        expect(ch.importance).toBeGreaterThanOrEqual(1);
        expect(ch.importance).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('NOTIFICATION_ACTIONS', () => {
    it('has actions for task-reminder', () => {
      expect(NOTIFICATION_ACTIONS['task-reminder']).toBeInstanceOf(Array);
      expect(NOTIFICATION_ACTIONS['task-reminder'].length).toBeGreaterThan(0);
    });

    it('has default actions fallback', () => {
      expect(NOTIFICATION_ACTIONS['default']).toBeInstanceOf(Array);
    });

    it('each action has id and title', () => {
      for (const actions of Object.values(NOTIFICATION_ACTIONS)) {
        for (const action of actions) {
          expect(action.id).toBeTruthy();
          expect(action.title).toBeTruthy();
        }
      }
    });
  });

  describe('getChannelForTier', () => {
    it('returns core channel for core tier', () => {
      expect(getChannelForTier('core')).toBe('heka_core');
    });

    it('returns standard channel for standard tier', () => {
      expect(getChannelForTier('standard')).toBe('heka_standard');
    });

    it('returns ambient channel for ambient tier', () => {
      expect(getChannelForTier('ambient')).toBe('heka_ambient');
    });

    it('defaults to standard for unknown tier', () => {
      expect(getChannelForTier('unknown' as any)).toBe('heka_standard');
    });
  });

  describe('getChannelForCelebration', () => {
    it('returns celebration channel', () => {
      expect(getChannelForCelebration()).toBe('heka_celebration');
    });
  });

  describe('getActionsForType', () => {
    it('returns actions for known type', () => {
      const actions = getActionsForType('task-reminder');
      expect(actions).toBeInstanceOf(Array);
      expect(actions.length).toBeGreaterThan(0);
    });

    it('returns default actions for unknown type', () => {
      const actions = getActionsForType('nonexistent');
      expect(actions).toBe(NOTIFICATION_ACTIONS['default']);
    });

    it('returns actions with ids and titles', () => {
      const actions = getActionsForType('daily-briefing');
      expect(actions.every(a => a.id && a.title)).toBe(true);
    });
  });
});
