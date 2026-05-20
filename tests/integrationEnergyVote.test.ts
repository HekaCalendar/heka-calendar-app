import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  castVote,
  getDailyEnergyResult,
  getEnergyLevelDescription,
  getCommunityGuidance,
  isVotingOpen,
  isAfterVotingTime,
} from '../src/services/energyVoteService';

describe('integration: energy voting end-to-end', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('full voting flow: cast → result → description → guidance', () => {
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));

    // Cast a vote
    const voteResult = castVote(8);
    expect(voteResult).toBe(true);

    // Get daily result
    const result = getDailyEnergyResult(new Date('2024-06-15'));
    expect(result.totalVotes).toBe(1);
    expect(result.averageRating).toBe(8);
    expect(result.userVote).toBe(8);

    // Get description for the rating
    const desc = getEnergyLevelDescription(result.userVote!);
    expect(desc.emoji).toBe('⚡');
    expect(desc.label).toContain('voting.level.high');

    // Get community guidance — rating 8 triggers extremelyHigh (>=8)
    const guidance = getCommunityGuidance(result.averageRating!);
    expect(guidance).toBe('voting.guidance.extremelyHigh');
  });

  it('multiple votes produce averaged result', () => {
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));

    // Simulate two devices voting by manipulating localStorage
    const votes = {
      '2024-06-15': [
        { date: '2024-06-15', rating: 6, timestamp: Date.now(), timezone: 'UTC', deviceId: 'dev_a' },
        { date: '2024-06-15', rating: 8, timestamp: Date.now(), timezone: 'UTC', deviceId: 'dev_b' },
      ]
    };
    localStorage.setItem('heka-energy-votes', JSON.stringify(votes));

    const result = getDailyEnergyResult(new Date('2024-06-15'));
    expect(result.totalVotes).toBe(2);
    expect(result.averageRating).toBe(7);

    const desc = getEnergyLevelDescription(result.averageRating!);
    expect(desc.emoji).toBe('⚡');
  });

  it('voting window gates castVote but not result retrieval', () => {
    // Morning — voting closed
    vi.setSystemTime(new Date('2024-06-15T10:00:00'));
    expect(isVotingOpen()).toBe(false);
    expect(castVote(5)).toBe(false);

    // But we can still get results
    const result = getDailyEnergyResult(new Date('2024-06-15'));
    expect(result).toBeDefined();
    expect(result.votingOpen).toBe(false);

    // Evening — voting open
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));
    expect(isVotingOpen()).toBe(true);
    expect(castVote(5)).toBe(true);
  });

  it('afterVotingTime matches votingOpen in evening', () => {
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));
    expect(isAfterVotingTime()).toBe(true);
    expect(isVotingOpen()).toBe(true);
  });

  it('energy descriptions map to guidance keys consistently', () => {
    const testCases = [
      { rating: 10, emoji: '🔥', guidance: 'voting.guidance.extremelyHigh' },
      { rating: 8, emoji: '⚡', guidance: 'voting.guidance.extremelyHigh' },
      { rating: 6, emoji: '✨', guidance: 'voting.guidance.high' },
      { rating: 5, emoji: '✨', guidance: 'voting.guidance.moderate' },
      { rating: 3, emoji: '🌿', guidance: 'voting.guidance.low' },
      { rating: 1, emoji: '💧', guidance: 'voting.guidance.veryLow' },
    ];

    for (const tc of testCases) {
      const desc = getEnergyLevelDescription(tc.rating);
      const guidance = getCommunityGuidance(tc.rating);
      expect(desc.emoji).toBe(tc.emoji);
      expect(guidance).toBe(tc.guidance);
    }
  });

  it('vote update replaces previous vote from same device', () => {
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));

    castVote(5);
    castVote(9);

    const result = getDailyEnergyResult(new Date('2024-06-15'));
    expect(result.totalVotes).toBe(1);
    expect(result.averageRating).toBe(9);
  });

  it('empty result returns null average and no description', () => {
    vi.setSystemTime(new Date('2024-06-15T20:00:00'));
    const result = getDailyEnergyResult(new Date('2024-06-15'));
    expect(result.averageRating).toBeNull();
    expect(result.userVote).toBeUndefined();
    expect(result.totalVotes).toBe(0);
  });
});
