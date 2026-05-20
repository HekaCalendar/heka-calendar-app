import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRef } from 'react';
import { useFocusTrap } from '../src/components/setup/useFocusTrap';

describe('useFocusTrap', () => {
  it('focuses first focusable element when active', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">First</button>
      <button id="btn2">Second</button>
    `;
    document.body.appendChild(container);

    const { result } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as unknown as HTMLDivElement);
      useFocusTrap(true, ref);
      return ref;
    });

    // Cleanup
    document.body.removeChild(container);
  });

  it('adds and removes keydown listener after delay', () => {
    vi.useFakeTimers();
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    const container = document.createElement('div');
    container.innerHTML = '<button>Btn</button>';
    document.body.appendChild(container);

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as unknown as HTMLDivElement);
      useFocusTrap(true, ref);
      return ref;
    });

    // Hook defers listener attachment by 50ms
    act(() => { vi.advanceTimersByTime(60); });
    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    addSpy.mockRestore();
    removeSpy.mockRestore();
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  it('does not add listener when inactive', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');

    const container = document.createElement('div');
    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as unknown as HTMLDivElement);
      useFocusTrap(false, ref);
      return ref;
    });

    // Should not add listener when inactive
    const keydownCalls = addSpy.mock.calls.filter(c => c[0] === 'keydown');
    expect(keydownCalls.length).toBe(0);

    addSpy.mockRestore();
    unmount();
  });

  it('traps Tab to last element when at first and shift held', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="a">A</button>
      <button id="b">B</button>
    `;
    document.body.appendChild(container);

    const btnA = container.querySelector('#a') as HTMLButtonElement;
    const btnB = container.querySelector('#b') as HTMLButtonElement;
    btnA.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as unknown as HTMLDivElement);
      useFocusTrap(true, ref);
      return ref;
    });

    // Simulate Shift+Tab on first element
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
    document.dispatchEvent(event);

    document.body.removeChild(container);
  });

  it('traps Tab to first element when at last', () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <button id="a">A</button>
      <button id="b">B</button>
    `;
    document.body.appendChild(container);

    const btnB = container.querySelector('#b') as HTMLButtonElement;
    btnB.focus();

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(container as unknown as HTMLDivElement);
      useFocusTrap(true, ref);
      return ref;
    });

    // Simulate Tab on last element
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: false, bubbles: true });
    document.dispatchEvent(event);

    document.body.removeChild(container);
  });
});
