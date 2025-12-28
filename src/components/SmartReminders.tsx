import { useState, useEffect, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, BellOff, Clock, Pill, X, Check, Volume2, VolumeX } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';
import { playSoundEffect } from '../utils/soundEffects';

interface SmartRemindersProps {
  darkMode: boolean;
  medications: any[];
  onMarkTaken: (medId: number) => void;
}

function SmartReminders({ darkMode, medications, onMarkTaken }: SmartRemindersProps) {
  
  const [remindersEnabled, setRemindersEnabled] = useState(() => {
    return localStorage.getItem('smartRemindersEnabled') !== 'false';
  });
  
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('reminderSoundEnabled') !== 'false';
  });
  
  const [upcomingMedications, setUpcomingMedications] = useState<any[]>([]);
  const [dismissedReminders, setDismissedReminders] = useState<number[]>([]);

  useEffect(() => {
    localStorage.setItem('smartRemindersEnabled', String(remindersEnabled));
  }, [remindersEnabled]);

  useEffect(() => {
    localStorage.setItem('reminderSoundEnabled', String(soundEnabled));
  }, [soundEnabled]);

  // Check for upcoming medications every minute
  useEffect(() => {
    if (!remindersEnabled) {
      setUpcomingMedications([]);
      return;
    }

    const checkUpcoming = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

      // Get today's medications
      const today = now.toISOString().split('T')[0];
      const takenHistory = JSON.parse(localStorage.getItem('takenHistory') || '{}');
      
      const upcoming = medications
        .filter(med => {
          // Check if medication should be taken today
          if (med.daysOfWeek) {
            const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            const todayKey = days[now.getDay()];
            if (!med.daysOfWeek[todayKey]) return false;
          }

          // Check if already taken
          const medHistory = takenHistory[today]?.[med.id];
          if (medHistory) return false;

          // Check if dismissed
          if (dismissedReminders.includes(med.id)) return false;

          // Check if medication time is within next 15 minutes
          if (!med.time) return false;
          
          const [medHour, medMinute] = med.time.split(':').map(Number);
          const medTotalMinutes = medHour * 60 + medMinute;
          const nowTotalMinutes = currentHour * 60 + currentMinute;
          const minutesUntil = medTotalMinutes - nowTotalMinutes;

          return minutesUntil >= 0 && minutesUntil <= 15;
        })
        .sort((a, b) => a.time.localeCompare(b.time));

      setUpcomingMedications(upcoming);

      // Play sound for new reminders
      if (soundEnabled && upcoming.length > upcomingMedications.length) {
        playSoundEffect('alert');
      }
    };

    checkUpcoming();
    const interval = setInterval(checkUpcoming, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [remindersEnabled, medications, dismissedReminders, soundEnabled]);

  const handleDismiss = (medId: number) => {
    setDismissedReminders(prev => [...prev, medId]);
    toast.info('Reminder dismissed', {
      description: 'You can re-enable reminders in Settings'
    });
    if ('vibrate' in navigator) navigator.vibrate(20);
  };

  const handleTakeNow = (medId: number, medName: string) => {
    onMarkTaken(medId);
    setDismissedReminders(prev => [...prev, medId]);
    playSoundEffect('success');
    toast.success(`${medName} marked as taken`, {
      description: 'Great job staying on track!'
    });
    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  };

  if (!remindersEnabled) {
    return (
      <Card className={`p-4 sm:p-5 border-2 ${
        darkMode 
          ? 'bg-slate-800/50 border-slate-700' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              darkMode ? 'bg-slate-700' : 'bg-slate-200'
            }`}>
              <BellOff className={`w-6 h-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`} strokeWidth={2} />
            </div>
            <div>
              <p className={`font-medium ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Smart Reminders Off
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Enable to get timely medication reminders
              </p>
            </div>
          </div>
          <Switch
            checked={remindersEnabled}
            onCheckedChange={(checked) => {
              setRemindersEnabled(checked);
              toast.success(checked ? 'Reminders enabled' : 'Reminders disabled');
            }}
          />
        </div>
      </Card>
    );
  }

  if (upcomingMedications.length === 0) {
    return (
      <Card className={`p-4 sm:p-5 border-2 ${
        darkMode 
          ? 'bg-gradient-to-br from-green-950/30 to-green-900/20 border-green-800' 
          : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              darkMode ? 'bg-green-900/50' : 'bg-green-200/50'
            }`}>
              <Check className={`w-6 h-6 ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`} strokeWidth={2} />
            </div>
            <div>
              <p className={`font-medium ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                All Clear!
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-green-400' : 'text-green-700'
              }`}>
                No medications due in the next 15 minutes
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(soundEnabled ? 'Sound disabled' : 'Sound enabled');
              }}
              className="h-10 w-10 p-0"
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5" strokeWidth={2} />
              ) : (
                <VolumeX className="w-5 h-5" strokeWidth={2} />
              )}
            </Button>
            <Switch
              checked={remindersEnabled}
              onCheckedChange={(checked) => {
                setRemindersEnabled(checked);
                toast.success(checked ? 'Reminders enabled' : 'Reminders disabled');
              }}
            />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {upcomingMedications.map((med, index) => {
          const now = new Date();
          const [medHour, medMinute] = med.time.split(':').map(Number);
          const medTotalMinutes = medHour * 60 + medMinute;
          const nowTotalMinutes = now.getHours() * 60 + now.getMinutes();
          const minutesUntil = medTotalMinutes - nowTotalMinutes;

          return (
            <motion.div
              key={med.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 sm:p-5 border-2 ${
                minutesUntil <= 5
                  ? darkMode 
                    ? 'bg-gradient-to-br from-red-950/30 to-red-900/20 border-red-800 shadow-lg shadow-red-900/20' 
                    : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 shadow-lg shadow-red-100/50'
                  : darkMode 
                    ? 'bg-gradient-to-br from-amber-950/30 to-amber-900/20 border-amber-800' 
                    : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      minutesUntil <= 5
                        ? darkMode ? 'bg-red-900/50' : 'bg-red-200/50'
                        : darkMode ? 'bg-amber-900/50' : 'bg-amber-200/50'
                    }`}>
                      <Bell className={`w-6 h-6 ${
                        minutesUntil <= 5
                          ? darkMode ? 'text-red-400 animate-pulse' : 'text-red-700 animate-pulse'
                          : darkMode ? 'text-amber-400' : 'text-amber-700'
                      }`} strokeWidth={2} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold truncate ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {med.name}
                      </p>
                      <p className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {med.dosage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" strokeWidth={2} />
                        <span className={`text-sm font-medium ${
                          minutesUntil <= 5
                            ? darkMode ? 'text-red-400' : 'text-red-700'
                            : darkMode ? 'text-amber-400' : 'text-amber-700'
                        }`}>
                          {minutesUntil === 0 ? 'Now' : `In ${minutesUntil} min`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      onClick={() => handleTakeNow(med.id, med.name)}
                      className={`h-12 px-4 gap-2 ${
                        minutesUntil <= 5
                          ? 'bg-red-600 hover:bg-red-700 text-white'
                          : 'bg-amber-600 hover:bg-amber-700 text-white'
                      }`}
                    >
                      <Pill className="w-5 h-5" strokeWidth={2} />
                      <span className="hidden sm:inline">Take</span>
                    </Button>
                    <Button
                      onClick={() => handleDismiss(med.id)}
                      variant="ghost"
                      size="sm"
                      className="h-12 w-12 p-0"
                    >
                      <X className="w-5 h-5" strokeWidth={2} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Controls */}
      <Card className={`p-3 border ${
        darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Reminder Settings
          </span>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                toast.info(soundEnabled ? 'Sound disabled' : 'Sound enabled');
              }}
              className="h-9 px-3 gap-2"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" strokeWidth={2} />
              ) : (
                <VolumeX className="w-4 h-4" strokeWidth={2} />
              )}
              <span className="text-sm">{soundEnabled ? 'On' : 'Off'}</span>
            </Button>
            <Switch
              checked={remindersEnabled}
              onCheckedChange={(checked) => {
                setRemindersEnabled(checked);
                toast.success(checked ? 'Reminders enabled' : 'Reminders disabled');
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default memo(SmartReminders);
