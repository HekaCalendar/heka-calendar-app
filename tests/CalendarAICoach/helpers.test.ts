import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { aiConfigService } from '../../src/services/aiConfigService';
import { recordMemory } from '../../src/components/CalendarAICoach/helpers';
import type { CoachMessage } from '../../src/types/oracle';

describe('CalendarAICoach helpers', () => {
  let getContextSpy: ReturnType<typeof vi.spyOn>;
  let setContextSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    getContextSpy = vi.spyOn(aiConfigService, 'getUserContext').mockReturnValue({
      coachMemory: [],
    } as any);
    setContextSpy = vi.spyOn(aiConfigService, 'setUserContext').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recordMemory appends message to coachMemory', () => {
    const msg: CoachMessage = {
      id: 'test-1',
      type: 'insight',
      text: 'Hello world',
      icon: '✨',
      color: '#d4af37',
    };
    recordMemory(msg);
    expect(setContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      coachMemory: expect.arrayContaining([
        expect.objectContaining({ text: 'Hello world', type: 'insight' }),
      ]),
    }));
  });

  it('recordMemory truncates text to 200 chars', () => {
    const longText = 'a'.repeat(300);
    const msg: CoachMessage = {
      id: 'test-2',
      type: 'insight',
      text: longText,
      icon: '✨',
      color: '#d4af37',
    };
    recordMemory(msg);
    const call = setContextSpy.mock.calls[0][0] as any;
    expect(call.coachMemory[0].text).toHaveLength(200);
  });

  it('recordMemory preserves last 19 memories', () => {
    const existingMemories = Array.from({ length: 25 }, (_, i) => ({
      text: `memory-${i}`,
      timestamp: Date.now() - i * 1000,
      type: 'insight' as const,
      topic: 'general',
    }));
    getContextSpy.mockReturnValue({
      coachMemory: existingMemories,
    } as any);

    const msg: CoachMessage = {
      id: 'test-3',
      type: 'insight',
      text: 'new memory',
      icon: '✨',
      color: '#d4af37',
    };
    recordMemory(msg);
    const call = setContextSpy.mock.calls[0][0] as any;
    expect(call.coachMemory).toHaveLength(20);
    expect(call.coachMemory[19].text).toBe('new memory');
    expect(call.coachMemory[0].text).toBe('memory-6'); // dropped first 6
  });

  it('recordMemory sets lastCoachPrompt', () => {
    const msg: CoachMessage = {
      id: 'test-4',
      type: 'insight',
      text: 'prompt text',
      icon: '✨',
      color: '#d4af37',
    };
    recordMemory(msg);
    expect(setContextSpy).toHaveBeenCalledWith(expect.objectContaining({
      lastCoachPrompt: 'prompt text',
    }));
  });
});
