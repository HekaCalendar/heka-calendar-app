/**
 * Content Reducers
 * Notes CRUD, statistics, community holidays/features, invites, calendar subscriptions
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { CalendarState, NoteData, NoteCategory, DayNotes, RecurringConfig } from '../../../types';
import type { UsageStatistics, CommunityHoliday, CommunityFeature, CalendarInvite } from '../../../types';

interface ActionWithTimestamp {
  meta?: { timestamp?: number };
}

// ─── Statistics Helpers ───

function updateStatisticsOnNoteAdd(
  stats: UsageStatistics,
  note: NoteData,
  isFirstNoteOfDay: boolean,
  dayKey: string,
  timestamp?: number
): UsageStatistics {
  // Derive month from the note's dayKey (e.g. "2026-04-15" → "2026-04"), not current real time
  const dayDate = new Date(dayKey + 'T00:00:00');
  const monthKey = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}`;
  const now = timestamp ? new Date(timestamp) : new Date();

  const newTotalNotes = stats.totalNotes + 1;
  const newNotesByCategory = {
    ...stats.notesByCategory,
    [note.category]: (stats.notesByCategory[note.category] || 0) + 1,
  };
  const newNotesByMonth = {
    ...stats.notesByMonth,
    [monthKey]: (stats.notesByMonth[monthKey] || 0) + 1,
  };

  let newCurrentStreak = stats.currentStreak;
  let newLongestStreak = stats.longestStreak;
  let newLastNoteDate = stats.lastNoteDate;

  if (isFirstNoteOfDay) {
    const lastNoteDate = stats.lastNoteDate ? new Date(stats.lastNoteDate) : null;
    const today = timestamp ? new Date(timestamp) : new Date();
    today.setHours(0, 0, 0, 0);

    if (lastNoteDate) {
      const lastDate = new Date(lastNoteDate);
      lastDate.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newCurrentStreak = stats.currentStreak + 1;
      } else if (diffDays > 1) {
        newCurrentStreak = 1;
      }

      if (newCurrentStreak > stats.longestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    } else {
      newCurrentStreak = 1;
      newLongestStreak = 1;
    }
    newLastNoteDate = now.toISOString();
  }

  // Mood tracking — use moodEntryCount for correct weighted average
  let newMoodAverage = stats.moodAverage;
  let newMoodEntryCount = stats.moodEntryCount;
  const newMoodByMonth = { ...stats.moodByMonth };
  const newMoodEntriesByMonth = { ...stats.moodEntriesByMonth };

  if (note.mood) {
    newMoodEntryCount = stats.moodEntryCount + 1;
    newMoodAverage = ((stats.moodAverage * stats.moodEntryCount) + note.mood) / newMoodEntryCount;

    const prevMonthMoodCount = stats.moodEntriesByMonth[monthKey] || 0;
    const prevMonthMoodAvg = stats.moodByMonth[monthKey] || 0;
    newMoodEntriesByMonth[monthKey] = prevMonthMoodCount + 1;
    newMoodByMonth[monthKey] = ((prevMonthMoodAvg * prevMonthMoodCount) + note.mood) / (prevMonthMoodCount + 1);
  }

  const wordCount = note.content.trim().split(/\s+/).filter(w => w.length > 0).length;
  const newTotalWords = stats.totalWords + wordCount;

  const mostActiveEntry = Object.entries(newNotesByMonth).sort((a, b) => b[1] - a[1])[0];
  const newMostActiveMonth = mostActiveEntry
    ? { month: mostActiveEntry[0], count: mostActiveEntry[1] }
    : stats.mostActiveMonth;

  return {
    totalNotes: newTotalNotes,
    notesByCategory: newNotesByCategory,
    notesByMonth: newNotesByMonth,
    currentStreak: newCurrentStreak,
    longestStreak: newLongestStreak,
    lastNoteDate: newLastNoteDate,
    moodAverage: Math.round(newMoodAverage * 10) / 10,
    moodEntryCount: newMoodEntryCount,
    moodEntriesByMonth: newMoodEntriesByMonth,
    moodByMonth: newMoodByMonth,
    mostActiveMonth: newMostActiveMonth,
    totalWords: newTotalWords,
  };
}

function recomputeStatistics(notes: Record<string, NoteData[]>): UsageStatistics {
  const allNotes = Object.values(notes).flat();
  const totalNotes = allNotes.length;

  const notesByCategory: Record<string, number> = {};
  for (const note of allNotes) {
    notesByCategory[note.category] = (notesByCategory[note.category] || 0) + 1;
  }

  // Derive month keys from dayKey (calendar date), not createdAt (real time)
  const notesByMonth: Record<string, number> = {};
  for (const [dayKey, dayNotes] of Object.entries(notes)) {
    if (dayNotes.length === 0) continue;
    const d = new Date(dayKey + 'T00:00:00');
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    notesByMonth[monthKey] = (notesByMonth[monthKey] || 0) + dayNotes.length;
  }

  const daySet = new Set<string>();
  for (const [dayKey, dayNotes] of Object.entries(notes)) {
    if (dayNotes.length > 0) daySet.add(dayKey);
  }
  const sortedDays = Array.from(daySet).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let lastNoteDate: string | undefined;

  if (sortedDays.length > 0) {
    lastNoteDate = sortedDays[sortedDays.length - 1];
    let run = 1;
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      prev.setHours(0, 0, 0, 0);
      curr.setHours(0, 0, 0, 0);
      const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        run++;
      } else {
        longestStreak = Math.max(longestStreak, run);
        run = 1;
      }
    }
    longestStreak = Math.max(longestStreak, run);

    // Current streak: count backwards from last note day, but decay if gap > 1 day
    run = 1;
    for (let i = sortedDays.length - 1; i > 0; i--) {
      const prev = new Date(sortedDays[i - 1]);
      const curr = new Date(sortedDays[i]);
      prev.setHours(0, 0, 0, 0);
      curr.setHours(0, 0, 0, 0);
      const diff = Math.floor((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        run++;
      } else {
        break;
      }
    }
    // Decay: if last note wasn't today or yesterday, streak is 0
    const lastDay = new Date(lastNoteDate);
    lastDay.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysSinceLastNote = Math.floor((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));
    currentStreak = daysSinceLastNote > 1 ? 0 : run;
  }

  const notesWithMood = allNotes.filter((n) => n.mood != null);
  const moodSum = notesWithMood.reduce((sum, n) => sum + (n.mood || 0), 0);
  const moodAverage = notesWithMood.length > 0 ? Math.round((moodSum / notesWithMood.length) * 10) / 10 : 0;

  // Derive mood month keys from dayKey, not createdAt
  const moodByMonth: Record<string, number> = {};
  const moodEntriesByMonth: Record<string, number> = {};
  const monthMoodTotals: Record<string, { sum: number; count: number }> = {};
  for (const [dayKey, dayNotes] of Object.entries(notes)) {
    const d = new Date(dayKey + 'T00:00:00');
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    for (const note of dayNotes) {
      if (note.mood == null) continue;
      if (!monthMoodTotals[monthKey]) monthMoodTotals[monthKey] = { sum: 0, count: 0 };
      monthMoodTotals[monthKey].sum += note.mood;
      monthMoodTotals[monthKey].count++;
    }
  }
  for (const [monthKey, { sum, count }] of Object.entries(monthMoodTotals)) {
    moodByMonth[monthKey] = Math.round((sum / count) * 10) / 10;
    moodEntriesByMonth[monthKey] = count;
  }

  const totalWords = allNotes.reduce((sum, n) => {
    const words = n.content.trim().split(/\s+/).filter((w) => w.length > 0).length;
    return sum + words;
  }, 0);

  const mostActiveEntry = Object.entries(notesByMonth).sort((a, b) => b[1] - a[1])[0];
  const mostActiveMonth = mostActiveEntry
    ? { month: mostActiveEntry[0], count: mostActiveEntry[1] }
    : { month: '', count: 0 };

  return {
    totalNotes,
    notesByCategory: notesByCategory as Record<NoteCategory, number>,
    notesByMonth,
    currentStreak,
    longestStreak,
    lastNoteDate,
    moodAverage,
    moodEntryCount: notesWithMood.length,
    moodEntriesByMonth,
    moodByMonth,
    mostActiveMonth,
    totalWords,
  };
}

// ─── Notes Reducers ───

export const addNote = (state: CalendarState, action: PayloadAction<{
  key: string;
  content: string;
  category?: NoteCategory;
  mood?: 1 | 2 | 3 | 4 | 5;
  recurring?: RecurringConfig;
  duplicatedFrom?: string;
  tags?: string[];
}>) => {
  const timestamp = (action as ActionWithTimestamp).meta?.timestamp || Date.now();
  const now = new Date(timestamp).toISOString();
  const noteData: NoteData = {
    id: `${action.payload.key}-${timestamp}`,
    content: action.payload.content,
    category: action.payload.category || 'general',
    mood: action.payload.mood,
    recurring: action.payload.recurring,
    duplicatedFrom: action.payload.duplicatedFrom,
    tags: action.payload.tags,
    createdAt: now,
    updatedAt: now,
  };

  const isFirstNoteOfDay = !state.notes[action.payload.key] || state.notes[action.payload.key].length === 0;

  if (!state.notes[action.payload.key]) {
    state.notes[action.payload.key] = [];
  }

  state.notes[action.payload.key].push(noteData);
  state.statistics = updateStatisticsOnNoteAdd(state.statistics, noteData, isFirstNoteOfDay, action.payload.key, timestamp);
};

export const updateNote = (state: CalendarState, action: PayloadAction<{ dayKey: string; noteId: string; updates: { content: string; category?: NoteCategory; recurring?: RecurringConfig } }>) => {
  const { dayKey, noteId, updates } = action.payload;
  const timestamp = (action as ActionWithTimestamp).meta?.timestamp || Date.now();
  if (state.notes[dayKey]) {
    const note = state.notes[dayKey].find(n => n.id === noteId);
    if (note) {
      note.content = updates.content;
      if (updates.category) note.category = updates.category;
      if (updates.recurring !== undefined) note.recurring = updates.recurring;
      note.updatedAt = new Date(timestamp).toISOString();
    }
  }
  state.statistics = recomputeStatistics(state.notes);
};

export const deleteNote = (state: CalendarState, action: PayloadAction<{ dayKey: string; noteId: string }>) => {
  const { dayKey, noteId } = action.payload;
  if (state.notes[dayKey]) {
    state.notes[dayKey] = state.notes[dayKey].filter(n => n.id !== noteId);
    if (state.notes[dayKey].length === 0) {
      delete state.notes[dayKey];
    }
  }
  state.statistics = recomputeStatistics(state.notes);
};

export const deleteDuplicates = (state: CalendarState, action: PayloadAction<{ sourceNoteId: string }>) => {
  Object.keys(state.notes).forEach(dayKey => {
    state.notes[dayKey] = state.notes[dayKey].filter(n => n.duplicatedFrom !== action.payload.sourceNoteId);
    if (state.notes[dayKey].length === 0) {
      delete state.notes[dayKey];
    }
  });
  state.statistics = recomputeStatistics(state.notes);
};

export const loadNotes = (state: CalendarState, action: PayloadAction<Record<string, DayNotes>>) => {
  state.notes = action.payload;
  state.statistics = recomputeStatistics(state.notes);
};

export const moveNote = (state: CalendarState, action: PayloadAction<{ fromKey: string; toKey: string; noteId: string }>) => {
  const { fromKey, toKey, noteId } = action.payload;
  const timestamp = (action as ActionWithTimestamp).meta?.timestamp || Date.now();
  if (state.notes[fromKey]) {
    const noteIndex = state.notes[fromKey].findIndex(n => n.id === noteId);
    if (noteIndex >= 0) {
      const [note] = state.notes[fromKey].splice(noteIndex, 1);
      note.updatedAt = new Date(timestamp).toISOString();

      if (!state.notes[toKey]) {
        state.notes[toKey] = [];
      }
      state.notes[toKey].push(note);

      if (state.notes[fromKey].length === 0) {
        delete state.notes[fromKey];
      }

      state.statistics = recomputeStatistics(state.notes);
    }
  }
};

export const updateStatistics = (state: CalendarState, action: PayloadAction<Partial<UsageStatistics>>) => {
  state.statistics = { ...state.statistics, ...action.payload };
};

export const resetStatistics = (state: CalendarState) => {
  state.statistics = {
    totalNotes: 0,
    notesByCategory: { personal: 0, work: 0, spiritual: 0, family: 0, health: 0, creative: 0, general: 0 },
    notesByMonth: {},
    currentStreak: 0,
    longestStreak: 0,
    lastNoteDate: undefined,
    moodAverage: 0,
    moodEntryCount: 0,
    moodEntriesByMonth: {},
    moodByMonth: {},
    mostActiveMonth: { month: '', count: 0 },
    totalWords: 0,
  };
};

// ─── Community Reducers ───

export const setCommunityHolidays = (state: CalendarState, action: PayloadAction<CommunityHoliday[]>) => {
  state.communityHolidays = action.payload;
};

export const addCommunityHoliday = (state: CalendarState, action: PayloadAction<CommunityHoliday>) => {
  const exists = state.communityHolidays.find(h => h.id === action.payload.id);
  if (!exists) state.communityHolidays.push(action.payload);
};

export const updateCommunityHoliday = (state: CalendarState, action: PayloadAction<CommunityHoliday>) => {
  const idx = state.communityHolidays.findIndex(h => h.id === action.payload.id);
  if (idx !== -1) state.communityHolidays[idx] = action.payload;
};

export const voteForHoliday = (state: CalendarState, action: PayloadAction<string>) => {
  const holiday = state.communityHolidays.find(h => h.id === action.payload);
  if (holiday) {
    holiday.votesUp += 1;
  }
};

export const setCommunityFeatures = (state: CalendarState, action: PayloadAction<CommunityFeature[]>) => {
  state.communityFeatures = action.payload;
};

export const addCommunityFeature = (state: CalendarState, action: PayloadAction<CommunityFeature>) => {
  const exists = state.communityFeatures.find(f => f.id === action.payload.id);
  if (!exists) state.communityFeatures.push(action.payload);
};

export const updateCommunityFeature = (state: CalendarState, action: PayloadAction<CommunityFeature>) => {
  const idx = state.communityFeatures.findIndex(f => f.id === action.payload.id);
  if (idx !== -1) state.communityFeatures[idx] = action.payload;
};

export const voteForFeature = (state: CalendarState, action: PayloadAction<string>) => {
  const feature = state.communityFeatures.find(f => f.id === action.payload);
  if (feature) {
    feature.votes += 1;
  }
};

export const addInvite = (state: CalendarState, action: PayloadAction<CalendarInvite>) => {
  state.pendingInvites.push(action.payload);
};

export const respondToInvite = (state: CalendarState, action: PayloadAction<{ inviteId: string; accept: boolean }>) => {
  const invite = state.pendingInvites.find(i => i.id === action.payload.inviteId);
  if (invite) {
    invite.status = action.payload.accept ? 'accepted' : 'declined';
  }
};

export const subscribeToCalendar = (state: CalendarState, action: PayloadAction<string>) => {
  if (!state.subscribedCalendars.includes(action.payload)) {
    state.subscribedCalendars.push(action.payload);
  }
};

export const unsubscribeFromCalendar = (state: CalendarState, action: PayloadAction<string>) => {
  state.subscribedCalendars = state.subscribedCalendars.filter(id => id !== action.payload);
};
