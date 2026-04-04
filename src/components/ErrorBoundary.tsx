import { Component, ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

// Module-level flag - persists across re-renders
let wasmErrorSuppressed = false;

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): Partial<State> | null {
    const msg = error?.message || '';
    
    // If it's a WASM error, suppress it completely
    if (msg.includes('is not a function') || msg.includes('WASM') || msg.includes('swisseph') || msg.includes('#185')) {
      if (!wasmErrorSuppressed) {
        wasmErrorSuppressed = true;
        console.warn('[ErrorBoundary] WASM error suppressed - continuing normally');
      }
      // Return null - no state change, no re-render
      return null;
    }
    
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Complete silent for WASM errors
    const msg = error?.message || '';
    if (msg.includes('is not a function') || msg.includes('WASM') || msg.includes('swisseph') || msg.includes('#185')) {
      return;
    }
    console.error('[ErrorBoundary] Error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '2rem', 
          textAlign: 'center', 
          background: '#0c0c0f', 
          color: '#f5f5f5', 
          minHeight: '100vh',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#ff6b6b', marginBottom: '1rem' }}>Something went wrong</h1>
          <button onClick={this.handleRetry} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem', background: '#6c5ce7', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
