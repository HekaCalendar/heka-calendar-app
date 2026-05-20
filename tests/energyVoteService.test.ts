import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isVotingOpen,
  isAfterVotingTime,
  isToday,
  castVote,
  getDailyEnergyResult,
  getEnergyLevelDescription,
  getCommunityGuidance,
  fetchCommunityEnergy,
  subscribeToCommunityEnergy,
} from '../src/services/energyVoteService';

const VOTE_KEY = 'heka-energy-votes';
const DEVICE_ID_KEY = 'heka-energy-device-id';

describe('energyVoteService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isVotingOpen', () => {
    it('returns true at 8 PM', () => {
      const date = new Date('2024-06-15T20:00:00');
      vi.setSystemTime(date);
      expect(isVotingOpen(date)).toBe(true);
    });

    it('returns true at exactly 7:30 PM', () => {
      const date = new Date('2024-06-15T19:30:00');
      vi.setSystemTime(date);
      expect(isVotingOpen(date)).toBe(true);
    });

    it('returns false at 6 PM', () => {
      const date = new Date('2024-06-15T18:00:00');
      vi.setSystemTime(date);
      expect(isVotingOpen(date)).toBe(false);
    });

    it('returns false after midnight', () => {
      const date = new Date('2024-06-15T00:30:00');
      vi.setSystemTime(date);
      expect(isVotingOpen(date)).toBe(false);
    });
  });

  describe('isAfterVotingTime', () => {
    it('returns true at 8 PM', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      expect(isAfterVotingTime()).toBe(true);
    });

    it('returns true at exactly 7:30 PM', () => {
      vi.setSystemTime(new Date('2024-06-15T19:30:00'));
      expect(isAfterVotingTime()).toBe(true);
    });

    it('returns false at 7:29 PM', () => {
      vi.setSystemTime(new Date('2024-06-15T19:29:00'));
      expect(isAfterVotingTime()).toBe(false);
    });

    it('returns false at noon', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      expect(isAfterVotingTime()).toBe(false);
    });
  });

  describe('isToday', () => {
    it('returns true for current date', () => {
      const now = new Date();
      expect(isToday(now)).toBe(true);
    });

    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('castVote', () => {
    it('returns false for rating below 1', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      expect(castVote(0)).toBe(false);
    });

    it('returns false for rating above 10', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      expect(castVote(11)).toBe(false);
    });

    it('returns false when voting is closed', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      expect(castVote(5)).toBe(false);
    });

    it('saves vote to localStorage when voting is open', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      const result = castVote(7);
      expect(result).toBe(true);
      const stored = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');
      expect(stored['2024-06-15']).toBeInstanceOf(Array);
      expect(stored['2024-06-15']).toHaveLength(1);
      expect(stored['2024-06-15'][0].rating).toBe(7);
    });

    it('updates existing vote instead of duplicating', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      castVote(5);
      castVote(8);
      const stored = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');
      expect(stored['2024-06-15']).toHaveLength(1);
      expect(stored['2024-06-15'][0].rating).toBe(8);
    });

    it('stores deviceId with vote', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      castVote(6);
      const stored = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');
      expect(stored['2024-06-15'][0].deviceId).toBeTruthy();
      expect(typeof stored['2024-06-15'][0].deviceId).toBe('string');
    });

    it('stores timezone with vote', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      castVote(6);
      const stored = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');
      expect(stored['2024-06-15'][0].timezone).toBeTruthy();
    });
  });

  describe('getDailyEnergyResult', () => {
    it('returns empty result when no votes', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(result.date).toBe('2024-06-15');
      expect(result.totalVotes).toBe(0);
      expect(result.averageRating).toBeNull();
      expect(result.userVote).toBeUndefined();
    });

    it('calculates average correctly', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      castVote(6);
      // Simulate another device voting by manipulating localStorage directly
      const stored = JSON.parse(localStorage.getItem(VOTE_KEY) || '{}');
      stored['2024-06-15'].push({
        date: '2024-06-15',
        rating: 8,
        timestamp: Date.now(),
        timezone: 'UTC',
        deviceId: 'other_device',
      });
      localStorage.setItem(VOTE_KEY, JSON.stringify(stored));

      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(result.totalVotes).toBe(2);
      expect(result.averageRating).toBe(7);
    });

    it('includes userVote for current device', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      castVote(9);
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(result.userVote).toBe(9);
    });

    it('reports voting open status', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(result.votingOpen).toBe(true);
    });

    it('reports voting closed status', () => {
      vi.setSystemTime(new Date('2024-06-15T12:00:00'));
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(result.votingOpen).toBe(false);
    });

    it('includes votingClosesAt time string', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(typeof result.votingClosesAt).toBe('string');
      expect(result.votingClosesAt.length).toBeGreaterThan(0);
    });

    it('includes resultsAvailableAt date string', () => {
      vi.setSystemTime(new Date('2024-06-15T20:00:00'));
      const result = getDailyEnergyResult(new Date('2024-06-15'));
      expect(typeof result.resultsAvailableAt).toBe('string');
      expect(result.resultsAvailableAt.length).toBeGreaterThan(0);
    });
  });

  describe('getEnergyLevelDescription', () => {
    it('returns extremely high for 9-10', () => {
      expect(getEnergyLevelDescription(10).emoji).toBe('🔥');
      expect(getEnergyLevelDescription(9).emoji).toBe('🔥');
    });

    it('returns high for 7-8', () => {
      expect(getEnergyLevelDescription(8).emoji).toBe('⚡');
      expect(getEnergyLevelDescription(7).emoji).toBe('⚡');
    });

    it('returns moderate for 5-6', () => {
      expect(getEnergyLevelDescription(6).emoji).toBe('✨');
      expect(getEnergyLevelDescription(5).emoji).toBe('✨');
    });

    it('returns low for 3-4', () => {
      expect(getEnergyLevelDescription(4).emoji).toBe('🌿');
      expect(getEnergyLevelDescription(3).emoji).toBe('🌿');
    });

    it('returns very low for 1-2', () => {
      expect(getEnergyLevelDescription(2).emoji).toBe('💧');
      expect(getEnergyLevelDescription(1).emoji).toBe('💧');
    });

    it('returns i18n label keys', () => {
      expect(getEnergyLevelDescription(5).label).toContain('voting.level');
    });
  });

  describe('getCommunityGuidance', () => {
    it('returns guidance for extremely high energy', () => {
      expect(getCommunityGuidance(8)).toBe('voting.guidance.extremelyHigh');
      expect(getCommunityGuidance(10)).toBe('voting.guidance.extremelyHigh');
    });

    it('returns guidance for high energy', () => {
      expect(getCommunityGuidance(6)).toBe('voting.guidance.high');
      expect(getCommunityGuidance(7.5)).toBe('voting.guidance.high');
    });

    it('returns guidance for moderate energy', () => {
      expect(getCommunityGuidance(4)).toBe('voting.guidance.moderate');
      expect(getCommunityGuidance(5)).toBe('voting.guidance.moderate');
    });

    it('returns guidance for low energy', () => {
      expect(getCommunityGuidance(2)).toBe('voting.guidance.low');
      expect(getCommunityGuidance(3)).toBe('voting.guidance.low');
    });

    it('returns guidance for very low energy', () => {
      expect(getCommunityGuidance(0)).toBe('voting.guidance.veryLow');
      expect(getCommunityGuidance(1)).toBe('voting.guidance.veryLow');
    });
  });

  describe('fetchCommunityEnergy', () => {
    it('falls back to localStorage when Firebase unavailable', async () => {
      const result = await fetchCommunityEnergy(new Date('2024-06-15'));
      expect(result.date).toBe('2024-06-15');
      expect(result.totalVotes).toBe(0);
    });
  });

  describe('subscribeToCommunityEnergy', () => {
    it('returns an unsubscribe function when Firebase is mocked', () => {
      const callback = vi.fn();
      const unsub = subscribeToCommunityEnergy(new Date('2024-06-15'), callback);
      expect(typeof unsub).toBe('function');
    });
  });
});
