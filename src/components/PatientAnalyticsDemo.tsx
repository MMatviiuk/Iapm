/**
 * Patient Analytics Demo
 * Displays comprehensive analytics for all 15 generated patients
 * Shows adherence patterns, medication complexity, and trends
 * 
 * NOTE: Currently disabled due to JSON import issues in production build.
 * This component is not used in the main application flow.
 */

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, Pill, TrendingUp, TrendingDown, AlertCircle, 
  CheckCircle, Calendar, BarChart3, Activity, Award 
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// DISABLED: Direct JSON import causes build errors
// import patientsData from '../data/sample-patients-with-history.json';
import { generateMedicationHistory, calculateAdherenceStats, getDailyAdherenceData } from '../utils/medicationHistoryGenerator';
import type { Prescription, MedicationHistoryEntry } from '../types';

interface PatientAnalyticsProps {
  darkMode: boolean;
}

export default function PatientAnalyticsDemo({ darkMode }: PatientAnalyticsProps) {
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    generateAnalytics();
  }, []);

  const generateAnalytics = () => {
    setLoading(true);
    
    // DISABLED: This component is not functional due to JSON import restrictions
    // For production, this needs to be refactored to fetch data from API
    console.warn('PatientAnalyticsDemo is currently disabled');
    
    const patientsWithHistory: any[] = [];
    
    /* ORIGINAL CODE - DISABLED
    // Generate history for all patients
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 90);

    const patientsWithHistory = patientsData.patients.map(patient => {
      const history = generateMedicationHistory(patient.medications as unknown as Prescription[], startDate);
      const stats = calculateAdherenceStats(history);
      const dailyData = getDailyAdherenceData(history, 30);
      
      return {
        ...patient,
        history,
        stats,
        dailyData
      };
    });
    */

    // Calculate overall statistics
    const totalPatients = patientsWithHistory.length;
    const totalMedications = patientsWithHistory.reduce((sum, p) => sum + p.medications.length, 0);
    const averageAdherence = Math.round(
      patientsWithHistory.reduce((sum, p) => sum + p.stats.overall, 0) / totalPatients
    );

    const adherenceDistribution = [
      { range: 'Excellent (≥90%)', count: patientsWithHistory.filter(p => p.stats.overall >= 90).length, color: '#10b981' },
      { range: 'Good (80-89%)', count: patientsWithHistory.filter(p => p.stats.overall >= 80 && p.stats.overall < 90).length, color: '#3b82f6' },
      { range: 'Fair (70-79%)', count: patientsWithHistory.filter(p => p.stats.overall >= 70 && p.stats.overall < 80).length, color: '#f59e0b' },
      { range: 'Poor (<70%)', count: patientsWithHistory.filter(p => p.stats.overall < 70).length, color: '#ef4444' }
    ];

    const medicationComplexity = patientsWithHistory.map(p => ({
      name: `${p.firstName} ${p.lastName[0]}.`,
      medications: p.medications.length,
      adherence: p.stats.overall
    }));

    // Top and bottom performers
    const sortedByAdherence = [...patientsWithHistory].sort((a, b) => b.stats.overall - a.stats.overall);
    const topPerformers = sortedByAdherence.slice(0, 5);
    const bottomPerformers = sortedByAdherence.slice(-5).reverse();

    setAnalyticsData({
      patientsWithHistory,
      totalPatients,
      totalMedications,
      averageAdherence,
      adherenceDistribution,
      medicationComplexity,
      topPerformers,
      bottomPerformers,
      atRiskCount: patientsWithHistory.filter(p => p.stats.overall < 80).length
    });

    setLoading(false);
  };

  if (loading || !analyticsData) {
    return (
      <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Card className={`p-12 text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Generating analytics for 15 patients...
          </p>
        </Card>
      </div>
    );
  }

  const { 
    patientsWithHistory, 
    totalPatients, 
    totalMedications, 
    averageAdherence,
    adherenceDistribution,
    medicationComplexity,
    topPerformers,
    bottomPerformers,
    atRiskCount
  } = analyticsData;

  const selectedPatientData = selectedPatient 
    ? patientsWithHistory.find(p => p.id === selectedPatient)
    : null;

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Patient Analytics Demo
              </h1>
              <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Comprehensive analytics for 15 patients with 3-month medication history
              </p>
            </div>
            <Button
              onClick={generateAnalytics}
              variant="outline"
              className="h-10 sm:h-12"
            >
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Patients
                </p>
                <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalPatients}
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Pill className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Rx
                </p>
                <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {totalMedications}
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Avg Adherence
                </p>
                <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {averageAdherence}%
                </p>
              </div>
            </div>
          </Card>

          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  At Risk
                </p>
                <p className={`text-xl sm:text-2xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {atRiskCount}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Adherence Distribution */}
          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`text-base sm:text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Adherence Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={adherenceDistribution}
                  dataKey="count"
                  nameKey="range"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.range}: ${entry.count}`}
                >
                  {adherenceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Medication Complexity */}
          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <h3 className={`text-base sm:text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Medication Count per Patient
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={medicationComplexity}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="name" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="medications" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Top and Bottom Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Top Performers */}
          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              <h3 className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Top 5 Adherence
              </h3>
            </div>
            <div className="space-y-3">
              {topPerformers.map((patient, index) => (
                <div 
                  key={patient.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                    darkMode 
                      ? 'bg-gray-900 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        #{index + 1}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {patient.medications.length} medications
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      {patient.stats.overall}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Bottom Performers (At Risk) */}
          <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
              <h3 className={`text-base sm:text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                At Risk Patients
              </h3>
            </div>
            <div className="space-y-3">
              {bottomPerformers.map((patient, index) => (
                <div 
                  key={patient.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                    darkMode 
                      ? 'bg-gray-900 hover:bg-gray-700' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedPatient(patient.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className={`text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {patient.medications.length} medications
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                      {patient.stats.overall}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Selected Patient Detail */}
        {selectedPatientData && (
          <Card className={`p-4 sm:p-6 mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPatientData.firstName} {selectedPatientData.lastName}
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {selectedPatientData.age} yrs • {selectedPatientData.medications.length} medications
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPatient(null)}
              >
                Close
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div>
                <p className={`text-xs sm:text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Overall
                </p>
                <p className={`text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPatientData.stats.overall}%
                </p>
              </div>
              <div>
                <p className={`text-xs sm:text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Last 7 Days
                </p>
                <p className={`text-lg sm:text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedPatientData.stats.last7Days}%
                </p>
              </div>
              <div>
                <p className={`text-xs sm:text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Taken
                </p>
                <p className={`text-lg sm:text-xl text-green-600 dark:text-green-400`}>
                  {selectedPatientData.stats.takenDoses}
                </p>
              </div>
              <div>
                <p className={`text-xs sm:text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Missed
                </p>
                <p className={`text-lg sm:text-xl text-red-600 dark:text-red-400`}>
                  {selectedPatientData.stats.missedDoses}
                </p>
              </div>
            </div>

            <h4 className={`text-sm sm:text-base mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              30-Day Adherence Trend
            </h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={selectedPatientData.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                <XAxis 
                  dataKey="date" 
                  stroke={darkMode ? '#9ca3af' : '#6b7280'}
                  tickFormatter={(value) => new Date(value).getDate().toString()}
                />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                    borderColor: darkMode ? '#374151' : '#e5e7eb',
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Adherence']}
                />
                <Line 
                  type="monotone" 
                  dataKey="adherence" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* All Patients Table */}
        <Card className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <h3 className={`text-base sm:text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All Patients
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <th className={`text-left p-3 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Patient
                  </th>
                  <th className={`text-left p-3 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Age
                  </th>
                  <th className={`text-left p-3 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Medications
                  </th>
                  <th className={`text-left p-3 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Adherence
                  </th>
                  <th className={`text-left p-3 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {patientsWithHistory.map(patient => (
                  <tr 
                    key={patient.id}
                    className={`border-b cursor-pointer transition ${
                      darkMode 
                        ? 'border-gray-700 hover:bg-gray-700' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedPatient(patient.id)}
                  >
                    <td className={`p-3 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {patient.firstName} {patient.lastName}
                    </td>
                    <td className={`p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {patient.age}
                    </td>
                    <td className={`p-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {patient.medications.length}
                    </td>
                    <td className={`p-3 text-sm ${
                      patient.stats.overall >= 90 
                        ? 'text-green-600 dark:text-green-400'
                        : patient.stats.overall >= 80
                        ? 'text-blue-600 dark:text-blue-400'
                        : patient.stats.overall >= 70
                        ? 'text-orange-600 dark:text-orange-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {patient.stats.overall}%
                    </td>
                    <td className="p-3">
                      {patient.stats.overall >= 90 ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : patient.stats.overall < 80 ? (
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
