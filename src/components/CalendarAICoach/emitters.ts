/**
 * Event Emitters — Extracted from CalendarAICoach
 * Thin wrappers around eventBus for coach-initiated navigation and actions.
 */

import { eventBus } from '../../services/eventBus';
import { aiConfigService } from '../../services/aiConfigService';
import { civilToHeka } from '../../services/calendarService';
import type { HekaDate } from '../../types';

export function emitSelectDate(date: HekaDate | null) {
  const heka = date || civilToHeka(new Date());
  if (heka) {
    eventBus.emit('heka-select-date', heka);
  }
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitAddNote(date: HekaDate | null) {
  const heka = date || civilToHeka(new Date());
  if (heka) {
    eventBus.emit('heka-select-date', { ...heka, createNote: true });
  }
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitCreateTask(date: HekaDate | null, suggested?: string) {
  const heka = date || civilToHeka(new Date());
  if (heka) {
    eventBus.emit('heka-select-date', suggested ? { ...heka, createTask: true, suggestedTask: suggested } : { ...heka, createTask: true });
  }
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitJournal(prompt?: string) {
  eventBus.emit('heka-open-journal', prompt ? { prompt } : {});
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitNavigateToStars(tab?: string) {
  eventBus.emit('navigate-to-stars', tab ? { tab } : {});
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitTogglePureMode() {
  eventBus.emit('heka-toggle-pure-mode', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitOpenSearch() {
  eventBus.emit('heka-open-search', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitOpenStats() {
  eventBus.emit('heka-open-stats', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitOpenCircle() {
  eventBus.emit('heka-open-circle', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitOpenCommunity() {
  eventBus.emit('heka-open-community', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}

export function emitOpenYear() {
  eventBus.emit('heka-open-year', undefined);
  aiConfigService.setUserContext({ lastCoachInteraction: Date.now() });
}
