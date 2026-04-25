/**
 * Content Reducers
 * Notes CRUD, statistics, community holidays/features, invites, calendar subscriptions
 */

import type { PayloadAction } from '@reduxjs/toolkit';
import type { CalendarState, NoteData, NoteCategory, DayNotes, RecurringConfig } from '../../../types';
import type { UsageStatistics, CommunityHoliday, CommunityFeature, CalendarInvite } from '../../../types';

// ─── Statistics Helpers ───

function updateStatisticsOnNoteAdd(
  stats: UsageStatistics,
  note: NoteData,
  isFirstNoteOfDay: boolean
): UsageStatistics {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

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
    const today = new Date();
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

  let newMoodAverage = stats.moodAverage;
  if (note.mood) {
    const totalMoodEntries = Object.values(stats.notesByCategory).reduce((a, b) => a + b, 0);
    newMoodAverage = ((stats.moodAverage * totalMoodEntries) + note.mood) / (totalMoodEntries + 1);
  }

  const newMoodByMonth = { ...stats.moodByMonth };
  if (note.mood) {
    const monthMoodTotal = (stats.moodByMonth[monthKey] || 0) * (stats.notesByMonth[monthKey] || 0);
    const monthCount = (stats.notesByMonth[monthKey] || 0) + 1;
    newMoodByMonth[monthKey] = (monthMoodTotal + note.mood) / monthCount;
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

  const notesByMonth: Record<string, number> = {};
  for (const note of allNotes) {
    const d = new Date(note.createdAt);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    notesByMonth[monthKey] = (notesByMonth[monthKey] || 0) + 1;
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
    currentStreak = run;
  }

  const notesWithMood = allNotes.filter((n) => n.mood != null);
  const moodSum = notesWithMood.reduce((sum, n) => sum + (n.mood || 0), 0);
  const moodAverage = notesWithMood.length > 0 ? Math.round((moodSum / notesWithMood.length) * 10) / 10 : 0;

  const moodByMonth: Record<string, number> = {};
  const monthMoodTotals: Record<string, { sum: number; count: number }> = {};
  for (const note of notesWithMood) {
    const d = new Date(note.createdAt);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!monthMoodTotals[monthKey]) monthMoodTotals[monthKey] = { sum: 0, count: 0 };
    monthMoodTotals[monthKey].sum += note.mood || 0;
    monthMoodTotals[monthKey].count++;
  }
  for (const [monthKey, { sum, count }] of Object.entries(monthMoodTotals)) {
    moodByMonth[monthKey] = Math.round((sum / count) * 10) / 10;
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
  const now = new Date().toISOString();
  const noteData: NoteData = {
    id: `${action.payload.key}-${Date.now()}`,
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
  state.statistics = updateStatisticsOnNoteAdd(state.statistics, noteData, isFirstNoteOfDay);
};

export const updateNote = (state: CalendarState, action: PayloadAction<{ dayKey: string; noteId: string; updates: { content: string; category?: NoteCategory; recurring?: RecurringConfig } }>) => {
  const { dayKey, noteId, updates } = action.payload;
  if (state.notes[dayKey]) {
    const note = state.notes[dayKey].find(n => n.id === noteId);
    if (note) {
      note.content = updates.content;
      if (updates.category) note.category = updates.category;
      if (updates.recurring !== undefined) note.recurring = updates.recurring;
      note.updatedAt = new Date().toISOString();
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
  if (state.notes[fromKey]) {
    const noteIndex = state.notes[fromKey].findIndex(n => n.id === noteId);
    if (noteIndex >= 0) {
      const [note] = state.notes[fromKey].splice(noteIndex, 1);
      note.updatedAt = new Date().toISOString();

      if (!state.notes[toKey]) {
        state.notes[toKey] = [];
      }
      state.notes[toKey].push(note);

      if (state.notes[fromKey].length === 0) {
        delete state.notes[fromKey];
      }
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
    moodAverage: 0,
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
