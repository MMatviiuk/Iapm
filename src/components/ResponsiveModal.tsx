import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  darkMode?: boolean;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Universal Responsive Modal для Android + Web
 * Автоматично адаптується під розміри екрану
 */
export default function ResponsiveModal({
  isOpen,
  onClose,
  title,
  icon,
  darkMode = false,
  children,
  maxWidth = '2xl',
}: ResponsiveModalProps) {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl lg:max-w-4xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 ${
        darkMode ? 'bg-black/80' : 'bg-black/50'
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthClasses[maxWidth]} h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Заголовок - sticky */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 sm:p-6 border-b ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            {icon && <span className="w-5 h-5 sm:w-6 sm:h-6">{icon}</span>}
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
            aria-label="Закрити"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Контент */}
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
