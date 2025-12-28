import { useState, useEffect } from 'react';
import { 
  generateMedicationHistory, 
  calculateAdherenceStats,
  getDailyAdherenceData,
  getWeeklyAdherenceData,
  getSkipReasons
} from '../utils/medicationHistoryGenerator';
import type { Prescription } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, Award, AlertCircle } from 'lucide-react';

interface HistoryDemoProps {
  darkMode: boolean;
}

export default function HistoryDemo({ darkMode }: HistoryDemoProps) {
  const [sampleMedications] = useState<Prescription[]>([
    {
      id: '1',
      name: 'Lisinopril 10mg',
      dosage: '10mg',
      frequency: 'Once daily',
      timesPerDay: ['08:00'],
      mealTiming: 'Before meals',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    },
    {
      id: '2',
      name: 'Metformin 500mg',
      dosage: '500mg',
      frequency: 'Twice daily',
      timesPerDay: ['08:00', '20:00'],
      mealTiming: 'With meals',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    },
    {
      id: '3',
      name: 'Vitamin D 1000IU',
      dosage: '1000IU',
      frequency: 'Once daily',
      timesPerDay: ['08:00'],
      mealTiming: 'With meals',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    },
    {
      id: '4',
      name: 'Atorvastatin 20mg',
      dosage: '20mg',
      frequency: 'Once daily',
      timesPerDay: ['21:00'],
      mealTiming: 'Any time',
      startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      active: true,
    },
  ]);

  const [history, setHistory] = useState<ReturnType<typeof generateMedicationHistory>>([]);
  const [stats, setStats] = useState<ReturnType<typeof calculateAdherenceStats> | null>(null);
  const [dailyData, setDailyData] = useState<ReturnType<typeof getDailyAdherenceData>>([]);
  const [weeklyData, setWeeklyData] = useState<ReturnType<typeof getWeeklyAdherenceData>>([]);
  const [skipReasons, setSkipReasons] = useState<ReturnType<typeof getSkipReasons>>([]);

  useEffect(() => {
    // Generate history
    const generatedHistory = generateMedicationHistory(sampleMedications);
    setHistory(generatedHistory);

    // Calculate stats
    const calculatedStats = calculateAdherenceStats(generatedHistory);
    setStats(calculatedStats);

    // Get chart data
    const daily = getDailyAdherenceData(generatedHistory, 30);
    setDailyData(daily);

    const weekly = getWeeklyAdherenceData(generatedHistory, 12);
    setWeeklyData(weekly);

    // Get skip reasons
    const reasons = getSkipReasons(generatedHistory);
    setSkipReasons(reasons);
  }, [sampleMedications]);

  if (!stats) {
    return <div>Loading...</div>;
  }

  const COLORS = ['#2196F3', '#FB923C', '#9333EA', '#10B981', '#F59E0B'];

  return (
    <div className={`min-h-screen p-4 sm:p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Medication History Demo
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Realistic 3-month medication tracking history
          </p>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Overall
              </h3>
            </div>
            <p className="text-4xl font-bold text-blue-500">{stats.overall}%</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Adherence rate
            </p>
          </div>

          <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Last 7 Days
              </h3>
            </div>
            <p className="text-4xl font-bold text-green-500">{stats.last7Days}%</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Recent adherence
            </p>
          </div>

          <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Doses Taken
              </h3>
            </div>
            <p className="text-4xl font-bold text-orange-500">{stats.takenDoses}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Out of {stats.totalDoses}
            </p>
          </div>

          <div className={`rounded-xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Missed
              </h3>
            </div>
            <p className="text-4xl font-bold text-red-500">{stats.missedDoses}</p>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Doses skipped
            </p>
          </div>
        </div>

        {/* Daily Adherence Chart */}
        <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Daily Adherence - Last 30 Days
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis 
                dataKey="date" 
                stroke={darkMode ? '#9CA3AF' : '#6B7280'}
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="adherence" 
                stroke="#2196F3" 
                strokeWidth={3}
                dot={{ fill: '#2196F3', r: 4 }}
                name="Adherence %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Adherence Chart */}
        <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Weekly Adherence - Last 12 Weeks
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="week" stroke={darkMode ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={darkMode ? '#9CA3AF' : '#6B7280'} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                  border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="adherence" fill="#10B981" name="Adherence %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* By Medication */}
        <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Adherence by Medication
          </h2>
          <div className="space-y-4">
            {Object.entries(stats.byMedication).map(([medName, medStats], index) => (
              <div key={medName}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {medName}
                  </h3>
                  <span className={`font-bold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {medStats.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${medStats.percentage}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                </div>
                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {medStats.taken} of {medStats.total} doses taken
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Skip Reasons */}
        {skipReasons.length > 0 && (
          <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Most Common Skip Reasons
            </h2>
            <div className="space-y-3">
              {skipReasons.slice(0, 5).map((reason, index) => (
                <div key={reason.reason} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {index + 1}
                      </span>
                    </div>
                    <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {reason.reason}
                    </span>
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {reason.count} times
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sample Data Info */}
        <div className={`rounded-2xl p-6 shadow-lg ${darkMode ? 'bg-blue-900/20 border-blue-500' : 'bg-blue-50 border-blue-200'} border-2`}>
          <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>
            Sample Data Information
          </h3>
          <div className="space-y-2">
            <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
              <strong>Medications:</strong> {sampleMedications.length} (Lisinopril, Metformin, Vitamin D, Atorvastatin)
            </p>
            <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
              <strong>Time Period:</strong> Last 90 days
            </p>
            <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
              <strong>Total Entries:</strong> {history.length}
            </p>
            <p className={darkMode ? 'text-blue-200' : 'text-blue-800'}>
              <strong>Realistic Factors:</strong> Weekend effect, time-of-day variation, medication type adjustments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
