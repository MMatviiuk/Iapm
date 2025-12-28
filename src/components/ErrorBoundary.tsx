import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * ERROR BOUNDARY COMPONENT
 * Medical-grade: Catches runtime errors to prevent app crashes
 * Critical for elderly users - shows friendly error instead of blank screen
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // Example: Sentry.captureException(error);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI - elderly-friendly
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 sm:p-12 border-2 border-red-200 dark:border-red-800">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 sm:w-12 sm:h-12 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-3xl sm:text-4xl mb-4 text-center text-slate-900 dark:text-white">
              Something Went Wrong
            </h1>

            {/* Error Description */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 text-center mb-8">
              We encountered an unexpected problem. Don't worry - your medication data is safe.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700">
                <p className="text-sm mb-2 text-slate-700 dark:text-slate-300">
                  <strong>Error:</strong> {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-3">
                    <summary className="text-sm cursor-pointer text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                      Stack Trace (click to expand)
                    </summary>
                    <pre className="mt-2 text-xs text-slate-600 dark:text-slate-400 overflow-auto max-h-64 p-2 bg-slate-50 dark:bg-slate-900 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Try Again Button */}
              <Button
                onClick={this.handleReset}
                size="lg"
                className="h-14 sm:h-16 px-8 text-lg gap-3"
              >
                <RefreshCw className="w-6 h-6" />
                Try Again
              </Button>

              {/* Go Home Button */}
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                size="lg"
                className="h-14 sm:h-16 px-8 text-lg gap-3"
              >
                <Home className="w-6 h-6" />
                Go to Home
              </Button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-slate-500 dark:text-slate-500 mt-8">
              If this problem continues, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/**
 * HOC to wrap component with ErrorBoundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}
