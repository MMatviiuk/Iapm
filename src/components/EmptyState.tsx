import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  helpText?: string;
  onHelp?: () => void;
  darkMode?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  helpText,
  onHelp,
  darkMode = false
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4"
    >
      {/* Large Icon */}
      <div className={`mb-6 sm:mb-8 p-6 sm:p-8 rounded-full ${
        darkMode 
          ? 'bg-blue-950/30 text-blue-400' 
          : 'bg-blue-50 text-blue-600'
      }`}>
        <Icon 
          className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24" 
          strokeWidth={1.5} 
        />
      </div>

      {/* Title */}
      <h2 className={`text-2xl sm:text-3xl lg:text-4xl mb-4 ${
        darkMode ? 'text-white' : 'text-slate-900'
      }`}>
        {title}
      </h2>

      {/* Description */}
      <p className={`text-lg sm:text-xl lg:text-2xl max-w-2xl mb-8 sm:mb-10 ${
        darkMode ? 'text-slate-300' : 'text-slate-600'
      }`}>
        {description}
      </p>

      {/* Primary Action Button */}
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl mb-4 sm:mb-6"
        >
          {actionLabel}
        </Button>
      )}

      {/* Help Link */}
      {helpText && onHelp && (
        <button
          onClick={onHelp}
          className={`text-base sm:text-lg hover:underline ${
            darkMode 
              ? 'text-blue-400 hover:text-blue-300' 
              : 'text-blue-600 hover:text-blue-700'
          }`}
          style={{ minHeight: '44px' }}
        >
          {helpText}
        </button>
      )}
    </motion.div>
  );
}
