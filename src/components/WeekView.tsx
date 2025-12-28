import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Calendar, Pill, Check, CalendarDays, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import EmptyState from './EmptyState';

interface Medication {
  id: number;
  name: string;
  dosage: string;
  times: string[];
  color?: string;
  mealTiming?: string;
}

interface WeekViewProps {
  medications: Medication[];
  onMarkTaken: (medId: number, date: string, time: string) => void;
  darkMode: boolean;
  setCurrentPage?: (page: string) => void;
  currentUser?: any;
}

export default function WeekView({ medications, onMarkTaken, darkMode, setCurrentPage, currentUser }: WeekViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Start from Monday
    return new Date(today.setDate(diff));
  });

  const [filterStatus, setFilterStatus] = useState<'all' | 'taken' | 'missed'>('all');
  const [filterMealTiming, setFilterMealTiming] = useState<string>('all');

  // Generate week days (Monday - Sunday)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);
    return date;
  });

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const goToToday = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    setCurrentWeekStart(new Date(today.setDate(diff)));
    if ('vibrate' in navigator) navigator.vibrate(30);
    toast.success('Jumped to current week');
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatWeekRange = () => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);
    return `${formatDate(currentWeekStart)} - ${formatDate(end)}`;
  };

  // Get all unique times from medications
  const getAllTimes = () => {
    const timesSet = new Set<string>();
    medications.forEach(med => {
      med.times?.forEach(time => timesSet.add(time));
    });
    return Array.from(timesSet).sort();
  };

  const allTimes = getAllTimes();

  // Get medications for specific time (with filters for a given date)
  const getMedicationsForTime = (time: string, date?: Date) => {
    let meds = medications.filter(med => med.times?.includes(time));

    // Apply meal timing filter
    if (filterMealTiming !== 'all') {
      meds = meds.filter(med => {
        if (!med.mealTiming) return false;
        
        // Normalize both values for comparison
        // Database stores: "before", "with", "after", "anytime"
        // Filter uses: "before meal", "with meal", "after meal"
        const medTiming = med.mealTiming.toLowerCase().trim();
        const filterTiming = filterMealTiming.toLowerCase().trim();
        
        // Match both "before" and "before meal"
        return medTiming === filterTiming || 
               medTiming === filterTiming.replace(' meal', '') ||
               `${medTiming} meal` === filterTiming;
      });
    }

    // Apply status filter (only if date provided)
    if (date && filterStatus !== 'all') {
      meds = meds.filter(med => {
        const taken = isMedicationTaken(med.id, date, time);
        return filterStatus === 'taken' ? taken : !taken;
      });
    }

    return meds.sort((a, b) => {
      // Sort by meal timing (before → with → after → anytime)
      const mealTimingOrder = {
        'before': 1,
        'before meal': 1,
        'with': 2,
        'with meal': 2,
        'after': 3,
        'after meal': 3,
        'anytime': 4
      };
      const aMealOrder = mealTimingOrder[a.mealTiming?.toLowerCase() as keyof typeof mealTimingOrder] || 5;
      const bMealOrder = mealTimingOrder[b.mealTiming?.toLowerCase() as keyof typeof mealTimingOrder] || 5;
      if (aMealOrder !== bMealOrder) {
        return aMealOrder - bMealOrder;
      }
      
      // Then by name (alphabetically)
      return a.name.localeCompare(b.name);
    });
  };

  // Check if medication was taken
  const isMedicationTaken = (medId: number, date: Date, time: string) => {
    const dateKey = date.toISOString().split('T')[0];
    const storedHistory = localStorage.getItem('takenHistory');
    const takenHistory = storedHistory ? JSON.parse(storedHistory) : {};
    
    // Ensure we have an array before calling includes
    const medHistory = takenHistory[dateKey]?.[medId];
    return Array.isArray(medHistory) && medHistory.includes(time);
  };

  // Handle medication check
  const handleMedicationCheck = (medId: number, date: Date, time: string, currentlyTaken: boolean) => {
    const dateKey = date.toISOString().split('T')[0];
    const storedHistory = localStorage.getItem('takenHistory');
    const takenHistory = storedHistory ? JSON.parse(storedHistory) : {};
    
    if (!takenHistory[dateKey]) {
      takenHistory[dateKey] = {};
    }
    
    // Ensure we have an array - fix any corrupted data
    if (!Array.isArray(takenHistory[dateKey][medId])) {
      takenHistory[dateKey][medId] = [];
    }
    
    if (currentlyTaken) {
      // Remove from taken list
      takenHistory[dateKey][medId] = takenHistory[dateKey][medId].filter((t: string) => t !== time);
      toast.info('Marked as not taken');
    } else {
      // Add to taken list
      if (!takenHistory[dateKey][medId].includes(time)) {
        takenHistory[dateKey][medId].push(time);
      }
      toast.success('Marked as taken');
      if ('vibrate' in navigator) navigator.vibrate(50);
    }
    
    localStorage.setItem('takenHistory', JSON.stringify(takenHistory));
    onMarkTaken(medId, dateKey, time);
  };

  const handlePrint = () => {
    // Prepare data for print page
    const printData = {
      personName: currentUser?.name || 'User',
      weekStart: currentWeekStart.toISOString(),
      weekEnd: new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      prescriptions: medications.map(med => ({
        id: med.id,
        name: med.name,
        dosage: med.dosage,
        time: med.times?.[0] || '08:00',
        times: med.times,
        mealTiming: med.mealTiming,
        days: {
          mon: true,
          tue: true,
          wed: true,
          thu: true,
          fri: true,
          sat: true,
          sun: true
        }
      }))
    };
    
    // Save to localStorage for PrintSchedule to read
    localStorage.setItem('printScheduleData', JSON.stringify(printData));
    
    // Navigate to print page
    if (setCurrentPage) {
      setCurrentPage('print');
      toast.success('Print preview loaded', {
        description: `Schedule for ${currentUser?.name || 'User'}`
      });
    }
  };

  // Calculate weekly statistics
  const calculateWeeklyStats = () => {
    const takenHistory = JSON.parse(localStorage.getItem('takenHistory') || '{}');
    
    let totalDoses = 0;
    let takenDoses = 0;
    
    weekDays.forEach(day => {
      if (day <= new Date()) {
        medications.forEach(med => {
          const dosesPerDay = med.times?.length || 1;
          totalDoses += dosesPerDay;
          
          const dateKey = day.toISOString().split('T')[0];
          const medTaken = takenHistory[dateKey]?.[med.id];
          
          if (Array.isArray(medTaken)) {
            takenDoses += medTaken.length;
          } else if (medTaken === true) {
            takenDoses += dosesPerDay;
          }
        });
      }
    });
    
    const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
    const missedDoses = totalDoses - takenDoses;
    
    return { totalDoses, takenDoses, missedDoses, adherenceRate };
  };

  const weeklyStats = calculateWeeklyStats();

  // Empty state - no medications at all
  if (medications.length === 0) {
    return (
      <div className={`min-h-screen pb-24 lg:pb-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}>
          <div className="max-w-7xl mx-auto">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Week View
            </h1>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState
            icon={CalendarDays}
            title="No Weekly Schedule"
            description="Add medications to see your weekly schedule and plan ahead for the entire week."
            actionLabel={setCurrentPage ? "Add Medication" : undefined}
            onAction={setCurrentPage ? () => setCurrentPage('add') : undefined}
            darkMode={darkMode}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pb-24 lg:pb-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-4 sm:px-6 lg:px-8 py-4 sm:py-6`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Week View
            </h1>
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="h-12 sm:h-14 px-4 sm:px-6"
              >
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="hidden sm:inline">Print</span>
              </Button>
              <Button
                onClick={goToToday}
                className="h-12 sm:h-14 px-4 sm:px-6 bg-[#2196F3] hover:bg-[#1976D2] text-white"
              >
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Today
              </Button>
            </div>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={goToPreviousWeek}
              variant="outline"
              className="h-12 sm:h-14 px-4 sm:px-6 touch-manipulation"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline ml-2">Previous</span>
            </Button>

            <div className="flex-1 text-center">
              <p className={`text-lg sm:text-xl lg:text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatWeekRange()}
              </p>
            </div>

            <Button
              onClick={goToNextWeek}
              variant="outline"
              className="h-12 sm:h-14 px-4 sm:px-6 touch-manipulation"
            >
              <span className="hidden sm:inline mr-2">Next</span>
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setFilterStatus('all')}
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                All
              </Button>
              <Button
                onClick={() => setFilterStatus('taken')}
                variant={filterStatus === 'taken' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                Taken
              </Button>
              <Button
                onClick={() => setFilterStatus('missed')}
                variant={filterStatus === 'missed' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                Missed
              </Button>
            </div>

            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setFilterMealTiming('all')}
                variant={filterMealTiming === 'all' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                All Meals
              </Button>
              <Button
                onClick={() => setFilterMealTiming('before meal')}
                variant={filterMealTiming === 'before meal' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                Before
              </Button>
              <Button
                onClick={() => setFilterMealTiming('with meal')}
                variant={filterMealTiming === 'with meal' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                With
              </Button>
              <Button
                onClick={() => setFilterMealTiming('after meal')}
                variant={filterMealTiming === 'after meal' ? 'default' : 'outline'}
                className="h-10 sm:h-12 px-3 sm:px-4 text-sm sm:text-base"
              >
                After
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Schedule Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Weekly Statistics Card */}
        <Card className={`mb-6 p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weekly Statistics
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weeklyStats.adherenceRate}%
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Adherence
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weeklyStats.takenDoses}
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Taken
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weeklyStats.missedDoses}
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Missed
              </div>
            </div>
            
            <div className={`p-3 sm:p-4 lg:p-5 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className={`text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {weeklyStats.totalDoses}
              </div>
              <div className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total
              </div>
            </div>
          </div>

          <div className={`mt-4 h-2 sm:h-3 lg:h-4 rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full bg-[#2196F3] transition-all duration-500"
              style={{ width: `${weeklyStats.adherenceRate}%` }}
            />
          </div>
        </Card>
        
        <Card className={`overflow-x-auto ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className={`sticky left-0 z-10 p-3 sm:p-4 text-left font-bold border-2 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-blue-50 border-gray-300 text-gray-900'
                  }`} style={{ minWidth: '80px' }}>
                    Time
                  </th>
                  {weekDays.map((date, index) => (
                    <th
                      key={index}
                      className={`p-3 sm:p-4 text-center font-bold border-2 ${
                        isToday(date)
                          ? darkMode
                            ? 'bg-blue-900/50 border-blue-500 text-blue-200'
                            : 'bg-blue-100 border-blue-400 text-blue-900'
                          : darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-blue-50 border-gray-300 text-gray-900'
                      }`}
                      style={{ minWidth: '100px' }}
                    >
                      <div className="text-sm sm:text-base font-bold">{dayNames[index]}</div>
                      <div className={`text-xs sm:text-sm ${
                        isToday(date) 
                          ? darkMode ? 'text-blue-300' : 'text-blue-700'
                          : darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {date.getDate()}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allTimes.map((time, timeIndex) => {
                  // Get medications for this time (filtering will happen per day)
                  
                  return (
                    <tr key={timeIndex}>
                      {/* Time column */}
                      <td className={`sticky left-0 z-10 p-3 sm:p-4 font-bold border-2 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-200' 
                          : 'bg-gray-50 border-gray-300 text-gray-900'
                      }`}>
                        <div className="text-sm sm:text-base whitespace-nowrap">{time}</div>
                      </td>
                      
                      {/* Day columns */}
                      {weekDays.map((date, dayIndex) => {
                        const medsAtTime = getMedicationsForTime(time, date);
                        return (
                        <td
                          key={dayIndex}
                          className={`p-2 sm:p-3 border-2 align-top ${
                            isToday(date)
                              ? darkMode
                                ? 'bg-blue-950/30 border-blue-500/50'
                                : 'bg-blue-50/50 border-blue-200'
                              : darkMode
                                ? 'bg-gray-800 border-gray-700'
                                : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="space-y-2">
                            {medsAtTime.map((med) => {
                              const taken = isMedicationTaken(med.id, date, time);
                              
                              return (
                                <div
                                  key={med.id}
                                  className={`p-2 rounded-lg border transition-all ${
                                    taken
                                      ? darkMode
                                        ? 'bg-green-900/30 border-green-700'
                                        : 'bg-green-50 border-green-200'
                                      : darkMode
                                        ? 'bg-gray-700/50 border-gray-600'
                                        : 'bg-white border-gray-300'
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <Checkbox
                                      checked={taken}
                                      onCheckedChange={() => handleMedicationCheck(med.id, date, time, taken)}
                                      className={`mt-0.5 flex-shrink-0 ${
                                        darkMode 
                                          ? 'border-gray-500 data-[state=checked]:bg-green-600' 
                                          : 'border-gray-400 data-[state=checked]:bg-green-600'
                                      }`}
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className={`text-xs sm:text-sm font-bold leading-tight ${
                                        darkMode ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {med.name}
                                      </p>
                                      <p className={`text-xs leading-tight ${
                                        darkMode ? 'text-gray-400' : 'text-gray-600'
                                      }`}>
                                        {med.dosage}
                                      </p>
                                      {med.mealTiming && med.mealTiming !== 'anytime' && (
                                        <p className={`text-xs leading-tight ${
                                          darkMode ? 'text-gray-500' : 'text-gray-500'
                                        }`}>
                                          {med.mealTiming}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Legend */}
        <div className={`mt-6 p-4 rounded-lg border-2 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Quick Guide
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 ${
                darkMode ? 'bg-blue-950/30 border-blue-500' : 'bg-blue-100 border-blue-400'
              }`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Today's column
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'
              }`}>
                <Check className={`w-3 h-3 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Taken medication
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Pill className={`w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Click checkbox to mark as taken
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}