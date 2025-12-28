// ErrorDisplay Component - Display detailed, elderly-friendly error messages
// Created: November 7, 2025
// Purpose: Show errors with clear titles, descriptions, and action buttons

import { AlertCircle, RefreshCw, LogIn, ArrowLeft, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { getErrorMessage } from '../utils/errorMessages';

interface ErrorDisplayProps {
  error: any;
  context?: string;
  onRetry?: () => void;
  onAction?: () => void;
  darkMode?: boolean;
  compact?: boolean; // For inline errors (forms)
}

export default function ErrorDisplay({
  error,
  context,
  onRetry,
  onAction,
  darkMode = false,
  compact = false,
}: ErrorDisplayProps) {
  const errorInfo = getErrorMessage(error, context);

  // Get appropriate icon
  const getIcon = () => {
    const iconProps = { className: compact ? 'w-5 h-5' : 'w-12 h-12 sm:w-16 sm:h-16' };
    
    if (errorInfo.icon?.includes('🔒') || errorInfo.icon?.includes('🔐')) {
      return <LogIn {...iconProps} className={`${iconProps.className} text-orange-600`} />;
    }
    if (errorInfo.icon?.includes('📧') || errorInfo.icon?.includes('✉️')) {
      return <Mail {...iconProps} className={`${iconProps.className} text-blue-600`} />;
    }
    if (errorInfo.icon?.includes('⏰') || errorInfo.icon?.includes('⏱️')) {
      return <RefreshCw {...iconProps} className={`${iconProps.className} text-purple-600`} />;
    }
    
    return <AlertCircle {...iconProps} className={`${iconProps.className} text-red-600`} />;
  };

  // Get action button
  const getActionButton = () => {
    const action = errorInfo.action || 'Try Again';
    const handler = onAction || onRetry;
    
    if (!handler) return null;

    // Determine button variant and icon
    if (action === 'Log In' || action === 'Go to Login') {
      return (
        <Button
          onClick={handler}
          size="lg"
          className="h-14 sm:h-16 px-6 sm:px-10 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <LogIn className="w-5 h-5" strokeWidth={2.5} />
          {action}
        </Button>
      );
    }
    
    if (action === 'Retry' || action === 'Try Again') {
      return (
        <Button
          onClick={handler}
          size="lg"
          className="h-14 sm:h-16 px-6 sm:px-10 gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <RefreshCw className="w-5 h-5" strokeWidth={2.5} />
          {action}
        </Button>
      );
    }
    
    if (action === 'Go Back') {
      return (
        <Button
          onClick={handler}
          size="lg"
          variant="outline"
          className="h-14 sm:h-16 px-6 sm:px-10 gap-2"
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          {action}
        </Button>
      );
    }
    
    // Default action button
    return (
      <Button
        onClick={handler}
        size="lg"
        className="h-14 sm:h-16 px-6 sm:px-10"
      >
        {action}
      </Button>
    );
  };

  // Compact version for inline errors (e.g., forms)
  if (compact) {
    return (
      <Alert className={`border-2 ${
        darkMode 
          ? 'bg-red-950/30 border-red-800 text-red-300' 
          : 'bg-red-50 border-red-200 text-red-900'
      }`}>
        <AlertCircle className="w-5 h-5" />
        <AlertDescription className="text-base">
          <strong>{errorInfo.title}:</strong> {errorInfo.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Full version for error pages
  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      darkMode ? 'bg-slate-950' : 'bg-slate-50'
    }`}>
      <div className="w-full max-w-2xl">
        <div className={`rounded-2xl border-2 p-8 sm:p-12 text-center ${
          darkMode 
            ? 'bg-slate-900 border-slate-800' 
            : 'bg-white border-slate-200'
        } shadow-xl`}>
          {/* Icon */}
          <div className="flex justify-center mb-6">
            {getIcon()}
          </div>

          {/* Title */}
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl mb-4 ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {errorInfo.title}
          </h1>

          {/* Message */}
          <p className={`text-lg sm:text-xl lg:text-2xl mb-8 max-w-xl mx-auto ${
            darkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {errorInfo.message}
          </p>

          {/* Action Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {getActionButton()}
          </div>

          {/* Technical Details (collapsible for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-8 text-left">
              <summary className={`cursor-pointer text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Technical Details (Development Only)
              </summary>
              <pre className={`mt-4 p-4 rounded-lg text-xs overflow-auto ${
                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                {JSON.stringify({
                  error: error?.message || error?.toString(),
                  status: error?.status || error?.statusCode,
                  context: context,
                  stack: error?.stack,
                }, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
