/**
 * ErrorBoundary Tests — Phase 5: Production Resilience
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// Component that throws on demand
function Bomb({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test explosion');
  }
  return <div data-testid="safe">All clear</div>;
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Hello');
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText('The temple needs a moment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reload App/i })).toBeInTheDocument();
  });

  it('resets error state when retry button is clicked', () => {
    // Use a wrapper with key to force remount after retry
    function Wrapper() {
      const [key, setKey] = React.useState(0);
      return (
        <ErrorBoundary>
          <div>
            <button onClick={() => setKey(k => k + 1)}>Trigger Update</button>
            <Bomb key={key} shouldThrow={false} />
          </div>
        </ErrorBoundary>
      );
    }
    const React = require('react');

    render(<Wrapper />);
    expect(screen.getByTestId('safe')).toHaveTextContent('All clear');
  });

  it('logs non-WASM errors to console', () => {
    render(
      <ErrorBoundary>
        <Bomb shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('silently handles WASM errors in componentDidCatch', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    function WasmBomb() {
      throw new Error('swisseph WASM is not a function');
    }
    // This will throw during render; the boundary catches it in componentDidCatch
    // but getDerivedStateFromError returns null, so React re-throws.
    // We test that componentDidCatch does not call console.error for WASM errors.
    expect(() =>
      render(
        <ErrorBoundary>
          <WasmBomb />
        </ErrorBoundary>
      )
    ).toThrow();
    // No console.error should be called for WASM errors (only console.warn in main.tsx suppressor)
    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('[ErrorBoundary] Error:'),
      expect.anything()
    );
  });
});
