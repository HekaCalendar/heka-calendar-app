/**
 * Energy Voting Service
 * Allows users to vote on daily energy levels (1-10)
 * Votes aggregate to show community energy readings
 */

export interface EnergyVote {
  date: string; // ISO date string YYYY-MM-DD
  rating: number; // 1-10
  timestamp: number;
  timezone: string;
}

export interface DailyEnergyResult {
  date: string;
  averageRating: number | null;  // null when no votes recorded
  totalVotes: number;
  userVote?: number;
  votingOpen: boolean;
  votingClosesAt: string;
  resultsAvailableAt: string;
}

const VOTE_KEY = 'heka-energy-votes';
const VOTING_DEADLINE_HOUR = 19; // 7:30 PM
const VOTING_DEADLINE_MINUTE = 30;

/**
 * Get the voting opening time (7:30 PM today)
 */
function getVotingOpens(date: Date = new Date()): Date {
  const opens = new Date(date);
  opens.setHours(VOTING_DEADLINE_HOUR, VOTING_DEADLINE_MINUTE, 0, 0);
  return opens;
}

/**
 * Check if voting is currently open for a date
 * Voting opens at 7:30 PM and continues until midnight
 */
export function isVotingOpen(date: Date = new Date()): boolean {
  const now = new Date();
  const opens = getVotingOpens(date);
  const midnight = new Date(date);
  midnight.setHours(23, 59, 59, 999);
  
  // Can vote from 7:30 PM until midnight
  return now >= opens && now <= midnight;
}

/**
 * Check if it's currently after 7:30 PM local time
 * Used to determine if energy vote card should be displayed
 */
export function isAfterVotingTime(): boolean {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // After 7:30 PM (19:30)
  return hours > 19 || (hours === 19 && minutes >= 30);
}

/**
 * Check if a given civil date is today
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  return date.getDate() === now.getDate() &&
         date.getMonth() === now.getMonth() &&
         date.getFullYear() === now.getFullYear();
}

/**
 * Get date key for storage
 */
function getDateKey(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Load all votes from localStorage
 */
function loadVotes(): Record<string, EnergyVote[]> {
  try {
    const stored = localStorage.getItem(VOTE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * Save votes to localStorage
 */
function saveVotes(votes: Record<string, EnergyVote[]>): boolean {
  try {
    localStorage.setItem(VOTE_KEY, JSON.stringify(votes));
    return true;
  } catch (e) {
    console.warn('[EnergyVote] Failed to save votes:', e);
    return false;
  }
}

/**
 * Cast a vote for today's energy
 */
export function castVote(rating: number, date: Date = new Date()): boolean {
  if (rating < 1 || rating > 10) {
    console.error('Rating must be between 1 and 10');
    return false;
  }
  
  if (!isVotingOpen(date)) {
    console.error('Voting is closed for today');
    return false;
  }
  
  const dateKey = getDateKey(date);
  const votes = loadVotes();
  
  if (!votes[dateKey]) {
    votes[dateKey] = [];
  }
  
  // Check if user already voted
  const existingVoteIndex = votes[dateKey].findIndex(v => v.timestamp > Date.now() - 86400000);
  
  const vote: EnergyVote = {
    date: dateKey,
    rating,
    timestamp: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  
  if (existingVoteIndex >= 0) {
    votes[dateKey][existingVoteIndex] = vote;
  } else {
    votes[dateKey].push(vote);
  }
  
  saveVotes(votes);
  
  // TODO: Sync to Firebase for global aggregation
  // For now, localStorage serves as the data store
  
  return true;
}

/**
 * Get energy results for a specific date
 */
export function getDailyEnergyResult(date: Date = new Date()): DailyEnergyResult {
  const dateKey = getDateKey(date);
  const votes = loadVotes();
  const dayVotes = votes[dateKey] || [];
  
  const deadline = getVotingOpens(date);
  
  // Calculate average
  const totalVotes = dayVotes.length;
  const averageRating = totalVotes > 0
    ? dayVotes.reduce((sum, v) => sum + v.rating, 0) / totalVotes
    : null;  // null means no votes recorded
  
  // Check if current user voted
  const userVote = dayVotes.find(v => v.timestamp > Date.now() - 86400000)?.rating;
  
  return {
    date: dateKey,
    averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
    totalVotes,
    userVote,
    votingOpen: isVotingOpen(date),
    votingClosesAt: deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    resultsAvailableAt: new Date(deadline.getTime() + 86400000).toLocaleDateString(),
  };
}

/**
 * Get energy level description
 */
export function getEnergyLevelDescription(rating: number): { label: string; color: string; emoji: string } {
  if (rating >= 9) return { label: 'Extremely High', color: '#ef4444', emoji: '🔥' };
  if (rating >= 7) return { label: 'High', color: '#f97316', emoji: '⚡' };
  if (rating >= 5) return { label: 'Moderate', color: '#eab308', emoji: '✨' };
  if (rating >= 3) return { label: 'Low', color: '#22c55e', emoji: '🌿' };
  return { label: 'Very Low', color: '#3b82f6', emoji: '💧' };
}

/**
 * Get guidance based on community energy
 */
export function getCommunityGuidance(averageRating: number): string {
  if (averageRating >= 8) {
    return 'The community is experiencing very high energy. Great day for collective action, social gatherings, and ambitious projects.';
  }
  if (averageRating >= 6) {
    return 'The community reports elevated energy. Good time for collaboration, creative work, and active pursuits.';
  }
  if (averageRating >= 4) {
    return 'Moderate community energy today. Balanced activities, routine work, and steady progress are favored.';
  }
  if (averageRating >= 2) {
    return 'The community is reporting lower energy. Focus on rest, reflection, and gentle activities today.';
  }
  return 'Very low community energy detected. Prioritize self-care, minimal tasks, and restorative practices.';
}

/**
 * Get mock aggregated data for demonstration
 * In production, this would come from Firebase
 */
export function getMockCommunityData(date: Date = new Date()): DailyEnergyResult {
  const dateKey = getDateKey(date);
  
  // Generate consistent mock data based on date
  const dateNum = date.getDate() + date.getMonth() * 31;
  const mockAverage = ((dateNum % 7) + 3); // 3-9 range
  const mockVotes = 100 + (dateNum % 50);
  
  const deadline = getVotingOpens(date);
  const now = new Date();
  
  return {
    date: dateKey,
    averageRating: mockAverage,
    totalVotes: mockVotes,
    votingOpen: now < deadline,
    votingClosesAt: deadline.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    resultsAvailableAt: new Date(deadline.getTime() + 86400000).toLocaleDateString(),
  };
}
