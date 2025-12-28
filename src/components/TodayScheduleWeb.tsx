import { useState, useEffect } from 'react';
import { Calendar, Clock, Pill, CheckCircle2, Circle, Edit2, Trash2, Printer, Filter, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface TodayScheduleWebProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  medications: any[];
  setMedications: (meds: any[]) => void;
  setSelectedMedicationId: (id: number | null) => void;
  currentUser?: any;
}

export default function TodayScheduleWeb({
  darkMode,
  setCurrentPage,
  medications,
  setMedications,
  setSelectedMedicationId,
  currentUser
}: TodayScheduleWebProps) {

  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Get today's medications
  const todayMedications = medications.filter(med => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    return med.daysOfWeek?.[today] === true;
  });

  const takenToday = todayMedications.filter(med => med.taken).length;
  const completionRate = todayMedications.length > 0 
    ? Math.round((takenToday / todayMedications.length) * 100) 
    : 100;

  // Group by time
  const groupedMedications = todayMedications.reduce((acc: any, med: any) => {
    const time = med.time || med.times?.[0] || '08:00';
    if (!acc[time]) acc[time] = [];
    acc[time].push(med);
    return acc;
  }, {});

  const sortedTimes = Object.keys(groupedMedications).sort();

  const getTimeString = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return time;
    }
  };

  const getMealTimingIcon = (timing: string | undefined) => {
    if (!timing || timing === 'anytime') return null;
    // Return emoji or icon based on timing
    const map: { [key: string]: string } = {
      'before': '🍽️ Before meal',
      'with': '🍽️ With meal',
      'after': '🍽️ After meal'
    };
    return map[timing.toLowerCase().replace(' meal', '')] || null;
  };

  const handleMarkTaken = (id: number) => {
    const updated = medications.map(m => 
      m.id === id ? { ...m, taken: true } : m
    );
    setMedications(updated);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast.success('Marked as taken!', {
      duration: 2000,
    });
  };

  const handleEdit = (id: number) => {
    setSelectedMedicationId(id);
    setCurrentPage('edit');
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete ${name}?`)) {
      setMedications(medications.filter(m => m.id !== id));
      toast.success(`${name} deleted`);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 lg:p-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Header with stats - COMPACT */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Today's Schedule
              </h1>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentPage('add')}
                className="h-10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
              
              <Button
                onClick={() => window.print()}
                variant="outline"
                className="h-10"
              >
                <Printer className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress card */}
          <Card className={`p-6 mb-6 border ${
            darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Daily Progress
                </h3>
                <p className={`text-sm ${
                  darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {takenToday} of {todayMedications.length} medications taken
                </p>
              </div>
              
              <div className={`text-3xl font-bold ${
                completionRate === 100 ? 'text-green-600' : 
                completionRate >= 80 ? 'text-blue-600' :
                'text-orange-600'
              }`}>
                {completionRate}%
              </div>
            </div>
            
            <Progress value={completionRate} className="h-2" />
          </Card>

          {/* Medications list */}
          {todayMedications.length === 0 ? (
            <Card className={`p-12 text-center border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <Pill className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-slate-600' : 'text-slate-400'
              }`} />
              <h3 className={`text-xl font-semibold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                No medications for today
              </h3>
              <p className={`mb-6 ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                You're all set for the day!
              </p>
              <Button onClick={() => setCurrentPage('add')}>
                Add Medication
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              {sortedTimes.map((time) => (
                <div key={time}>
                  {/* Time header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                    }`}>
                      <Clock className={`w-5 h-5 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <h3 className={`text-lg font-semibold ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {getTimeString(time)}
                    </h3>
                  </div>

                  {/* Medications at this time */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {groupedMedications[time].map((med: any) => (
                      <Card key={med.id} className={`p-4 border transition-all ${
                        med.taken
                          ? darkMode 
                            ? 'bg-green-950/20 border-green-800'
                            : 'bg-green-50 border-green-200'
                          : darkMode
                            ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            {/* Checkbox */}
                            <button
                              onClick={() => !med.taken && handleMarkTaken(med.id)}
                              className={`mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                                med.taken
                                  ? 'bg-green-600 border-green-600'
                                  : darkMode
                                    ? 'border-slate-600 hover:border-green-500'
                                    : 'border-slate-300 hover:border-green-500'
                              }`}
                              disabled={med.taken}
                            >
                              {med.taken && (
                                <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={3} />
                              )}
                            </button>

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-semibold ${
                                med.taken
                                  ? darkMode ? 'text-green-400' : 'text-green-700'
                                  : darkMode ? 'text-white' : 'text-slate-900'
                              }`}>
                                {med.name}
                              </h4>
                              <p className={`text-sm ${
                                darkMode ? 'text-slate-400' : 'text-slate-600'
                              }`}>
                                {med.dosage}
                              </p>
                              {med.mealTiming && med.mealTiming !== 'anytime' && (
                                <p className={`text-xs mt-1 ${
                                  darkMode ? 'text-slate-500' : 'text-slate-500'
                                }`}>
                                  {getMealTimingIcon(med.mealTiming)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <Button
                              onClick={() => handleEdit(med.id)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleDelete(med.id, med.name)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}