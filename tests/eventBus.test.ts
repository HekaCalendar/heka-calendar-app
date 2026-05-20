import { describe, it, expect, vi } from 'vitest';
import { eventBus } from '../src/services/eventBus';

describe('eventBus', () => {
  beforeEach(() => {
    eventBus.clear();
  });

  it('subscribes and receives emitted events', () => {
    const listener = vi.fn();
    eventBus.subscribe('heka-open-journal', listener);
    eventBus.emit('heka-open-journal', { prompt: 'Reflect' });
    expect(listener).toHaveBeenCalledWith({ prompt: 'Reflect' });
  });

  it('supports multiple listeners for same event', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();
    eventBus.subscribe('heka-open-journal', l1);
    eventBus.subscribe('heka-open-journal', l2);
    eventBus.emit('heka-open-journal', { prompt: 'Test' });
    expect(l1).toHaveBeenCalled();
    expect(l2).toHaveBeenCalled();
  });

  it('unsubscribe removes listener', () => {
    const listener = vi.fn();
    const unsub = eventBus.subscribe('heka-open-journal', listener);
    unsub();
    eventBus.emit('heka-open-journal', { prompt: 'Test' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('does not call listeners for different events', () => {
    const listener = vi.fn();
    eventBus.subscribe('heka-open-journal', listener);
    eventBus.emit('navigate-to-stars', { tab: 'sky' });
    expect(listener).not.toHaveBeenCalled();
  });

  it('reports hasListeners correctly', () => {
    expect(eventBus.hasListeners('heka-open-journal')).toBe(false);
    const unsub = eventBus.subscribe('heka-open-journal', vi.fn());
    expect(eventBus.hasListeners('heka-open-journal')).toBe(true);
    unsub();
    expect(eventBus.hasListeners('heka-open-journal')).toBe(false);
  });

  it('reports listenerCount correctly', () => {
    expect(eventBus.listenerCount('heka-open-journal')).toBe(0);
    const unsub1 = eventBus.subscribe('heka-open-journal', vi.fn());
    const unsub2 = eventBus.subscribe('heka-open-journal', vi.fn());
    expect(eventBus.listenerCount('heka-open-journal')).toBe(2);
    unsub1();
    expect(eventBus.listenerCount('heka-open-journal')).toBe(1);
    unsub2();
    expect(eventBus.listenerCount('heka-open-journal')).toBe(0);
  });

  it('clear removes all listeners', () => {
    eventBus.subscribe('heka-open-journal', vi.fn());
    eventBus.subscribe('navigate-to-stars', vi.fn());
    eventBus.clear();
    expect(eventBus.hasListeners('heka-open-journal')).toBe(false);
    expect(eventBus.hasListeners('navigate-to-stars')).toBe(false);
  });

  it('handles void events (no payload)', () => {
    const listener = vi.fn();
    eventBus.subscribe('heka-open-circle', listener);
    eventBus.emit('heka-open-circle', undefined);
    expect(listener).toHaveBeenCalledWith(undefined);
  });

  it('handles events with complex payloads', () => {
    const listener = vi.fn();
    eventBus.subscribe('heka-select-date', listener);
    const payload = { year: 2024, month: 6, day: 15, create: true };
    eventBus.emit('heka-select-date', payload);
    expect(listener).toHaveBeenCalledWith(payload);
  });

  it('isolates events between different names', () => {
    const l1 = vi.fn();
    const l2 = vi.fn();
    eventBus.subscribe('heka-task-created', l1);
    eventBus.subscribe('heka-task-completed', l2);
    eventBus.emit('heka-task-created', { task: { id: '1' } as any, isFirstTask: true });
    expect(l1).toHaveBeenCalled();
    expect(l2).not.toHaveBeenCalled();
  });

  it('survives listener exceptions without crashing', () => {
    const badListener = vi.fn(() => { throw new Error('boom'); });
    const goodListener = vi.fn();
    eventBus.subscribe('heka-open-journal', badListener);
    eventBus.subscribe('heka-open-journal', goodListener);
    expect(() => eventBus.emit('heka-open-journal', { prompt: 'Test' })).not.toThrow();
    expect(badListener).toHaveBeenCalled();
    expect(goodListener).toHaveBeenCalled();
  });
});
