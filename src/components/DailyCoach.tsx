import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronDown, Clock, CheckCircle2, Circle, Pill, Sparkles, Trophy, Timer, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { playSoundEffect } from '../utils/soundEffects';

interface DailyCoachProps {
  darkMode: boolean;
  medications: any[];
  takenHistory: Record<string, Record<number, boolean>>;
  onToggleMedication: (id: number) => void;
  autoScroll?: boolean;
}

export default function DailyCoach({ 
  darkMode, 
  medications, 
  takenHistory, 
  onToggleMedication,
  autoScroll = true 
}: DailyCoachProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expanded, setExpanded] = useState(true);
  const [currentMedicationIndex, setCurrentMedicationIndex] = useState(0);
  const coachRef = useRef<HTMLDivElement | null>(null);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Get today's date key
  const dateKey = new Date().toISOString().split('T')[0];

  // Get today's medications sorted by time
  const getTodaysMedications = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const now = currentTime;
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return medications
      .filter(med => {
        if (!med.times || !med.daysOfWeek) return false;
        // daysOfWeek is an object: {sun: true, mon: false, ...}
        return med.daysOfWeek[today] === true;
      })
      .flatMap(med => 
        med.times.map((time: string) => {
          const [hours, minutes] = time.split(':').map(Number);
          const timeInMinutes = hours * 60 + minutes;
          const timeDiff = currentMinutes - timeInMinutes;
          
          return {
            ...med,
            scheduledTime: time,
            timeInMinutes,
            timeDiff,
            isPast: timeDiff > 60, // More than 1 hour past
            isNow: timeDiff >= -30 && timeDiff <= 60, // Within 30 min before to 1 hour after
            isUpcoming: timeDiff < -30 && timeDiff > -120, // 30-120 minutes ahead
            isTaken: takenHistory[dateKey]?.[med.id] || false,
          };
        })
      )
      .sort((a, b) => a.timeInMinutes - b.timeInMinutes);
  };

  const todaysMedications = getTodaysMedications();
  
  // Find the next untaken medication
  const nextUntakenMedication = todaysMedications.find(med => !med.isTaken && (med.isNow || med.isUpcoming || !med.isPast));
  
  // Get current medication to focus on
  const currentMedication = nextUntakenMedication || todaysMedications[0];

  // Auto-scroll to current medication when it changes
  useEffect(() => {
    if (autoScroll && currentMedication && coachRef.current) {
      const medicationElement = document.getElementById(`coach-med-${currentMedication.id}-${currentMedication.scheduledTime}`);
      if (medicationElement) {
        medicationElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentMedication?.id, currentMedication?.scheduledTime, autoScroll]);

  const handleToggleMedication = (id: number) => {
    onToggleMedication(id);
    playSoundEffect('success');
    
    // Auto-advance to next medication
    if (autoScroll) {
      setTimeout(() => {
        const nextIndex = currentMedicationIndex + 1;
        if (nextIndex < todaysMedications.length) {
          setCurrentMedicationIndex(nextIndex);
        }
      }, 800);
    }
  };

  // Calculate progress
  const takenCount = todaysMedications.filter(med => med.isTaken).length;
  const totalCount = todaysMedications.length;
  const progressPercentage = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  // Get motivational message
  const getMotivationalMessage = () => {
    if (takenCount === 0) {
      return "Let's start your day right!";
    } else if (takenCount === totalCount) {
      return "Perfect! All done for today!";
    } else if (progressPercentage >= 75) {
      return "Almost there! Keep it up!";
    } else if (progressPercentage >= 50) {
      return "Great progress! You're halfway there!";
    } else {
      return "You're doing great! Keep going!";
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTimeStatus = (med: any) => {
    if (med.isTaken) return 'Taken';
    if (med.isPast) return 'Overdue';
    if (med.isNow) return 'Now';
    if (med.isUpcoming) return 'Soon';
    return 'Scheduled';
  };

  const getTimeStatusColor = (med: any) => {
    if (med.isTaken) return darkMode ? 'text-green-400' : 'text-green-600';
    if (med.isPast) return darkMode ? 'text-red-400' : 'text-red-600';
    if (med.isNow) return darkMode ? 'text-blue-400' : 'text-blue-600';
    if (med.isUpcoming) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-gray-400' : 'text-gray-600';
  };

  if (todaysMedications.length === 0) {
    return (
      <div className={`rounded-xl p-4 sm:p-5 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="text-center">
          <Sparkles className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            No Medications Today
          </h3>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Enjoy your day!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={coachRef} className={`rounded-xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 sm:p-5 flex items-center justify-between transition-colors ${
          darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
            darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
          }`}>
            <Sparkles className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <div className="text-left">
            <h2 className={`text-xl sm:text-2xl mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Daily Coach
            </h2>
            <p className={`text-base sm:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {getMotivationalMessage()}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </motion.div>
      </button>

      {/* Progress Bar */}
      <div className="px-4 sm:px-5 pb-3 sm:pb-4">
        <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {takenCount} of {totalCount} taken
          </span>
          <span className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
            {Math.round(progressPercentage)}%
          </span>
        </div>
      </div>

      {/* Medications List */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            <div className="space-y-3">
              {todaysMedications.map((med, index) => {
                const isCurrent = currentMedication && 
                  med.id === currentMedication.id && 
                  med.scheduledTime === currentMedication.scheduledTime;

                return (
                  <motion.div
                    key={`${med.id}-${med.scheduledTime}`}
                    id={`coach-med-${med.id}-${med.scheduledTime}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`rounded-xl p-4 transition-all duration-300 ${
                      isCurrent
                        ? darkMode
                          ? 'bg-blue-900/30 ring-2 ring-blue-500'
                          : 'bg-blue-50 ring-2 ring-blue-600'
                        : darkMode
                        ? 'bg-gray-700/50'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggleMedication(med.id)}
                        className="flex-shrink-0 mt-1 touch-manipulation"
                        style={{ minWidth: '32px', minHeight: '32px' }}
                      >
                        {med.isTaken ? (
                          <CheckCircle2 
                            className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`}
                            strokeWidth={2.5}
                          />
                        ) : (
                          <Circle 
                            className={`w-8 h-8 ${
                              isCurrent
                                ? darkMode ? 'text-blue-400' : 'text-blue-600'
                                : darkMode ? 'text-gray-600' : 'text-gray-400'
                            }`}
                            strokeWidth={2.5}
                          />
                        )}
                      </button>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className={`font-bold text-lg leading-tight ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {med.name}
                          </h3>
                          <div className="flex flex-col items-end gap-1">
                            <span className={`text-base font-semibold ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {formatTime(med.scheduledTime)}
                            </span>
                            <span className={`text-sm font-medium ${getTimeStatusColor(med)}`}>
                              {getTimeStatus(med)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-base">
                          <div className="flex items-center gap-2">
                            <Pill className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                              {med.dosage}
                            </span>
                          </div>
                          {med.mealTiming && med.mealTiming !== 'any' && (
                            <span className={`text-sm px-2 py-1 rounded-md ${
                              darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {med.mealTiming === 'with' ? 'With food' : 
                               med.mealTiming === 'before' ? 'Before food' : 'After food'}
                            </span>
                          )}
                        </div>

                        {med.notes && !med.isTaken && (
                          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {med.notes}
                          </p>
                        )}
                      </div>

                      {/* Indicator for current medication */}
                      {isCurrent && !med.isTaken && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex-shrink-0"
                        >
                          <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Completion Message */}
            {takenCount === totalCount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-6 rounded-xl text-center ${
                  darkMode ? 'bg-green-900/30' : 'bg-green-50'
                }`}
              >
                <Trophy className={`w-16 h-16 mx-auto mb-3 ${
                  darkMode ? 'text-green-400' : 'text-green-600'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-green-400' : 'text-green-700'
                }`}>
                  Excellent Work!
                </h3>
                <p className={`text-base ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                  You've completed all your medications for today.
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
