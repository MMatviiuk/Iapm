import { useState } from 'react';
import { Calendar, Clock, Pill, TrendingUp, AlertCircle, CheckCircle2, Activity, Target, Sparkles, AlarmClock, Utensils } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

interface DashboardWebProProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  medications: any[];
  currentUser?: any;
  onMarkTaken?: (id: number) => void;
}

export default function DashboardWebPro({ 
  darkMode, 
  setCurrentPage, 
  medications, 
  currentUser,
  onMarkTaken 
}: DashboardWebProProps) {
  
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

  const getTimeString = (time: string | undefined) => {
    if (!time) return 'N/A';
    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
      return 'N/A';
    }
  };

  const getMealTimingText = (timing: string | undefined) => {
    if (!timing || timing === 'anytime') return '';
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

  return (
    <div className="min-h-screen">
      {/* Main content - compact vertical spacing */}
      <div className="p-4 lg:p-6">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Stats Grid - 4 columns on desktop with COMPACT spacing */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4">
            {/* Today's Progress */}
            <Card className={`p-3 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <Activity className={`w-5 h-5 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Today
                  </p>
                  <p className={`text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {takenToday}/{todayMedications.length}
                  </p>
                </div>
              </div>
            </Card>

            {/* Adherence Rate */}
            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Adherence
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {adherenceRate}%
                  </p>
                </div>
              </div>
            </Card>

            {/* Total Medications */}
            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-purple-500/10' : 'bg-purple-50'
                }`}>
                  <Pill className={`w-6 h-6 ${
                    darkMode ? 'text-purple-400' : 'text-purple-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Total
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    {totalMedications}
                  </p>
                </div>
              </div>
            </Card>

            {/* Streak */}
            <Card className={`p-4 border ${
              darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  darkMode ? 'bg-orange-500/10' : 'bg-orange-50'
                }`}>
                  <Sparkles className={`w-6 h-6 ${
                    darkMode ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Streak
                  </p>
                  <p className={`text-2xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    7 days
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* 2-column layout on desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left column - Next Medication + Upcoming (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Next Medication */}
              {nextMedication ? (
                <Card className={`p-6 border-2 ${
                  darkMode 
                    ? 'bg-blue-950/20 border-blue-700'
                    : 'bg-blue-50 border-blue-300'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        darkMode ? 'bg-blue-600' : 'bg-blue-600'
                      }`}>
                        <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${
                          darkMode ? 'text-blue-100' : 'text-blue-900'
                        }`}>
                          Next Medication
                        </h3>
                        <p className={`text-sm ${
                          darkMode ? 'text-blue-300' : 'text-blue-700'
                        }`}>
                          {getTimeString(nextMedication.time)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMarkTaken(nextMedication.id)}
                        className="h-12 px-6 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-5 h-5 mr-2" />
                        Take Now
                      </Button>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-slate-900/50' : 'bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-xl font-bold ${
                          darkMode ? 'text-white' : 'text-slate-900'
                        }`}>
                          {nextMedication.name}
                        </p>
                        <p className={`text-sm ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {nextMedication.dosage}
                          {nextMedication.mealTiming && nextMedication.mealTiming !== 'anytime' && (
                            <span> • {getMealTimingText(nextMedication.mealTiming)}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card className={`p-12 text-center border ${
                  darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  <Sparkles className={`w-16 h-16 mx-auto mb-4 ${
                    darkMode ? 'text-green-400' : 'text-green-600'
                  }`} />
                  <h3 className={`text-2xl font-bold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    All Done!
                  </h3>
                  <p className={`${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    You've taken all medications for today
                  </p>
                </Card>
              )}

              {/* Upcoming Medications */}
              <Card className={`p-6 border ${
                darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Upcoming Today
                </h3>
                
                {upcomingMedications.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingMedications.map((med) => (
                      <div
                        key={med.id}
                        className={`p-4 rounded-lg border flex items-center justify-between ${
                          darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
                          }`}>
                            <Pill className={`w-5 h-5 ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`} />
                          </div>
                          <div>
                            <p className={`font-semibold ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}>
                              {med.name}
                            </p>
                            <p className={`text-sm ${
                              darkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {med.dosage} • {getTimeString(med.time)}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleMarkTaken(med.id)}
                          size="sm"
                          variant="outline"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-center py-8 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    No upcoming medications
                  </p>
                )}
              </Card>
            </div>

            {/* Right column - Progress + Quick Actions (1 col) */}
            <div className="space-y-6">
              
              {/* Today's Progress */}
              <Card className={`p-6 border ${
                darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Today's Progress
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Completion
                      </span>
                      <span className={`text-sm font-bold ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {adherenceRate}%
                      </span>
                    </div>
                    <Progress value={adherenceRate} className="h-3" />
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                  }`}>
                    <div className="flex justify-between mb-1">
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Taken
                      </span>
                      <span className={`text-sm font-bold ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`}>
                        {takenToday}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`text-sm ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Remaining
                      </span>
                      <span className={`text-sm font-bold ${
                        darkMode ? 'text-orange-400' : 'text-orange-600'
                      }`}>
                        {todayMedications.length - takenToday}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card className={`p-6 border ${
                darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Quick Actions
                </h3>
                
                <div className="space-y-2">
                  <Button
                    onClick={() => setCurrentPage('add')}
                    className="w-full h-12 justify-start"
                    variant="outline"
                  >
                    <Pill className="w-5 h-5 mr-3" />
                    Add Medication
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentPage('schedule')}
                    className="w-full h-12 justify-start"
                    variant="outline"
                  >
                    <Calendar className="w-5 h-5 mr-3" />
                    View Today
                  </Button>
                  
                  <Button
                    onClick={() => setCurrentPage('history')}
                    className="w-full h-12 justify-start"
                    variant="outline"
                  >
                    <Clock className="w-5 h-5 mr-3" />
                    View History
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}