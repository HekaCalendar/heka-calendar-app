import { Component, ErrorInfo, type ReactNode } from 'react';
import { monitoring } from '../services/monitoring';
import './ErrorBoundary.css';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error?: Error; }

// Module-level flag - persists across re-renders
let wasmErrorSuppressed = false;

/**
 * Report an error to any configured monitoring service.
 * Currently a safe no-op hook; wire to Sentry/Crashlytics in production.
 */
function reportError(error: Error, errorInfo: ErrorInfo) {
  monitoring.captureException(error, {
    componentStack: errorInfo?.componentStack,
    boundary: 'ErrorBoundary',
  });
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): Partial<State> | null {
    const msg = error?.message || '';

    // WASM init errors are usually transient; suppress once and keep the app alive.
    if (msg.includes('is not a function') || msg.includes('WASM') || msg.includes('swisseph') || msg.includes('#185')) {
      if (!wasmErrorSuppressed) {
        wasmErrorSuppressed = true;
        console.warn('[ErrorBoundary] WASM error suppressed - continuing normally');
      }
      return null;
    }

    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = error?.message || '';
    if (msg.includes('is not a function') || msg.includes('WASM') || msg.includes('swisseph') || msg.includes('#185')) {
      return;
    }
    reportError(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="heka-error-boundary">
          <div className="heka-error-boundary__card">
            <div className="heka-error-boundary__icon">✦</div>
            <h1 className="heka-error-boundary__title">The temple needs a moment</h1>
            <p className="heka-error-boundary__text">
              Something unexpected interrupted the experience. Your data is safe.
            </p>
            {this.state.error && (
              <pre className="heka-error-boundary__code">
                {this.state.error.message}
              </pre>
            )}
            <div className="heka-error-boundary__actions">
              <button
                className="heka-error-boundary__btn heka-error-boundary__btn--primary"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              <button
                className="heka-error-boundary__btn heka-error-boundary__btn--secondary"
                onClick={this.handleReload}
              >
                Reload App
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
