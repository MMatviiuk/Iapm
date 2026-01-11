import { InputHTMLAttributes } from 'react';

interface ResponsiveInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  darkMode?: boolean;
}

/**
 * Universal Responsive Input для Android + Web
 * - font-size: 16px (запобігає zoom на iOS)
 * - touch-friendly height
 * - адаптивні відступи
 */
export default function ResponsiveInput({
  label,
  error,
  darkMode = false,
  className = '',
  ...props
}: ResponsiveInputProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className={`block text-sm sm:text-base font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <input
        className={`w-full min-h-[48px] px-3 sm:px-4 py-2.5 sm:py-3 text-base border rounded-lg transition-colors ${
          darkMode
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        style={{ fontSize: '16px' }} // Критично для iOS - запобігає zoom
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

interface ResponsiveTextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  darkMode?: boolean;
  rows?: number;
}

/**
 * Universal Responsive Textarea
 */
export function ResponsiveTextarea({
  label,
  error,
  darkMode = false,
  rows = 4,
  className = '',
  ...props
}: ResponsiveTextareaProps) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className={`block text-sm sm:text-base font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-base border rounded-lg transition-colors ${
          darkMode
            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
          error ? 'border-red-500' : ''
        } ${className}`}
        style={{ fontSize: '16px' }}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
