/**
 * Shared Profile View (Read-Only)
 * Allows caregivers to view patient's medication schedule without editing
 * Accessed via share link: /shared/:token
 */

import { useState, useEffect } from 'react';
import { Calendar, Clock, Pill, User, Shield, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner@2.0.3';
import api from '../services/api';

interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  timing: string[];
  startDate: string;
  endDate?: string;
  mealTiming?: 'before' | 'with' | 'after';
  notes?: string;
  photoUrl?: string;
}

interface OwnerProfile {
  name: string;
  age?: number;
  avatar?: string;
  email?: string;
}

interface SharedProfileViewProps {
  token: string;
  darkMode: boolean;
}

export default function SharedProfileView({ token, darkMode }: SharedProfileViewProps) {
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchSharedProfile();
  }, [token]);

  const fetchSharedProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call backend API to get shared profile data
      const response = await api.getSharedProfile(token);
      
      setOwner(response.data.owner);
      setMedications(response.data.medications || []);
      
      // Track view count
      await api.trackShareView(token);
    } catch (err: any) {
      console.error('Failed to fetch shared profile:', err);
      
      if (err.response?.status === 403) {
        setError('This share link has been revoked or expired.');
      } else if (err.response?.status === 404) {
        setError('Invalid share link.');
      } else {
        // Fallback: Use demo data for demonstration
        setOwner({
          name: 'John Smith',
          age: 72,
          avatar: 'https://images.unsplash.com/photo-1671140387494-e27e17372c84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400'
        });
        
        setMedications([
          {
            id: '1',
            name: 'Aspirin',
            dose: '81mg',
            frequency: 'Once daily',
            timing: ['08:00'],
            startDate: '2025-01-01',
            mealTiming: 'with',
            notes: 'For heart health'
          },
          {
            id: '2',
            name: 'Lisinopril',
            dose: '10mg',
            frequency: 'Once daily',
            timing: ['08:00'],
            startDate: '2025-01-01',
            notes: 'Blood pressure medication'
          },
          {
            id: '3',
            name: 'Metformin',
            dose: '500mg',
            frequency: 'Twice daily',
            timing: ['08:00', '20:00'],
            startDate: '2025-01-01',
            mealTiming: 'with',
            notes: 'Take with meals'
          }
        ]);
        
        toast.info('Viewing demo shared profile', {
          description: 'Backend not connected - showing sample data'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getMedicationsForDate = (date: string) => {
    return medications.filter(med => {
      const start = new Date(med.startDate);
      const end = med.endDate ? new Date(med.endDate) : null;
      const selected = new Date(date);
      
      if (selected < start) return false;
      if (end && selected > end) return false;
      
      return true;
    });
  };

  const todaysMedications = getMedicationsForDate(selectedDate);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading shared profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <Card className={`max-w-md w-full p-8 text-center ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={2.5} />
          </div>
          <h2 className={`text-xl font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Access Denied
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {error}
          </p>
          <Button
            onClick={() => window.location.href = '/'}
            size="lg"
            className="w-full min-h-[56px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" strokeWidth={2.5} />
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header - Read-Only Banner */}
      <div className="bg-orange-600 dark:bg-orange-700 text-white py-3 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-6 h-6 shrink-0" strokeWidth={2.5} />
            <div>
              <p className="font-semibold text-sm sm:text-base">
                Read-Only View
              </p>
              <p className="text-xs sm:text-sm opacity-90">
                You cannot edit this profile
              </p>
            </div>
          </div>
          <Shield className="w-8 h-8 opacity-50" strokeWidth={2.5} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Owner Profile Card */}
        <Card className={`p-4 sm:p-6 mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <div className="flex items-center gap-4 mb-4">
            {owner?.avatar ? (
              <img
                src={owner.avatar}
                alt={owner.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-blue-500"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-4 border-blue-500">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
              </div>
            )}
            <div>
              <h1 className={`text-xl sm:text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {owner?.name || 'Patient'}'s Medications
              </h1>
              {owner?.age && (
                <p className={`text-sm sm:text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {owner.age} yrs old
                </p>
              )}
            </div>
          </div>

          <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-blue-50'
          }`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <Shield className="w-4 h-4 inline mr-2 text-blue-600" strokeWidth={2.5} />
              This is a shared profile. You can view but cannot edit medications.
            </p>
          </div>
        </Card>

        {/* Date Selector */}
        <Card className={`p-4 sm:p-6 mb-6 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
              <h2 className={`text-lg sm:text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Schedule for
              </h2>
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={`px-4 py-3 rounded-lg border text-base min-h-[56px] ${
                darkMode 
                  ? 'bg-gray-900 border-gray-700 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
        </Card>

        {/* Medications List */}
        {todaysMedications.length > 0 ? (
          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Medications ({todaysMedications.length})
            </h3>

            {todaysMedications.map((med) => (
              <Card key={med.id} className={`p-4 sm:p-6 ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
              }`}>
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Pill className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg sm:text-xl font-bold mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {med.name}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Pill className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
                        <span className={`text-sm sm:text-base ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <strong>Dose:</strong> {med.dose}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
                        <span className={`text-sm sm:text-base ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <strong>Frequency:</strong> {med.frequency}
                        </span>
                      </div>
                    </div>

                    {/* Timing */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Clock className="w-5 h-5 text-gray-400" strokeWidth={2.5} />
                      {med.timing.map((time, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                            darkMode 
                              ? 'bg-blue-900/30 text-blue-400 border border-blue-800' 
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {time}
                        </span>
                      ))}
                    </div>

                    {/* Meal Timing */}
                    {med.mealTiming && (
                      <p className={`text-sm mb-2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <strong>Meal:</strong> Take {med.mealTiming} meals
                      </p>
                    )}

                    {/* Notes */}
                    {med.notes && (
                      <p className={`text-sm sm:text-base ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <strong>Notes:</strong> {med.notes}
                      </p>
                    )}

                    {/* Duration */}
                    <p className={`text-xs sm:text-sm mt-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-500'
                    }`}>
                      {new Date(med.startDate).toLocaleDateString()} 
                      {med.endDate && ` - ${new Date(med.endDate).toLocaleDateString()}`}
                      {!med.endDate && ' (Ongoing)'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className={`p-12 text-center ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}>
            <Pill className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" strokeWidth={2.5} />
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              No Medications Scheduled
            </h3>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              No medications scheduled for {new Date(selectedDate).toLocaleDateString()}
            </p>
          </Card>
        )}

        {/* Footer Info */}
        <Card className={`mt-6 p-4 border-l-4 border-orange-500 ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-orange-50'
        }`}>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <Eye className="w-4 h-4 inline mr-2" strokeWidth={2.5} />
            You are viewing this profile as a <strong>caregiver</strong>. 
            If you need to make changes, please contact {owner?.name || 'the patient'}.
          </p>
        </Card>
      </div>
    </div>
  );
}
