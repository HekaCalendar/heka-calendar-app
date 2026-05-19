import React, { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  featureName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * React Error Boundary that catches errors in feature components
 * and displays a graceful fallback UI instead of crashing the whole app.
 */
export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[ErrorBoundary${this.props.featureName ? `:${this.props.featureName}` : ''}]`, error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            padding: '24px',
            textAlign: 'center',
            color: '#e8e8e8',
            background: '#1a1a2e',
            borderRadius: '12px',
            border: '1px solid rgba(202, 162, 39, 0.3)',
            margin: '16px',
          }}
        >
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌌</div>
          <h3 style={{ margin: '0 0 8px', color: '#c9a227', fontSize: '18px' }}>
            Something went wrong
          </h3>
          <p style={{ margin: '0 0 16px', fontSize: '14px', opacity: 0.7 }}>
            {this.props.featureName
              ? `The ${this.props.featureName} feature encountered an error.`
              : 'This feature encountered an error.'}
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '8px 20px',
              background: '#c9a227',
              color: '#1a1a2e',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload Feature
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
