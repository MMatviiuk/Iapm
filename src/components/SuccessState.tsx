import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  darkMode?: boolean;
}

export default function SuccessState({
  title,
  description,
  actionLabel,
  onAction,
  darkMode = false
}: SuccessStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center text-center py-12 sm:py-16 px-4"
    >
      {/* Success Icon with Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.2
        }}
        className={`mb-6 sm:mb-8 p-6 sm:p-8 rounded-full ${
          darkMode 
            ? 'bg-green-950/30' 
            : 'bg-green-50'
        }`}
      >
        <CheckCircle2 
          className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 ${
            darkMode ? 'text-green-400' : 'text-green-600'
          }`}
          strokeWidth={1.5}
        />
      </motion.div>

      {/* Animated Title */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`text-2xl sm:text-3xl lg:text-4xl mb-4 ${
          darkMode ? 'text-white' : 'text-slate-900'
        }`}
      >
        {title}
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`text-lg sm:text-xl lg:text-2xl max-w-2xl mb-8 sm:mb-10 ${
          darkMode ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onAction}
            className="h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
