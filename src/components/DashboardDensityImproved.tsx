import { useState } from 'react';
import { Calendar, Clock, Pill, TrendingUp, AlertCircle, CheckCircle2, Activity, ArrowRight, Target, Info, PlusCircle, ChevronDown, ChevronRight, Utensils, Sparkles, AlarmClock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './ui/tooltip';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './ui/collapsible';
import { Progress } from './ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import EmptyState from './EmptyState';
import SuccessState from './SuccessState';
import RefillReminderDashboard from './RefillReminderDashboard';
import CountdownTimer from './CountdownTimer';
import QuickStatsWidget from './QuickStatsWidget';
import SmartReminders from './SmartReminders';
import FABButtons from './FABButtons';

interface DashboardDensityImprovedProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  medications: any[];
  currentUser?: any;
  onMarkTaken?: (id: number) => void;
}

export default function DashboardDensityImproved({ 
  darkMode, 
  setCurrentPage, 
  medications, 
  currentUser,
  onMarkTaken 
}: DashboardDensityImprovedProps) {
  // Collapsible state
  const [weeklyOpen, setWeeklyOpen] = useState(false);
  const [allMedsOpen, setAllMedsOpen] = useState(false);
  
  // Skip Dialog state
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [medicationToSkip, setMedicationToSkip] = useState<{id: number; name: string} | null>(null);

  // Calculate statistics
  const totalMedications = medications.length;
  const todayMedications = medications.filter(med => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    return med.daysOfWeek?.[today] === true;
  });
  
  const takenToday = todayMedications.filter(med => med.taken).length;
  const adherenceRate = todayMedications.length > 0 
    ? Math.round((takenToday / todayMedications.length) * 100) 
    : 100;

  const upcomingMedications = todayMedications.filter(med => !med.taken).slice(0, 3);
  const nextMedication = upcomingMedications[0];
  const allTakenToday = todayMedications.length > 0 && upcomingMedications.length === 0;

  // Calculate stats for QuickStatsWidget
  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
  const upcomingInHour = todayMedications.filter(med => {
    if (!med.time || med.taken) return false;
    const [hours, minutes] = med.time.split(':').map(Number);
    const medTime = new Date();
    medTime.setHours(hours, minutes, 0, 0);
    return medTime >= now && medTime <= oneHourLater;
  }).length;

  const missedToday = todayMedications.filter(med => {
    if (!med.time || med.taken) return false;
    const [hours, minutes] = med.time.split(':').map(Number);
    const medTime = new Date();
    medTime.setHours(hours, minutes, 0, 0);
    return medTime < now;
  }).length;

  const quickStats = {
    todayTaken: takenToday,
    todayTotal: todayMedications.length,
    weekAdherence: adherenceRate, // Mock - можна додати реальний розрахунок
    monthAdherence: Math.max(0, adherenceRate - 5), // Mock
    currentStreak: 7, // Mock - додати реальний розрахунок
    longestStreak: 14, // Mock
    upcomingInHour,
    missedToday
  };

  // Helper functions
  const getTimeString = (time: string | undefined) => {
    if (!time) return 'N/A';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error parsing time:', time, error);
      return 'N/A';
    }
  };

  const getTimeUntil = (time: string | undefined) => {
    if (!time) return null;
    try {
      const now = new Date();
      const [hours, minutes] = time.split(':').map(Number);
      const medTime = new Date();
      medTime.setHours(hours, minutes, 0);
      
      const diff = medTime.getTime() - now.getTime();
      const minutesUntil = Math.floor(diff / 60000);
      
      if (minutesUntil < 0) return 'Overdue';
      if (minutesUntil === 0) return 'Now';
      if (minutesUntil < 60) return `in ${minutesUntil} minutes`;
      
      const hoursUntil = Math.floor(minutesUntil / 60);
      const minsRemainder = minutesUntil % 60;
      if (minsRemainder === 0) return `in ${hoursUntil} hour${hoursUntil > 1 ? 's' : ''}`;
      return `in ${hoursUntil}h ${minsRemainder}m`;
    } catch (error) {
      console.error('Error calculating time until:', time, error);
      return null;
    }
  };

  const getMealTimingText = (timing?: string) => {
    if (!timing || timing === 'anytime') return '';
    // Handle both "before meal" and "before" formats
    const cleanTiming = timing.replace(' meal', '').toLowerCase();
    const map: { [key: string]: string } = {
      'before': 'Before meal',
      'with': 'With meal',
      'after': 'After meal'
    };
    return map[cleanTiming] || '';
  };

  const handleMarkTaken = (id: number) => {
    if (onMarkTaken) {
      onMarkTaken(id);
    }
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast.success('Marked as taken!', {
      description: 'Great job staying on track',
      duration: 2000,
    });
  };

  const handleSkipDose = (id: number, name: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30]);
    }
    
    toast.info(`Skipped ${name}`, {
      description: 'You can mark it as taken later from Today\'s schedule',
      duration: 3000,
    });
  };

  const handleSnoozeDose = (id: number, name: string, time: string) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30]);
    }
    
    // Calculate snooze time (15 minutes from now)
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + 15 * 60000);
    const snoozeTimeStr = snoozeTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    toast.success(`Snoozed ${name}`, {
      description: `Reminder in 15 minutes (${snoozeTimeStr})`,
      duration: 4000,
    });
  };

  // Check if CURRENT user is a demo account (has @example.com email)
  const isDemoMode = currentUser?.email?.endsWith('@example.com') || false;
  const demoUser = isDemoMode ? currentUser : null;

  // Show empty state for new users with no medications
  if (totalMedications === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-5 lg:mb-6"
          >
            <h1 className={`tracking-tight text-2xl sm:text-3xl lg:text-5xl ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Welcome to Prescription Clarity!
            </h1>
            <p className={`text-base sm:text-lg lg:text-xl mt-2 ${
              darkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Your universal health tracking platform
            </p>
          </motion.div>

          <EmptyState
            icon={Pill}
            title="No Medications Yet"
            description="You haven't added any medications, supplements, or wellness prescriptions yet. Let's get started!"
            actionLabel="Add Your First Prescription"
            onAction={() => setCurrentPage('add')}
            helpText="Need help getting started? (2 min guide)"
            onHelp={() => {
              toast.info('Quick Start Guide', {
                description: 'Click "Add Your First Prescription" above to begin. You will be guided through a simple 3-step process.',
                duration: 5000
              });
            }}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }

  // Note: allTakenToday already defined on line 52
  // const allTakenToday = todayMedications.length > 0 && takenToday === todayMedications.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      {/* DESKTOP WEB LAYOUT - Max Width Container */}
      <div className="w-full mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4 lg:py-6">
        {/* Constrain content width on large screens */}
        <div className="max-w-[1600px] mx-auto">
        
        {/* Demo Mode Banner */}
        {isDemoMode && demoUser && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 lg:mb-6"
          >
            <Alert className={`border-2 ${
              darkMode 
                ? 'bg-blue-950/30 border-blue-800 text-blue-300' 
                : 'bg-blue-50 border-blue-200 text-blue-900'
            }`}>
              <Info className="w-6 h-6" />
              <AlertDescription className="text-base sm:text-lg">
                <strong>Demo Mode:</strong> Viewing sample data for {demoUser.name}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        {/* Header - Compact without Avatar (photo only in TopBar) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 lg:mb-6"
        >
          {/* Welcome Text */}
          <h1 className={`tracking-tight text-xl sm:text-2xl lg:text-3xl xl:text-4xl leading-tight ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Welcome Back{currentUser?.name ? `, ${currentUser.name.split(' ')[0]}` : ''}
          </h1>
          <p className={`text-sm sm:text-base lg:text-lg mt-1 ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </motion.div>

        {/* 🔔 SMART REMINDERS - 15-MINUTE WINDOW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 lg:mb-6"
        >
          <SmartReminders
            darkMode={darkMode}
            medications={medications}
            onMarkTaken={handleMarkTaken}
          />
        </motion.div>

        {/* DESKTOP GRID LAYOUT - 2 columns on lg, 3 on xl */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        
          {/* 🎯 NEXT MEDICATION - Column 1 (spans 2 on xl) */}
          <TooltipProvider delayDuration={300}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 xl:col-span-2"
            >
              {allTakenToday ? (
                <SuccessState
                  icon={Sparkles}
                  title="All Done for Today!"
                  description={`You've taken all ${todayMedications.length} medications scheduled for today. Excellent work!`}
                  actionLabel="View Schedule"
                  onAction={() => setCurrentPage('schedule')}
                  darkMode={darkMode}
                />
              ) : nextMedication ? (
                <Card className={`p-4 lg:p-5 xl:p-6 border-2 ${
                  darkMode 
                    ? 'bg-blue-950/20 border-blue-700'
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  {/* Compact header */}
                  <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-help">
                          <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${
                            darkMode ? 'bg-blue-600' : 'bg-blue-600'
                          }`}>
                            <Target className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h2 className={`text-sm sm:text-base ${
                              darkMode ? 'text-blue-100' : 'text-blue-900'
                            }`}>
                              Next Medication
                            </h2>
                            <CountdownTimer 
                              targetTime={nextMedication.time} 
                              darkMode={darkMode}
                              compact={true}
                            />
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-xs p-3">
                        <p className="font-bold mb-1">Next Medication Due</p>
                        <p className="text-sm">This is the next medication you need to take today.</p>
                        <p className="text-sm mt-2 text-blue-400">💡 Click "Take Now" button when you take it to mark as complete</p>
                      </TooltipContent>
                    </Tooltip>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      onClick={() => handleSnoozeDose(nextMedication.id, nextMedication.name, nextMedication.time)}
                      variant="outline"
                      className="h-12 sm:h-14 px-4 gap-2 touch-manipulation border-amber-300 hover:bg-amber-50 dark:border-amber-700 dark:hover:bg-amber-950/30"
                    >
                      <AlarmClock className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="hidden md:inline">15m</span>
                    </Button>
                    <Button
                      onClick={() => {
                        setMedicationToSkip({id: nextMedication.id, name: nextMedication.name});
                        setSkipDialogOpen(true);
                      }}
                      variant="outline"
                      className="h-12 sm:h-14 px-4 sm:px-5 gap-2 touch-manipulation"
                    >
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                      <span className="hidden md:inline">Skip</span>
                    </Button>
                    <Button
                      onClick={() => handleMarkTaken(nextMedication.id)}
                      className="h-12 sm:h-14 px-5 sm:px-6 gap-2 bg-green-600 hover:bg-green-700 touch-manipulation"
                    >
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2.5} />
                      <span className="hidden sm:inline">Take</span>
                      <span className="sm:hidden">✓</span>
                    </Button>
                  </div>
                </div>
                
                {/* Compact medication info */}
                <div className={`rounded-lg p-2.5 sm:p-3 flex items-center gap-2 sm:gap-3 ${
                  darkMode ? 'bg-slate-900/50' : 'bg-white'
                }`}>
                  <div className="flex-1">
                    <h3 className={`text-lg sm:text-xl font-bold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {nextMedication.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {nextMedication.dosage}
                      </span>
                      <span className="text-slate-400">•</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          {getTimeString(nextMedication.time)}
                        </span>
                      </div>
                      {nextMedication.mealTiming && nextMedication.mealTiming !== 'anytime' && (
                        <>
                          <span className="text-slate-400">•</span>
                          <div className="flex items-center gap-1.5">
                            <Utensils className="w-4 h-4 text-orange-600" />
                            <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                              {getMealTimingText(nextMedication.mealTiming)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className={`p-5 border-2 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                  <div>
                    <p className={`text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      No upcoming medications scheduled for today
                    </p>
                  </div>
                </div>
              </Card>
            )}
            </motion.div>
          </TooltipProvider>

          {/* 📊 TODAY'S PROGRESS - SIMPLE TEXT SUMMARY */}
          <TooltipProvider delayDuration={300}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 lg:mb-6"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card className={`p-3 sm:p-4 border-2 cursor-help ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <div>
                        <p className={`text-base sm:text-lg lg:text-xl ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          You've taken <strong className="text-blue-600">{takenToday}</strong> of{' '}
                          <strong>{todayMedications.length}</strong> medications today
                        </p>
                        {upcomingMedications.length > 1 && (
                          <p className={`text-xs sm:text-sm mt-1 ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            Next up: {upcomingMedications[1]?.name} @ {getTimeString(upcomingMedications[1]?.time)}
                          </p>
                        )}
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl text-blue-600">
                        {adherenceRate}%
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <Progress 
                      value={adherenceRate} 
                      className="h-2.5 sm:h-3"
                    />
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-sm p-3">
                  <p className="font-bold mb-1">Today's Progress Summary</p>
                  <p className="text-sm">Track your daily medication adherence with this visual progress bar.</p>
                  <div className="text-sm mt-2 space-y-1">
                    <p>• <strong>Blue number:</strong> Medications taken</p>
                    <p>• <strong>Percentage:</strong> Today's adherence rate</p>
                    <p>• <strong>Progress bar:</strong> Visual representation</p>
                  </div>
                  <p className="text-sm mt-2 text-green-400">🎯 Taking medications on time improves health outcomes</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </TooltipProvider>

          {/* 📊 QUICK STATS WIDGET - REPLACED 4 STAT CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 lg:mb-6"
          >
            <QuickStatsWidget
              darkMode={darkMode}
              stats={quickStats}
              setCurrentPage={setCurrentPage}
            />
          </motion.div>

          {/* OLD 4-CARD STATS - REPLACED WITH QuickStatsWidget ABOVE */}
          {/* Keeping as backup comment in case needed */}
          {/* <TooltipProvider delayDuration={300}>
            <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card>Total Medications: {totalMedications}</Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <p className="font-bold mb-1">Remaining Today</p>
                  <p className="text-sm">How many medications you still need to take today.</p>
                  <p className="text-sm mt-2 text-purple-400">⏰ Check your schedule to see when to take them</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </TooltipProvider>

          {/* 💊 REFILL REMINDERS - LOW QUANTITY ALERTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mb-4 lg:mb-6"
          >
            <RefillReminderDashboard
              medications={medications}
              darkMode={darkMode}
              onRefillClick={(medId) => {
                toast.info('Refill reminder set', {
                  description: 'You will be notified when it\'s time to refill this medication.',
                  duration: 3000
                });
              }}
            />
          </motion.div>

          {/* 📋 TODAY'S MEDICATIONS - COMPACT LIST */}
          {todayMedications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <Card className={`border-2 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}>
                <div className="p-4 border-b-2 border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-lg sm:text-xl ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      Today's Medications ({todayMedications.length})
                    </h2>
                    <Button
                      onClick={() => setCurrentPage('schedule')}
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                    >
                      View All
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-3 space-y-2">
                  {todayMedications.map((med, index) => (
                    <div
                      key={med.id}
                      className={`border-2 rounded-lg p-3 flex items-center gap-3 ${
                        darkMode
                          ? 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      } transition-colors`}
                    >
                      {/* Time */}
                      <div className="flex-shrink-0 w-20">
                        <div className="flex items-center gap-1.5">
                          <Clock className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>
                            {getTimeString(med.time)}
                          </span>
                        </div>
                      </div>

                      {/* Medication Info */}
                      <div className="flex-1 min-w-0">
                        {/* Name - can wrap to 2 lines */}
                        <h3 className={`font-bold text-base leading-tight mb-0.5 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          {med.name}
                        </h3>
                        
                        {/* Dosage and meal timing in one line */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {med.dosage && (
                            <span className={`text-xs sm:text-sm whitespace-nowrap ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {med.dosage}
                            </span>
                          )}
                          {med.mealTiming && med.mealTiming !== 'anytime' && (
                            <div className={`flex items-center gap-1 text-xs sm:text-sm ${
                              darkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              <Utensils className="w-3 h-3 flex-shrink-0" />
                              <span className="whitespace-nowrap">{getMealTimingText(med.mealTiming)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status / Action */}
                      <div className="flex-shrink-0 w-20 sm:w-auto">
                        {med.taken ? (
                          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-md bg-green-100 dark:bg-green-900/30">
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-green-600 dark:text-green-400" />
                            <span className="text-xs sm:text-sm text-green-700 dark:text-green-300 hidden sm:inline">Taken</span>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleMarkTaken(med.id)}
                            size="sm"
                            className="h-9 px-3 sm:px-4 gap-1.5 w-full sm:w-auto"
                          >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs sm:text-sm">Take</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                onClick={() => setCurrentPage('add')}
                className="h-12 text-base bg-[#2196F3] hover:bg-[#1976D2] text-white touch-manipulation"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add Medication
              </Button>
              <Button
                onClick={() => setCurrentPage('medications-list')}
                variant="outline"
                className="h-12 text-base border-2 touch-manipulation"
              >
                <Pill className="w-5 h-5 mr-2" />
                All Medications
              </Button>
              <Button
                onClick={() => setCurrentPage('history')}
                variant="outline"
                className="h-12 text-base border-2 touch-manipulation"
              >
                <Activity className="w-5 h-5 mr-2" />
                History
              </Button>
            </div>
          </motion.div>

          {/* 💊 REFILL REMINDERS - CRITICAL ALERTS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-4"
          >
            <RefillReminderDashboard
              medications={medications}
              darkMode={darkMode}
              onCallPharmacy={(phone) => {
                window.location.href = `tel:${phone}`;
              }}
              onMarkRefilled={(medId) => {
                toast.success('Medication Refilled', {
                  description: 'Inventory updated successfully',
                });
              }}
            />
          </motion.div>

          {/* 📅 THIS WEEK SUMMARY - COLLAPSED BY DEFAULT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <Collapsible open={weeklyOpen} onOpenChange={setWeeklyOpen}>
              <CollapsibleTrigger asChild>
                <Card className={`p-4 cursor-pointer border-2 hover:shadow-md transition-shadow ${
                  darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-6 h-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} strokeWidth={2.5} />
                      <h2 className={`text-lg sm:text-xl ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        This Week Summary
                      </h2>
                    </div>
                    <motion.div
                      animate={{ rotate: weeklyOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-6 h-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    </motion.div>
                  </div>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3">
                  <Card className={`p-4 border-2 ${
                    darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                  }`}>
                    <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Weekly summary chart would go here
                    </p>
                  </Card>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* 💊 ALL MEDICATIONS - COLLAPSED BY DEFAULT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-4"
          >
            <Collapsible open={allMedsOpen} onOpenChange={setAllMedsOpen}>
              <CollapsibleTrigger asChild>
                <Card className={`p-4 cursor-pointer border-2 hover:shadow-md transition-shadow ${
                  darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-750' : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Pill className={`w-6 h-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} strokeWidth={2.5} />
                      <h2 className={`text-lg sm:text-xl ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        All Medications ({totalMedications})
                      </h2>
                    </div>
                    <motion.div
                      animate={{ rotate: allMedsOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className={`w-6 h-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                    </motion.div>
                  </div>
                </Card>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-3 space-y-2">
                  {medications.map((med, index) => (
                    <Card key={med.id || index} className={`p-3 border-2 ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-bold text-base sm:text-lg ${
                            darkMode ? 'text-white' : 'text-slate-900'
                          }`}>
                            {med.name}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-slate-400' : 'text-slate-600'
                          }`}>
                            {med.dosage} • {med.form}
                          </p>
                        </div>
                        <Button
                          onClick={() => setCurrentPage('medications')}
                          variant="ghost"
                          size="sm"
                          className="touch-manipulation"
                        >
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* Weekly Streak - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className={`p-4 text-center border-2 ${
              darkMode ? 'bg-gradient-to-r from-orange-950/30 to-red-950/30 border-orange-800' : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-200'
            }`}>
              <p className={`text-4xl sm:text-5xl mb-2`}>🔥</p>
              <p className={`text-xl sm:text-2xl mb-1 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                7 Day Streak
              </p>
              <p className={`text-sm sm:text-base ${
                darkMode ? 'text-orange-300' : 'text-orange-700'
              }`}>
                Keep up the great work!
              </p>
            </Card>
          </motion.div>
        
        </div> {/* Close grid div */}
        </div> {/* Close max-width container */}
      </div> {/* Close main wrapper */}

      {/* FAB (Floating Action Button) - Add Medication */}
      <FABButtons
        role="patient"
        onAddMedication={() => setCurrentPage('add')}
        darkMode={darkMode}
      />

      {/* Skip Dialog */}
      <AlertDialog open={skipDialogOpen} onOpenChange={setSkipDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Skip</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to skip {medicationToSkip?.name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSkipDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (medicationToSkip) {
                  handleSkipDose(medicationToSkip.id, medicationToSkip.name);
                }
                setSkipDialogOpen(false);
              }}
            >
              Skip
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}