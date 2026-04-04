/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CELESTIAL ERROR BOUNDARY
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Enterprise-grade error boundary for Celestial Intelligence.
 * Catches errors in child components and displays graceful fallback UI.
 * Prevents entire app crashes from isolated component failures.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class CelestialErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log to console with component context
    console.error(
      `[CelestialErrorBoundary${this.props.componentName ? ` :: ${this.props.componentName}` : ''}]`,
      error,
      errorInfo
    );
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '32px 24px',
            background: 'linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 30, 60, 0.95))',
            borderRadius: '16px',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fff',
            textAlign: 'center',
            maxWidth: '500px',
            margin: '0 auto',
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🌑</div>
          <h3
            style={{
              margin: '0 0 12px 0',
              fontSize: '20px',
              fontWeight: 500,
              color: '#fca5a5',
            }}
          >
            Celestial Interference Detected
          </h3>
          <p
            style={{
              margin: '0 0 20px 0',
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.6,
            }}
          >
            {this.props.componentName 
              ? `The ${this.props.componentName} component encountered an error.`
              : 'A celestial component has fallen out of alignment.'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 20px',
              background: 'rgba(147, 51, 234, 0.3)',
              border: '1px solid rgba(147, 51, 234, 0.5)',
              borderRadius: '8px',
              color: '#e9d5ff',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(147, 51, 234, 0.3)';
            }}
          >
            ✨ Realign Stars
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details
              style={{
                marginTop: '20px',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                textAlign: 'left',
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <summary style={{ cursor: 'pointer', color: 'rgba(255, 255, 255, 0.7)' }}>
                Error Details (Development Only)
              </summary>
              <pre style={{ margin: '12px 0 0 0', overflow: 'auto' }}>
                {this.state.error.toString()}
                {'\n'}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default CelestialErrorBoundary;
