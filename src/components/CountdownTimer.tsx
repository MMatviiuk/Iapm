import { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  targetTime: string; // Format: "HH:MM" (24-hour)
  darkMode?: boolean;
  compact?: boolean;
}

export default function CountdownTimer({ targetTime, darkMode = false, compact = false }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);
  const [isNow, setIsNow] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const [hours, minutes] = targetTime.split(':').map(Number);
      
      const target = new Date();
      target.setHours(hours, minutes, 0, 0);

      // Calculate difference in milliseconds
      const diff = target.getTime() - now.getTime();
      const minutesUntil = Math.floor(diff / 60000);

      // Handle different states
      if (minutesUntil < -60) {
        // More than 1 hour overdue
        const hoursOverdue = Math.abs(Math.floor(minutesUntil / 60));
        setIsOverdue(true);
        setIsNow(false);
        setTimeRemaining(`${hoursOverdue}h overdue`);
      } else if (minutesUntil < 0) {
        // Less than 1 hour overdue
        setIsOverdue(true);
        setIsNow(false);
        setTimeRemaining(`${Math.abs(minutesUntil)}m overdue`);
      } else if (minutesUntil === 0) {
        // Due right now
        setIsOverdue(false);
        setIsNow(true);
        setTimeRemaining('Now');
      } else if (minutesUntil < 60) {
        // Less than 1 hour remaining
        setIsOverdue(false);
        setIsNow(false);
        setTimeRemaining(`in ${minutesUntil}min`);
      } else {
        // More than 1 hour remaining
        const hoursUntil = Math.floor(minutesUntil / 60);
        const minsRemainder = minutesUntil % 60;
        setIsOverdue(false);
        setIsNow(false);
        if (minsRemainder === 0) {
          setTimeRemaining(`in ${hoursUntil}h`);
        } else {
          setTimeRemaining(`in ${hoursUntil}h ${minsRemainder}m`);
        }
      }
    };

    // Calculate immediately
    calculateTimeRemaining();

    // Update every minute (60 seconds)
    const interval = setInterval(calculateTimeRemaining, 60000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [targetTime]);

  // Compact version (just text)
  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 ${
        isOverdue 
          ? darkMode ? 'text-red-400' : 'text-red-600'
          : isNow
          ? darkMode ? 'text-green-400' : 'text-green-600'
          : darkMode ? 'text-blue-300' : 'text-blue-700'
      }`}>
        {isOverdue && <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />}
        {isNow && <Clock className="w-3.5 h-3.5 flex-shrink-0 animate-pulse" />}
        {!isOverdue && !isNow && <Clock className="w-3.5 h-3.5 flex-shrink-0" />}
        <span className="font-medium">{timeRemaining}</span>
      </span>
    );
  }

  // Full version (with styling)
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${
      isOverdue
        ? darkMode 
          ? 'bg-red-950/50 border border-red-800 text-red-300'
          : 'bg-red-50 border border-red-200 text-red-700'
        : isNow
        ? darkMode
          ? 'bg-green-950/50 border border-green-800 text-green-300 animate-pulse'
          : 'bg-green-50 border border-green-200 text-green-700 animate-pulse'
        : darkMode
        ? 'bg-blue-950/50 border border-blue-800 text-blue-300'
        : 'bg-blue-50 border border-blue-200 text-blue-700'
    }`}>
      {isOverdue && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
      {isNow && <Clock className="w-5 h-5 flex-shrink-0" />}
      {!isOverdue && !isNow && <Clock className="w-5 h-5 flex-shrink-0" />}
      <span className="font-bold text-base">{timeRemaining}</span>
    </div>
  );
}
