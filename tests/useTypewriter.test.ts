import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTypewriter } from '../src/hooks/useTypewriter';

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useTypewriter());
    expect(result.current.displayedText).toBe('');
    expect(result.current.isRevealing).toBe(false);
    expect(result.current.revealedMessage).toBeNull();
  });

  it('reveals text word by word', () => {
    const { result } = renderHook(() => useTypewriter());
    const msg = { text: 'Hello world test', sender: 'coach' as const, timestamp: 0 };

    act(() => {
      result.current.start(msg, 50);
    });

    expect(result.current.isRevealing).toBe(true);
    expect(result.current.revealedMessage).not.toBeNull();

    // After first interval — reveals first word
    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current.displayedText.length).toBeGreaterThan(0);
  });

  it('calls onComplete when done', () => {
    const { result } = renderHook(() => useTypewriter());
    const onComplete = vi.fn();
    const msg = { text: 'Hi', sender: 'coach' as const, timestamp: 0 };

    act(() => {
      result.current.start(msg, 10, onComplete);
    });

    // Wait for all words to reveal
    act(() => { vi.advanceTimersByTime(500); });

    expect(onComplete).toHaveBeenCalledWith(msg);
    expect(result.current.isRevealing).toBe(false);
  });

  it('stops revealing when stop is called', () => {
    const { result } = renderHook(() => useTypewriter());
    const msg = { text: 'This is a longer message with many words', sender: 'coach' as const, timestamp: 0 };

    act(() => {
      result.current.start(msg, 50);
    });

    act(() => { vi.advanceTimersByTime(100); });
    const partialText = result.current.displayedText;

    act(() => {
      result.current.stop();
    });

    // stop() clears the timer but keeps the message state
    expect(result.current.displayedText).toBe(partialText);
    // Timer is cleared so no more advancement happens
    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current.displayedText).toBe(partialText);
  });

  it('handles empty message', () => {
    const { result } = renderHook(() => useTypewriter());
    const msg = { text: '', sender: 'coach' as const, timestamp: 0 };

    act(() => {
      result.current.start(msg, 10);
    });

    expect(result.current.displayedText).toBe('');
  });

  it('restarts with new message', () => {
    const { result } = renderHook(() => useTypewriter());
    const msg1 = { text: 'First', sender: 'coach' as const, timestamp: 0 };
    const msg2 = { text: 'Second message', sender: 'coach' as const, timestamp: 1 };

    act(() => {
      result.current.start(msg1, 10);
    });

    act(() => {
      result.current.start(msg2, 10);
    });

    expect(result.current.revealedMessage).not.toBeNull();
  });

  it('preserves whitespace between words', () => {
    const { result } = renderHook(() => useTypewriter());
    const msg = { text: 'Hello   world', sender: 'coach' as const, timestamp: 0 };

    act(() => {
      result.current.start(msg, 10);
    });

    act(() => { vi.advanceTimersByTime(500); });

    expect(result.current.displayedText).toContain('   ');
  });
});
