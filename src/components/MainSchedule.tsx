import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Edit2, X, Trash2, Moon, Sun, Calendar as CalendarIcon, Clock, AlertCircle, ArrowRight, Pill, PlusCircle, Printer, Apple, Coffee, Utensils, MoreVertical, Share2, Download, Filter, Settings } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { playSoundEffect } from '../utils/soundEffects';
import { getAvatarUrl } from '../utils/avatarUtils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Button } from './ui/button';
import EmptyState from './EmptyState';
import SuccessState from './SuccessState';
import MedicationQuickActions from './MedicationQuickActions';
import { 
  updateMedicationStatuses, 
  shouldShowInTodayList, 
  canMarkMedicationTaken,
  calculateMedicationStatus
} from '../utils/medicationStatusManager';

interface MainScheduleProps {
  darkMode: boolean;
  setDarkMode?: (value: boolean) => void;
  setCurrentPage: (page: string) => void;
  medications: any[];
  setMedications: (meds: any[]) => void;
  setSelectedMedicationId: (id: number | null) => void;
  autoScroll?: boolean;
  currentUser?: any;
}

export default function MainSchedule({ darkMode, setDarkMode, setCurrentPage, medications, setMedications, setSelectedMedicationId, autoScroll = true, currentUser }: MainScheduleProps) {
  const userName = currentUser?.name || 'User';
  const userPhoto = currentUser?.photoUrl || getAvatarUrl({ 
    name: userName, 
    gender: currentUser?.gender 
  });
  const [expandedMedId, setExpandedMedId] = useState<number | null>(null);
  const [quickActionsId, setQuickActionsId] = useState<number | null>(null);
  const simplifiedMode = localStorage.getItem('simplifiedMode') === 'true';
  // In Simplified Mode, always show today
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Force today's date in simplified mode
  useEffect(() => {
    if (simplifiedMode) {
      setSelectedDate(new Date());
    }
  }, [simplifiedMode]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarExpanded, setCalendarExpanded] = useState(false);
  
  const getInitialTakenHistory = () => {
    const stored = localStorage.getItem('takenHistory');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return {};
      }
    }
    return {};
  };
  
  const [takenHistory, setTakenHistory] = useState<Record<string, Record<number, boolean>>>(getInitialTakenHistory());
  const medicationRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const toggleMedication = (id: number) => {
    const medication = medications.find(m => m.id === id);
    
    // Check if medication can be marked as taken (must be ACTIVE)
    if (!canMarkMedicationTaken(medication)) {
      const status = calculateMedicationStatus(medication);
      playSoundEffect('alert');
      
      if (status === 'COMPLETED') {
        toast.error('Cannot mark completed medication as taken', {
          description: `This medication course ended on ${medication?.endDate}`,
          duration: 3000,
        });
      } else if (status === 'SCHEDULED') {
        toast.error('Cannot mark scheduled medication as taken', {
          description: `This medication starts on ${medication?.startDate}`,
          duration: 3000,
        });
      } else {
        toast.error('Cannot mark this medication as taken', {
          description: 'This medication is not currently active',
          duration: 3000,
        });
      }
      return;
    }
    
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    const wasTaken = takenHistory[dateKey]?.[id] || false;
    
    const newHistory = {
      ...takenHistory,
      [dateKey]: {
        ...takenHistory[dateKey],
        [id]: !wasTaken
      }
    };
    
    setTakenHistory(newHistory);
    localStorage.setItem('takenHistory', JSON.stringify(newHistory));
    
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    
    if (!wasTaken) {
      playSoundEffect('success');
      toast.success('Medication marked as taken', {
        description: `${medication?.name} completed`,
        duration: 2000,
      });
      
      // Scroll to next untaken medication after current one only if autoScroll is enabled
      if (autoScroll) {
        setTimeout(() => {
          scrollToNextUntaken(id, newHistory);
        }, 1000);
      }
    } else {
      playSoundEffect('neutral');
      toast.info('Medication unmarked', {
        description: `${medication?.name} marked as not taken`,
        duration: 2000,
      });
    }
  };

  const handleMarkAllTaken = () => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    const newHistory = { ...takenHistory };
    let markedCount = 0;
    
    filteredMedications.forEach((med) => {
      if (!canMarkMedicationTaken(med)) return;
      
      med.times.forEach((time: string) => {
        const historyKey = `${med.id}-${time}`;
        if (!newHistory[dateKey]) newHistory[dateKey] = {};
        if (!newHistory[dateKey][historyKey]) {
          newHistory[dateKey][historyKey] = true;
          markedCount++;
        }
      });
    });
    
    if (markedCount > 0) {
      setTakenHistory(newHistory);
      localStorage.setItem('takenHistory', JSON.stringify(newHistory));
      playSoundEffect('achievement');
      toast.success(`${markedCount} medication${markedCount > 1 ? 's' : ''} marked as taken`, {
        description: 'Great job staying on track!',
        duration: 3000,
      });
      if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
    } else {
      toast.info('All medications already marked as taken');
    }
  };

  const handleEdit = (medId: number) => {
    setSelectedMedicationId(medId);
    setCurrentPage('edit');
  };

  const handleDelete = (medId: number) => {
    const medication = medications.find(m => m.id === medId);
    
    if (confirm(`Are you sure you want to delete ${medication?.name}?`)) {
      playSoundEffect('alert');
      setMedications(medications.filter(m => m.id !== medId));
      setExpandedMedId(null);
      
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast.success('Medication deleted', {
        description: `${medication?.name} has been removed`,
        duration: 2000,
      });
    }
  };

  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const handleDayClick = (day: number | null) => {
    if (day === null) return;
    
    const newDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(newDate);
    
    playSoundEffect('neutral');
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    
    toast.info(`Viewing schedule for ${newDate.toLocaleDateString()}`, {
      duration: 1500,
    });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedDate(newDate);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const monthName = selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const getDayAbbreviation = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };

  const dateKey = selectedDate.toISOString().split('T')[0];
  
  // Step 1: Update all medication statuses
  const medicationsWithStatus = updateMedicationStatuses(medications || []);
  
  // Step 2: Filter only ACTIVE medications that should show in Today list
  const filteredMedications = medicationsWithStatus
    .filter(med => shouldShowInTodayList(med))
    .filter(med => {
      if (!med.daysOfWeek) return true;
      
      const selectedDay = getDayAbbreviation(selectedDate);
      const dayMap: Record<string, keyof typeof med.daysOfWeek> = {
        'Sun': 'sun',
        'Mon': 'mon',
        'Tue': 'tue',
        'Wed': 'wed',
        'Thu': 'thu',
        'Fri': 'fri',
        'Sat': 'sat'
      };
      
      const dayKey = dayMap[selectedDay];
      return dayKey ? med.daysOfWeek[dayKey] : true;
    })
    .map(med => ({
      ...med,
      taken: takenHistory[dateKey]?.[med.id] || false
    }))
    .sort((a, b) => {
      // First, sort by taken status (untaken first)
      if (a.taken !== b.taken) {
        return a.taken ? 1 : -1;
      }
      
      // Then by time
      const timeCompare = a.time.localeCompare(b.time);
      if (timeCompare !== 0) return timeCompare;
      
      // Then by meal timing (before → with → after → anytime)
      const mealTimingOrder = {
        'before meal': 1,
        'with meal': 2,
        'after meal': 3,
        'anytime': 4
      };
      const aMealOrder = mealTimingOrder[a.mealTiming as keyof typeof mealTimingOrder] || 5;
      const bMealOrder = mealTimingOrder[b.mealTiming as keyof typeof mealTimingOrder] || 5;
      if (aMealOrder !== bMealOrder) {
        return aMealOrder - bMealOrder;
      }
      
      // Finally by name (alphabetically)
      return a.name.localeCompare(b.name);
    });

  const untakenMedications = filteredMedications.filter(med => !med.taken);
  const takenMedications = filteredMedications.filter(med => med.taken);

  // Helper function to check if medication time has passed
  const isTimePassed = (medTime: string): boolean => {
    if (!medTime) return false;
    const now = new Date();
    const [hours, minutes] = medTime.split(':').map(Number);
    const medDate = new Date(selectedDate);
    medDate.setHours(hours, minutes, 0, 0);
    
    // Only show as overdue if it's today
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    return now > medDate;
  };

  // Helper function to check if it's within 1 hour
  const isWithinHour = (medTime: string): boolean => {
    if (!medTime) return false;
    const now = new Date();
    const [hours, minutes] = medTime.split(':').map(Number);
    const medDate = new Date(selectedDate);
    medDate.setHours(hours, minutes, 0, 0);
    
    // Only for today
    if (selectedDate.toDateString() !== today.toDateString()) {
      return false;
    }
    
    const diffMinutes = (medDate.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes >= 0 && diffMinutes <= 60;
  };

  // Count overdue medications (only for today)
  const overdueMedications = selectedDate.toDateString() === today.toDateString()
    ? untakenMedications.filter(med => isTimePassed(med.time))
    : [];

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Get next upcoming medication
  const getNextMedication = () => {
    if (selectedDate.toDateString() !== today.toDateString()) return null;
    
    const now = new Date();
    const upcoming = untakenMedications
      .filter(med => {
        if (!med.time) return false;
        const [hours, minutes] = med.time.split(':').map(Number);
        const medDate = new Date();
        medDate.setHours(hours, minutes, 0, 0);
        return medDate > now;
      })
      .sort((a, b) => a.time.localeCompare(b.time));
    
    return upcoming[0] || null;
  };

  const nextMed = getNextMedication();

  // Calculate time until next medication
  const getTimeUntil = (medTime: string) => {
    const now = new Date();
    const [hours, minutes] = medTime.split(':').map(Number);
    const medDate = new Date();
    medDate.setHours(hours, minutes, 0, 0);
    
    const diffMs = medDate.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 0) return 'Now';
    if (diffMins < 60) return `in ${diffMins}m`;
    
    const hours_left = Math.floor(diffMins / 60);
    const mins_left = diffMins % 60;
    return `in ${hours_left}h ${mins_left}m`;
  };

  // Swipe handlers
  const handleSwipeRight = (medId: number) => {
    toggleMedication(medId);
    playSoundEffect('success');
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handleSwipeLeft = (medId: number) => {
    handleDelete(medId);
  };

  const scrollToFirstUntaken = () => {
    const firstUntakenMed = filteredMedications.find(med => !med.taken);
    if (firstUntakenMed) {
      setTimeout(() => {
        const targetElement = medicationRefs.current[firstUntakenMed.id];
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest'
          });
          
          setTimeout(() => {
            const rect = targetElement.getBoundingClientRect();
            const absoluteTop = rect.top + window.pageYOffset;
            const headerOffset = 120;
            const targetPosition = Math.max(0, absoluteTop - headerOffset);
            
            window.scrollTo(0, targetPosition);
          }, 100);
        }
      }, 300);
    }
  };

  const scrollToNextUntaken = (currentId: number, updatedHistory: Record<string, Record<number, boolean>>) => {
    const dateKey = selectedDate.toISOString().split('T')[0];
    
    const updatedMedications = medications
      .filter(med => {
        if (!med.daysOfWeek) return true;
        
        const selectedDay = getDayAbbreviation(selectedDate);
        const dayMap: Record<string, keyof typeof med.daysOfWeek> = {
          'Sun': 'sun',
          'Mon': 'mon',
          'Tue': 'tue',
          'Wed': 'wed',
          'Thu': 'thu',
          'Fri': 'fri',
          'Sat': 'sat'
        };
        
        const dayKey = dayMap[selectedDay];
        return dayKey ? med.daysOfWeek[dayKey] : true;
      })
      .map(med => ({
        ...med,
        taken: updatedHistory[dateKey]?.[med.id] || false
      }))
      .sort((a, b) => {
        const timeCompare = a.time.localeCompare(b.time);
        if (timeCompare !== 0) return timeCompare;
        return a.name.localeCompare(b.name);
      });
    
    const nextUntakenMed = updatedMedications.find(med => !med.taken);
    
    if (nextUntakenMed) {
      const targetElement = medicationRefs.current[nextUntakenMed.id];
      if (targetElement) {
        try {
          targetElement.scrollIntoView({
            behavior: 'auto',
            block: 'center',
            inline: 'nearest'
          });
        } catch (e) {
          // Fallback
        }
        
        setTimeout(() => {
          const rect = targetElement.getBoundingClientRect();
          const absoluteTop = rect.top + window.pageYOffset;
          const headerOffset = 120;
          const targetPosition = Math.max(0, absoluteTop - headerOffset);
          
          window.scrollTo(0, targetPosition);
        }, 100);
      }
    }
  };

  useEffect(() => {
    scrollToFirstUntaken();
  }, [selectedDate]);

  return (
    <div className={`min-h-screen pb-20 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      <div className={`shadow-sm sticky top-0 z-10 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {/* User info without avatar (photo only in TopBar) */}
            <div className="flex flex-col">
              <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {userName}
              </span>
              <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            {/* Print Week Schedule Button */}
            <button
              onClick={() => setCurrentPage('print')}
              className={`p-3 sm:p-3.5 rounded-full transition-all min-w-[56px] min-h-[56px] sm:min-w-[60px] sm:min-h-[60px] flex items-center justify-center touch-manipulation ${
                darkMode 
                  ? 'bg-blue-900/30 hover:bg-blue-900/50 text-blue-300' 
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              }`}
              aria-label="Print Week Schedule"
              title="Print Week Schedule"
            >
              <Printer size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />
            </button>
            
            {setDarkMode && (
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-3 sm:p-3.5 rounded-full transition-all min-w-[56px] min-h-[56px] sm:min-w-[60px] sm:min-h-[60px] flex items-center justify-center touch-manipulation ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} /> : <Moon size={24} className="sm:w-7 sm:h-7" strokeWidth={2.5} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 sm:px-4 py-2">
        <div className="max-w-4xl mx-auto">
          {/* Medications list */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>
                {selectedDate.toDateString() === today.toDateString() ? "Today's Schedule" : "Schedule for " + selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </h2>
              
              <div className="flex items-center gap-2">
                {/* Mark All as Taken button - only show if there are untaken medications */}
                {untakenMedications.length > 0 && (
                  <button
                    onClick={handleMarkAllTaken}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm sm:text-base font-medium touch-manipulation ${
                      darkMode 
                        ? 'bg-green-900/30 hover:bg-green-900/50 text-green-300 border-2 border-green-700' 
                        : 'bg-green-50 hover:bg-green-100 text-green-700 border-2 border-green-200'
                    }`}
                    title="Mark all medications as taken"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Mark All</span>
                  </button>
                )}
                
                {/* 3-Dot Menu - More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-10 sm:h-12 px-3 border-2"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setCurrentPage('print')}>
                      <Printer className="w-4 h-4 mr-2" />
                      Print Schedule
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      toast.info('Export to PDF', {
                        description: 'PDF export coming soon!',
                        duration: 2000
                      });
                    }}>
                      <Download className="w-4 h-4 mr-2" />
                      Export to PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      toast.info('Share Schedule', {
                        description: 'Share feature coming soon!',
                        duration: 2000
                      });
                    }}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Schedule
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setCurrentPage('settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>


            
            {filteredMedications.length === 0 ? (
              <EmptyState
                icon={CalendarIcon}
                title={selectedDate.toDateString() === today.toDateString() 
                  ? "No Medications for Today" 
                  : "No Medications for This Day"}
                description={selectedDate.toDateString() === today.toDateString()
                  ? "You don't have any medications scheduled for today. Add medications to your schedule."
                  : `No medications scheduled for ${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}. Select another day or add medications.`}
                actionLabel="Add Medication"
                onAction={() => setCurrentPage('add')}
                darkMode={darkMode}
              />
            ) : (
              <>
                {/* Untaken medications */}
                {untakenMedications.length > 0 && (
                  <div className="space-y-2 sm:space-y-3">
                      <AnimatePresence>
                        {untakenMedications.map((med) => {
                          const timePassed = isTimePassed(med.time);
                          const withinHour = isWithinHour(med.time);
                          
                          return (
                            <motion.div
                              key={med.id}
                              ref={(el) => {
                                medicationRefs.current[med.id] = el;
                              }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0, x: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              drag="x"
                              dragConstraints={{ left: 0, right: 0 }}
                              dragElastic={0.2}
                              onDragEnd={(e, info: PanInfo) => {
                                if (info.offset.x > 100) {
                                  handleSwipeRight(med.id);
                                } else if (info.offset.x < -100) {
                                  handleSwipeLeft(med.id);
                                }
                              }}
                              className={`rounded-xl shadow-sm border-2 p-3 sm:p-4 cursor-grab active:cursor-grabbing ${
                                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 sm:gap-4">
                                {/* Checkbox - Color-coded by meal timing */}
                                <button
                                  onClick={() => toggleMedication(med.id)}
                                  className={`flex-shrink-0 min-w-[56px] min-h-[56px] w-[56px] h-[56px] sm:min-w-[60px] sm:min-h-[60px] sm:w-[60px] sm:h-[60px] rounded-full border-[3px] transition-all touch-manipulation ${
                                    darkMode ? 'border-green-500 hover:border-green-400' : 'border-green-500 hover:border-green-600'
                                  } ${
                                    // Fill color based on meal timing
                                    med.mealTiming === 'before meal' ? 'bg-red-500' :
                                    med.mealTiming === 'with meal' ? 'bg-yellow-400' :
                                    med.mealTiming === 'after meal' ? 'bg-green-500' :
                                    darkMode ? 'bg-gray-800' : 'bg-white' // anytime = white/dark gray
                                  }`}
                                  aria-label="Mark as taken"
                                />

                                {/* Content - NEW layout with time on left */}
                                <div className="flex-1 min-w-0 flex flex-col gap-1 sm:gap-1.5">
                                  {/* Row 1: Medication name - ELLIPSIS for elderly readability */}
                                  <h3 className={`text-2xl sm:text-3xl font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`} title={med.name}>
                                    {med.name}
                                  </h3>
                                  
                                  {/* Row 2: Dosage • Time • Meal Icon on left, Actions on right */}
                                  <div className="flex items-center justify-between gap-3">
                                    {/* Left: Dosage • Time • Meal Icon */}
                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                      <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {med.dosage}
                                      </p>
                                      
                                      {/* Separator bullet */}
                                      <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                                      
                                      {/* Time (moved to left) */}
                                      {med.time && (
                                        <span className="whitespace-nowrap text-[#2196F3] font-bold flex items-center gap-1">
                                          <Clock size={16} />
                                          {med.time}
                                        </span>
                                      )}
                                      
                                      {/* Meal Timing Icon */}
                                      {med.mealTiming && med.mealTiming !== 'anytime' && (
                                        <>
                                          <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                                          <span 
                                            className="flex items-center gap-1 text-[#FB923C]"
                                            title={
                                              med.mealTiming === 'before meal' ? 'Before meal' :
                                              med.mealTiming === 'with meal' ? 'With meal' :
                                              med.mealTiming === 'after meal' ? 'After meal' :
                                              med.mealTiming
                                            }
                                          >
                                            {med.mealTiming === 'before meal' && <Apple size={18} strokeWidth={2.5} />}
                                            {med.mealTiming === 'with meal' && <Utensils size={18} strokeWidth={2.5} />}
                                            {med.mealTiming === 'after meal' && <Coffee size={18} strokeWidth={2.5} />}
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {/* Right: Edit & Delete Buttons */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {/* Edit Button */}
                                      <button
                                        onClick={() => handleEdit(med.id)}
                                        className={`min-w-[56px] min-h-[56px] w-[56px] h-[56px] flex items-center justify-center rounded-lg border-2 transition-all touch-manipulation ${
                                          darkMode 
                                            ? 'border-gray-700 hover:bg-blue-950/30 hover:border-blue-600 text-gray-400 hover:text-blue-400' 
                                            : 'border-gray-200 hover:bg-blue-50 hover:border-blue-400 text-gray-600 hover:text-blue-600'
                                        }`}
                                        aria-label="Edit medication"
                                      >
                                        <Edit2 size={24} strokeWidth={2.5} />
                                      </button>

                                      {/* Delete Button */}
                                      <button
                                        onClick={() => {
                                          if (confirm(`Are you sure you want to delete ${med.name}?\n\nThis action cannot be undone.`)) {
                                            handleDelete(med.id);
                                          }
                                        }}
                                        className={`min-w-[56px] min-h-[56px] w-[56px] h-[56px] flex items-center justify-center rounded-lg border-2 transition-all touch-manipulation ${
                                          darkMode 
                                            ? 'border-gray-700 hover:bg-red-950/30 hover:border-red-600 text-gray-400 hover:text-red-400' 
                                            : 'border-gray-200 hover:bg-red-50 hover:border-red-400 text-gray-600 hover:text-red-600'
                                        }`}
                                        aria-label="Delete medication"
                                      >
                                        <Trash2 size={24} strokeWidth={2.5} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                )}

                {/* Divider between untaken and taken */}
                {untakenMedications.length > 0 && takenMedications.length > 0 && (
                  <div className="my-2 flex items-center gap-2">
                    <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                    <span className={`uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Done
                    </span>
                    <div className={`flex-1 h-px ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                  </div>
                )}

                {/* Taken medications */}
                {takenMedications.length > 0 && (
                  <div className="space-y-1 sm:space-y-1.5">
                    <AnimatePresence>
                      {takenMedications.map((med) => (
                        <motion.div
                          key={med.id}
                          ref={(el) => {
                            medicationRefs.current[med.id] = el;
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`rounded-lg shadow-sm border opacity-50 p-2 ${
                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                          }`}
                        >
                          {/* Compact view for taken medications */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleMedication(med.id)}
                              className="flex-shrink-0 min-w-[40px] min-h-[40px] w-[40px] h-[40px] sm:min-w-[44px] sm:min-h-[44px] sm:w-[44px] sm:h-[44px] rounded-full border-2 bg-[#2196F3] border-[#2196F3] transition-all touch-manipulation"
                              aria-label="Mark as not taken"
                            >
                              <svg className="w-full h-full text-white p-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            
                            <div className="flex-1 min-w-0 overflow-hidden flex flex-col gap-0.5">
                              <h3 className={`text-xl sm:text-2xl font-bold line-through truncate ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {med.name}
                              </h3>
                              
                              {/* Time and Meal Icon for taken meds */}
                              <div className="flex items-center gap-1.5 text-sm">
                                {med.time && (
                                  <span className={`whitespace-nowrap font-bold flex items-center gap-1 ${
                                    darkMode ? 'text-gray-500' : 'text-gray-500'
                                  }`}>
                                    <Clock size={12} />
                                    {med.time}
                                  </span>
                                )}
                                
                                {med.mealTiming && med.mealTiming !== 'anytime' && med.time && (
                                  <span className={darkMode ? 'text-gray-600' : 'text-gray-400'}>•</span>
                                )}
                                
                                {med.mealTiming && med.mealTiming !== 'anytime' && (
                                  <span className="flex items-center gap-1 text-gray-500">
                                    {med.mealTiming === 'before meal' && <Apple size={14} strokeWidth={2.5} />}
                                    {med.mealTiming === 'with meal' && <Utensils size={14} strokeWidth={2.5} />}
                                    {med.mealTiming === 'after meal' && <Coffee size={14} strokeWidth={2.5} />}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Edit & Delete buttons for taken meds */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {/* Edit Button */}
                              <button
                                onClick={() => handleEdit(med.id)}
                                className={`min-w-[48px] min-h-[48px] w-[48px] h-[48px] flex items-center justify-center rounded-lg border-2 transition-all touch-manipulation ${
                                  darkMode 
                                    ? 'border-gray-700 hover:bg-blue-950/30 hover:border-blue-600 text-gray-500 hover:text-blue-400' 
                                    : 'border-gray-200 hover:bg-blue-50 hover:border-blue-400 text-gray-500 hover:text-blue-600'
                                }`}
                                aria-label="Edit medication"
                              >
                                <Edit2 size={20} strokeWidth={2.5} />
                              </button>

                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to delete ${med.name}?\n\nThis action cannot be undone.`)) {
                                    handleDelete(med.id);
                                  }
                                }}
                                className={`min-w-[48px] min-h-[48px] w-[48px] h-[48px] flex items-center justify-center rounded-lg border-2 transition-all touch-manipulation ${
                                  darkMode 
                                    ? 'border-gray-700 hover:bg-red-950/30 hover:border-red-600 text-gray-500 hover:text-red-400' 
                                    : 'border-gray-200 hover:bg-red-50 hover:border-red-400 text-gray-500 hover:text-red-600'
                                }`}
                                aria-label="Delete medication"
                              >
                                <Trash2 size={20} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Date Navigation - Compact version */}
          {!simplifiedMode && (
            <div className={`shadow-sm rounded-lg p-2 mt-2 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              {/* Date selector with arrows */}
              <div className="flex items-center justify-between gap-1">
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() - 1);
                    setSelectedDate(newDate);
                  }}
                  className={`min-w-[44px] min-h-[44px] p-2 rounded-lg transition-colors touch-manipulation flex items-center justify-center ${
                    darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  aria-label="Previous day"
                >
                  <ChevronLeft size={22} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                </button>
                
                <button
                  onClick={() => setCalendarExpanded(!calendarExpanded)}
                  className="flex-1 flex flex-col items-center py-1 rounded-lg hover:bg-gray-100/50 transition-colors touch-manipulation min-h-[44px] justify-center"
                >
                  <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                  </span>
                </button>
                
                <button
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(newDate.getDate() + 1);
                    setSelectedDate(newDate);
                  }}
                  className={`min-w-[44px] min-h-[44px] p-2 rounded-lg transition-colors touch-manipulation flex items-center justify-center ${
                    darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  aria-label="Next day"
                >
                  <ChevronRight size={22} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                </button>
              </div>

            <AnimatePresence>
              {calendarExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2 pt-2">
                    <button
                      onClick={() => changeMonth('prev')}
                      className={`min-w-[40px] min-h-[40px] p-2 rounded-lg transition-colors touch-manipulation ${
                        darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
                      }`}
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                    </button>
                    <h4 className={darkMode ? 'text-white' : 'text-gray-900'}>
                      {monthName}
                    </h4>
                    <button
                      onClick={() => changeMonth('next')}
                      className={`min-w-[40px] min-h-[40px] p-2 rounded-lg transition-colors touch-manipulation ${
                        darkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
                      }`}
                      aria-label="Next month"
                    >
                      <ChevronRight size={20} className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
                    </button>
                  </div>
            
                  <div className="grid grid-cols-7 gap-1 mb-1.5">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                      <div key={index} className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                        {day}
                      </div>
                    ))}
                  </div>
            
                  <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                      const isToday = day !== null && 
                        day === today.getDate() && 
                        selectedDate.getMonth() === today.getMonth() && 
                        selectedDate.getFullYear() === today.getFullYear();
                      
                      const isSelected = day !== null && day === selectedDate.getDate();
                      
                      // Check medication status for this day
                      const dayDate = day !== null ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day) : null;
                      const dayKey = dayDate ? dayDate.toISOString().split('T')[0] : null;
                      
                      let dotColor = '';
                      if (day !== null && dayDate) {
                        const dayOfWeek = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][dayDate.getDay()];
                        const dayMedications = medications.filter(med => 
                          med.daysOfWeek && med.daysOfWeek[dayOfWeek]
                        );
                        
                        if (dayMedications.length > 0 && dayKey) {
                          const takenCount = dayMedications.filter(med => 
                            takenHistory[dayKey]?.[med.id]
                          ).length;
                          
                          if (takenCount === dayMedications.length) {
                            // All medications taken - green
                            dotColor = 'bg-green-500';
                          } else if (takenCount > 0) {
                            // Some medications taken - yellow
                            dotColor = 'bg-yellow-500';
                          } else {
                            // No medications taken - check if it's past date
                            const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                            dotColor = isPast ? 'bg-red-500' : 'bg-blue-500';
                          }
                        }
                      }
                      
                      return (
                        <button
                          key={index}
                          onClick={() => handleDayClick(day)}
                          disabled={day === null}
                          className={`
                            aspect-square min-h-[32px] rounded-lg
                            transition-all touch-manipulation flex flex-col items-center justify-center relative
                            ${day === null ? 'invisible' : ''}
                            ${isSelected 
                              ? 'bg-[#2196F3] text-white shadow-md' 
                              : isToday
                                ? darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
                                : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-900 hover:bg-gray-100'
                            }
                            ${day !== null ? 'active:scale-95' : ''}
                          `}
                        >
                          {day}
                          {dotColor && (
                            <div className={`absolute bottom-0.5 w-1 h-1 rounded-full ${
                              isSelected ? 'bg-white' : dotColor
                            }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Calendar legend */}
                  <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-1.5" style={{ borderColor: darkMode ? '#374151' : '#E5E7EB' }}>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>All taken</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Partial</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Scheduled</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Missed</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions Modal */}
      {quickActionsId !== null && (
        <MedicationQuickActions
          medicationId={quickActionsId}
          medication={medications.find(m => m.id === quickActionsId)}
          darkMode={darkMode}
          onClose={() => setQuickActionsId(null)}
          onMarkTaken={() => {
            toggleMedication(quickActionsId);
            setQuickActionsId(null);
          }}
          onEdit={() => {
            handleEdit(quickActionsId);
            setQuickActionsId(null);
          }}
          onDelete={() => {
            handleDelete(quickActionsId);
            setQuickActionsId(null);
          }}
          onDuplicate={(id) => {
            const med = medications.find(m => m.id === id);
            if (med) {
              const newMed = {
                ...med,
                id: Date.now(),
                name: `${med.name} (Copy)`
              };
              setMedications([...medications, newMed]);
              toast.success('Medication duplicated', {
                description: `${med.name} has been copied`,
                duration: 2000
              });
            }
            setQuickActionsId(null);
          }}
          onPrint={(id) => {
            const med = medications.find(m => m.id === id);
            if (med) {
              toast.info('Opening print preview...', { duration: 1500 });
              setTimeout(() => {
                setCurrentPage('print');
              }, 500);
            }
            setQuickActionsId(null);
          }}
          onViewDetails={(id) => {
            toast.info('Opening medication details...', { duration: 1500 });
            setQuickActionsId(null);
          }}
        />
      )}
    </div>
  );
}