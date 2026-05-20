import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eventBus } from '../../src/services/eventBus';
import { aiConfigService } from '../../src/services/aiConfigService';
import {
  emitSelectDate,
  emitAddNote,
  emitCreateTask,
  emitJournal,
  emitNavigateToStars,
  emitTogglePureMode,
  emitOpenSearch,
  emitOpenStats,
  emitOpenCircle,
  emitOpenCommunity,
  emitOpenYear,
} from '../../src/components/CalendarAICoach/emitters';

describe('CalendarAICoach emitters', () => {
  let emitSpy: ReturnType<typeof vi.spyOn>;
  let setContextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    emitSpy = vi.spyOn(eventBus, 'emit').mockImplementation(() => {});
    setContextSpy = vi.spyOn(aiConfigService, 'setUserContext').mockImplementation(() => {});
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each([
    { fn: emitSelectDate, event: 'heka-select-date' },
    { fn: emitAddNote, event: 'heka-select-date' },
    { fn: emitCreateTask, event: 'heka-select-date' },
    { fn: emitJournal, event: 'heka-open-journal' },
    { fn: emitNavigateToStars, event: 'navigate-to-stars' },
    { fn: emitTogglePureMode, event: 'heka-toggle-pure-mode' },
    { fn: emitOpenSearch, event: 'heka-open-search' },
    { fn: emitOpenStats, event: 'heka-open-stats' },
    { fn: emitOpenCircle, event: 'heka-open-circle' },
    { fn: emitOpenCommunity, event: 'heka-open-community' },
    { fn: emitOpenYear, event: 'heka-open-year' },
  ])('$fn.name emits "$event" and updates interaction timestamp', ({ fn, event }) => {
    fn({ year: 2024, month: 1, day: 1 } as any);
    expect(emitSpy).toHaveBeenCalledTimes(1);
    expect(emitSpy.mock.calls[0][0]).toBe(event);
    expect(setContextSpy).toHaveBeenCalledWith({ lastCoachInteraction: expect.any(Number) });
  });

  it('emitCreateTask includes suggested task when provided', () => {
    emitCreateTask({ year: 2024, month: 1, day: 1 } as any, 'Buy groceries');
    expect(emitSpy).toHaveBeenCalledWith('heka-select-date', expect.objectContaining({
      year: 2024, month: 1, day: 1, createTask: true, suggestedTask: 'Buy groceries',
    }));
  });

  it('emitJournal passes prompt when provided', () => {
    emitJournal('Reflect on today');
    expect(emitSpy).toHaveBeenCalledWith('heka-open-journal', { prompt: 'Reflect on today' });
  });

  it('emitNavigateToStars passes tab when provided', () => {
    emitNavigateToStars('chart');
    expect(emitSpy).toHaveBeenCalledWith('navigate-to-stars', { tab: 'chart' });
  });

  it('emitSelectDate defaults to today when date is null', () => {
    emitSelectDate(null);
    expect(emitSpy).toHaveBeenCalledWith('heka-select-date', expect.objectContaining({
      year: expect.any(Number), month: expect.any(Number), day: expect.any(Number),
    }));
  });
});
