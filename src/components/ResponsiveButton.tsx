import { ReactNode, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ResponsiveButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  darkMode?: boolean;
}

/**
 * Universal Responsive Button для Android + Web
 * Touch-friendly (min 44px), адаптивні розміри
 */
export default function ResponsiveButton({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  darkMode = false,
  disabled,
  className = '',
  ...props
}: ResponsiveButtonProps) {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation';

  // Size classes - mobile first
  const sizeClasses = {
    sm: 'min-h-[44px] px-3 py-2 text-sm sm:min-h-[40px] sm:px-4',
    md: 'min-h-[48px] px-4 py-3 text-base sm:min-h-[44px] sm:px-6',
    lg: 'min-h-[52px] px-5 py-3.5 text-lg sm:min-h-[48px] sm:px-8',
  };

  // Variant classes
  const variantClasses = {
    primary: darkMode
      ? 'bg-blue-600 hover:bg-blue-700 text-white'
      : 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: darkMode
      ? 'bg-gray-700 hover:bg-gray-600 text-white'
      : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: darkMode
      ? 'bg-red-700 hover:bg-red-800 text-white'
      : 'bg-red-500 hover:bg-red-600 text-white',
    ghost: darkMode
      ? 'hover:bg-gray-800 text-gray-300'
      : 'hover:bg-gray-100 text-gray-700',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : icon ? (
        <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>
      ) : null}
      <span className="truncate">{children}</span>
    </button>
  );
}
