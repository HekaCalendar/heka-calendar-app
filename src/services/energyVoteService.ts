/**
 * Energy Voting Service
 * Allows users to vote on daily energy levels (1-10)
 * Votes aggregate to show community energy readings
 * Syncs to Firebase for global aggregation when authenticated
 */

import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, getCurrentUser, isFirebaseConfigured } from './firebase';

export interface EnergyVote {
  date: string; // ISO date string YYYY-MM-DD
  rating: number; // 1-10
  timestamp: number;
  timezone: string;
  deviceId: string;
  userId?: string;
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
const DEVICE_ID_KEY = 'heka-energy-device-id';
const VOTING_DEADLINE_HOUR = 19; // 7:30 PM
const VOTING_DEADLINE_MINUTE = 30;

/**
 * Get or create a persistent device ID for energy voting.
 * This provides basic identity without requiring authentication.
 */
function getDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

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
 * Check if a given civil date is today (timezone-safe)
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: tz }));
  const dateLocal = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return dateLocal.getDate() === nowLocal.getDate() &&
         dateLocal.getMonth() === nowLocal.getMonth() &&
         dateLocal.getFullYear() === nowLocal.getFullYear();
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
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIREBASE SYNC
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Sync a vote to Firebase Firestore for global aggregation.
 * Each device writes its own document: energyVotes/{date}_{deviceId}
 * This avoids concurrency conflicts.
 */
async function syncVoteToFirebase(vote: EnergyVote): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  
  const user = await getCurrentUser();
  if (!user) return; // Firebase rules require auth for writes
  
  try {
    const docId = `${vote.date}_${vote.deviceId}`;
    const voteRef = doc(db, 'energyVotes', docId);
    await setDoc(voteRef, {
      ...vote,
      userId: user.uid,
      _syncedAt: serverTimestamp(),
    });
  } catch {
    // Silent fail — localStorage is the source of truth
  }
}

/**
 * Subscribe to community energy votes for a specific date.
 * Returns real-time updates from Firestore.
 */
export function subscribeToCommunityEnergy(
  date: Date,
  callback: (result: DailyEnergyResult) => void
): Unsubscribe | null {
  if (!isFirebaseConfigured() || !db) {
    // Fallback to localStorage
    callback(getDailyEnergyResult(date));
    return null;
  }
  
  const dateKey = getDateKey(date);
  const deviceId = getDeviceId();
  const deadline = getVotingOpens(date);
  
  const q = query(
    collection(db, 'energyVotes'),
    where('date', '==', dateKey)
  );
  
  return onSnapshot(q, (snapshot) => {
    const votes: EnergyVote[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() as EnergyVote;
      votes.push(data);
    });
    
    const totalVotes = votes.length;
    const averageRating = totalVotes > 0
      ? votes.reduce((sum, v) => sum + v.rating, 0) / totalVotes
      : null;
    
    const userVote = votes.find(v => v.deviceId === deviceId)?.rating;
    
    callback({
      date: dateKey,
      averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
      totalVotes,
      userVote,
      votingOpen: isVotingOpen(date),
      votingClosesAt: deadline.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      resultsAvailableAt: new Date(deadline.getTime() + 86400000).toLocaleDateString(),
    });
  }, () => {
    // On error, fallback to localStorage
    callback(getDailyEnergyResult(date));
  });
}

/**
 * Fetch community energy results once from Firebase.
 * Falls back to localStorage if Firebase is unavailable.
 */
export async function fetchCommunityEnergy(date: Date = new Date()): Promise<DailyEnergyResult> {
  if (!isFirebaseConfigured() || !db) {
    return getDailyEnergyResult(date);
  }
  
  const dateKey = getDateKey(date);
  const deviceId = getDeviceId();
  const deadline = getVotingOpens(date);
  
  try {
    const { getDocs } = await import('firebase/firestore');
    const q = query(
      collection(db, 'energyVotes'),
      where('date', '==', dateKey)
    );
    const snapshot = await getDocs(q);
    
    const votes: EnergyVote[] = [];
    snapshot.forEach((docSnap) => {
      votes.push(docSnap.data() as EnergyVote);
    });
    
    const totalVotes = votes.length;
    const averageRating = totalVotes > 0
      ? votes.reduce((sum, v) => sum + v.rating, 0) / totalVotes
      : null;
    
    const userVote = votes.find(v => v.deviceId === deviceId)?.rating;
    
    return {
      date: dateKey,
      averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
      totalVotes,
      userVote,
      votingOpen: isVotingOpen(date),
      votingClosesAt: deadline.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      resultsAvailableAt: new Date(deadline.getTime() + 86400000).toLocaleDateString(),
    };
  } catch {
    return getDailyEnergyResult(date);
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL VOTE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Cast a vote for today's energy.
 * Saves to localStorage immediately, syncs to Firebase in the background.
 */
export function castVote(rating: number, date: Date = new Date()): boolean {
  if (rating < 1 || rating > 10) {
    return false;
  }
  
  if (!isVotingOpen(date)) {
    return false;
  }
  
  const dateKey = getDateKey(date);
  const votes = loadVotes();
  
  if (!votes[dateKey]) {
    votes[dateKey] = [];
  }
  
  // Check if this device already voted today
  const deviceId = getDeviceId();
  const existingVoteIndex = votes[dateKey].findIndex(v => v.deviceId === deviceId);
  
  const vote: EnergyVote = {
    date: dateKey,
    rating,
    timestamp: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    deviceId,
  };
  
  if (existingVoteIndex >= 0) {
    votes[dateKey][existingVoteIndex] = vote;
  } else {
    votes[dateKey].push(vote);
  }
  
  saveVotes(votes);
  
  // Sync to Firebase in the background (non-blocking)
  syncVoteToFirebase(vote).catch(() => {
    // Silent fail — localStorage is source of truth
  });
  
  return true;
}

/**
 * Get energy results for a specific date from localStorage.
 * This is the fallback when Firebase is unavailable.
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
    : null;
  
  // Check if current device voted
  const deviceId = getDeviceId();
  const userVote = dayVotes.find(v => v.deviceId === deviceId)?.rating;
  
  return {
    date: dateKey,
    averageRating: averageRating !== null ? Math.round(averageRating * 10) / 10 : null,
    totalVotes,
    userVote,
    votingOpen: isVotingOpen(date),
    votingClosesAt: deadline.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
    resultsAvailableAt: new Date(deadline.getTime() + 86400000).toLocaleDateString(),
  };
}

/**
 * Get energy level description
 */
export function getEnergyLevelDescription(rating: number): { label: string; color: string; emoji: string } {
  if (rating >= 9) return { label: 'voting.level.extremelyHigh', color: '#ef4444', emoji: '🔥' };
  if (rating >= 7) return { label: 'voting.level.high', color: '#f97316', emoji: '⚡' };
  if (rating >= 5) return { label: 'voting.level.moderate', color: '#eab308', emoji: '✨' };
  if (rating >= 3) return { label: 'voting.level.low', color: '#22c55e', emoji: '🌿' };
  return { label: 'voting.level.veryLow', color: '#3b82f6', emoji: '💧' };
}

/**
 * Get guidance based on community energy
 */
export function getCommunityGuidance(averageRating: number): string {
  if (averageRating >= 8) return 'voting.guidance.extremelyHigh';
  if (averageRating >= 6) return 'voting.guidance.high';
  if (averageRating >= 4) return 'voting.guidance.moderate';
  if (averageRating >= 2) return 'voting.guidance.low';
  return 'voting.guidance.veryLow';
}
