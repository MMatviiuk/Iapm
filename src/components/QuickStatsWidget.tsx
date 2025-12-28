import { memo } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Clock, Pill, CheckCircle2, AlertTriangle, Calendar, Award } from 'lucide-react';
import { Card } from './ui/card';

interface QuickStatsWidgetProps {
  darkMode: boolean;
  stats: {
    todayTaken: number;
    todayTotal: number;
    weekAdherence: number;
    monthAdherence: number;
    currentStreak: number;
    longestStreak: number;
    upcomingInHour: number;
    missedToday: number;
  };
  setCurrentPage?: (page: string) => void; // Make cards clickable
}

function QuickStatsWidget({ darkMode, stats, setCurrentPage }: QuickStatsWidgetProps) {
  
  const todayPercentage = stats.todayTotal > 0 
    ? Math.round((stats.todayTaken / stats.todayTotal) * 100) 
    : 0;

  const weekTrend = stats.weekAdherence >= 90 ? 'excellent' : stats.weekAdherence >= 75 ? 'good' : 'needs-improvement';
  const monthTrend = stats.monthAdherence >= stats.weekAdherence ? 'improving' : 'declining';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Today's Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card 
          onClick={() => setCurrentPage?.('today')}
          className={`p-4 sm:p-5 border-2 transition-all duration-200 ${
            setCurrentPage ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
          } ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-950/30 to-blue-900/20 border-blue-800 hover:border-blue-600' 
            : 'bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 hover:border-blue-400'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${
              darkMode ? 'bg-blue-900/50' : 'bg-blue-200/50'
            }`}>
              <CheckCircle2 className={`w-6 h-6 ${
                darkMode ? 'text-blue-400' : 'text-blue-700'
              }`} strokeWidth={2} />
            </div>
            <span className={`text-3xl font-bold ${
              darkMode ? 'text-blue-400' : 'text-blue-700'
            }`}>
              {todayPercentage}%
            </span>
          </div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Today's Progress
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {stats.todayTaken} of {stats.todayTotal} taken
          </p>
        </Card>
      </motion.div>

      {/* Week Adherence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card 
          onClick={() => setCurrentPage?.('week-view')}
          className={`p-4 sm:p-5 border-2 transition-all duration-200 ${
            setCurrentPage ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
          } ${
          weekTrend === 'excellent'
            ? darkMode 
              ? 'bg-gradient-to-br from-green-950/30 to-green-900/20 border-green-800 hover:border-green-600' 
              : 'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 hover:border-green-400'
            : weekTrend === 'good'
            ? darkMode 
              ? 'bg-gradient-to-br from-amber-950/30 to-amber-900/20 border-amber-800 hover:border-amber-600' 
              : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 hover:border-amber-400'
            : darkMode 
              ? 'bg-gradient-to-br from-red-950/30 to-red-900/20 border-red-800 hover:border-red-600' 
              : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 hover:border-red-400'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${
              weekTrend === 'excellent'
                ? darkMode ? 'bg-green-900/50' : 'bg-green-200/50'
                : weekTrend === 'good'
                ? darkMode ? 'bg-amber-900/50' : 'bg-amber-200/50'
                : darkMode ? 'bg-red-900/50' : 'bg-red-200/50'
            }`}>
              {monthTrend === 'improving' ? (
                <TrendingUp className={`w-6 h-6 ${
                  weekTrend === 'excellent'
                    ? darkMode ? 'text-green-400' : 'text-green-700'
                    : weekTrend === 'good'
                    ? darkMode ? 'text-amber-400' : 'text-amber-700'
                    : darkMode ? 'text-red-400' : 'text-red-700'
                }`} strokeWidth={2} />
              ) : (
                <TrendingDown className={`w-6 h-6 ${
                  weekTrend === 'excellent'
                    ? darkMode ? 'text-green-400' : 'text-green-700'
                    : weekTrend === 'good'
                    ? darkMode ? 'text-amber-400' : 'text-amber-700'
                    : darkMode ? 'text-red-400' : 'text-red-700'
                }`} strokeWidth={2} />
              )}
            </div>
            <span className={`text-3xl font-bold ${
              weekTrend === 'excellent'
                ? darkMode ? 'text-green-400' : 'text-green-700'
                : weekTrend === 'good'
                ? darkMode ? 'text-amber-400' : 'text-amber-700'
                : darkMode ? 'text-red-400' : 'text-red-700'
            }`}>
              {stats.weekAdherence}%
            </span>
          </div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Week Adherence
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {monthTrend === 'improving' ? '↑' : '↓'} {Math.abs(stats.monthAdherence - stats.weekAdherence)}% vs last month
          </p>
        </Card>
      </motion.div>

      {/* Current Streak */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card 
          onClick={() => setCurrentPage?.('rewards')}
          className={`p-4 sm:p-5 border-2 transition-all duration-200 ${
            setCurrentPage ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
          } ${
          darkMode 
            ? 'bg-gradient-to-br from-purple-950/30 to-purple-900/20 border-purple-800 hover:border-purple-600' 
            : 'bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 hover:border-purple-400'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${
              darkMode ? 'bg-purple-900/50' : 'bg-purple-200/50'
            }`}>
              <Award className={`w-6 h-6 ${
                darkMode ? 'text-purple-400' : 'text-purple-700'
              }`} strokeWidth={2} />
            </div>
            <span className={`text-3xl font-bold ${
              darkMode ? 'text-purple-400' : 'text-purple-700'
            }`}>
              {stats.currentStreak}
            </span>
          </div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Current Streak
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            Best: {stats.longestStreak} days
          </p>
        </Card>
      </motion.div>

      {/* Upcoming/Missed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card 
          onClick={() => setCurrentPage?.(stats.missedToday > 0 ? 'history' : 'today')}
          className={`p-4 sm:p-5 border-2 transition-all duration-200 ${
            setCurrentPage ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''
          } ${
          stats.missedToday > 0
            ? darkMode 
              ? 'bg-gradient-to-br from-red-950/30 to-red-900/20 border-red-800 hover:border-red-600' 
              : 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200 hover:border-red-400'
            : darkMode 
              ? 'bg-gradient-to-br from-indigo-950/30 to-indigo-900/20 border-indigo-800 hover:border-indigo-600' 
              : 'bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-200 hover:border-indigo-400'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${
              stats.missedToday > 0
                ? darkMode ? 'bg-red-900/50' : 'bg-red-200/50'
                : darkMode ? 'bg-indigo-900/50' : 'bg-indigo-200/50'
            }`}>
              {stats.missedToday > 0 ? (
                <AlertTriangle className={`w-6 h-6 ${
                  darkMode ? 'text-red-400' : 'text-red-700'
                }`} strokeWidth={2} />
              ) : (
                <Clock className={`w-6 h-6 ${
                  darkMode ? 'text-indigo-400' : 'text-indigo-700'
                }`} strokeWidth={2} />
              )}
            </div>
            <span className={`text-3xl font-bold ${
              stats.missedToday > 0
                ? darkMode ? 'text-red-400' : 'text-red-700'
                : darkMode ? 'text-indigo-400' : 'text-indigo-700'
            }`}>
              {stats.missedToday > 0 ? stats.missedToday : stats.upcomingInHour}
            </span>
          </div>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {stats.missedToday > 0 ? 'Missed Today' : 'Upcoming Soon'}
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-slate-500' : 'text-slate-500'
          }`}>
            {stats.missedToday > 0 ? 'Take now to stay on track' : 'In the next hour'}
          </p>
        </Card>
      </motion.div>
    </div>
  );
}

export default memo(QuickStatsWidget);