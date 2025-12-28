import { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  User,
  Calendar,
  Pill,
  TrendingUp,
  Mail,
  Phone,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { getAvatarUrl } from '../utils/avatarUtils';

interface Patient {
  id: number;
  name: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  medicationCount?: number;
  adherenceRate?: number;
  lastVisit?: string;
  nextAppointment?: string;
  atRisk?: boolean;
}

interface PatientDetailsProps {
  patient: Patient;
  onBack: () => void;
  onViewMedications: (patient: Patient) => void;
  onPrescribeMedication?: (patient: Patient) => void; // CRITICAL FIX: Allow doctor to prescribe
  darkMode: boolean;
}

export default function PatientDetails({
  patient,
  onBack,
  onViewMedications,
  onPrescribeMedication,
  darkMode,
}: PatientDetailsProps) {
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    if ('vibrate' in navigator) navigator.vibrate(50);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    toast.success('Notes saved successfully');
    setIsSavingNotes(false);
  };

  const adherenceRate = patient.adherenceRate || 0;
  const medicationCount = patient.medicationCount || 0;

  return (
    <div
      className={`min-h-screen pb-24 lg:pb-8 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      {/* Header */}
      <div
        className={`sticky top-0 z-10 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        } px-2 sm:px-6 lg:px-8 py-3 sm:py-6`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <Button
              onClick={onBack}
              variant="ghost"
              className="h-12 sm:h-14 w-12 sm:w-auto px-0 sm:px-6 touch-manipulation shrink-0 rounded-xl"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="hidden sm:inline sm:ml-2">Back</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-purple-500">
                  {patient.photoUrl ? (
                    <img
                      src={patient.photoUrl}
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={getAvatarUrl({ name: patient.name })}
                      alt={patient.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                {patient.atRisk && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h1
                    className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {patient.name}
                  </h1>
                  {patient.atRisk && (
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 text-base px-3 py-1">
                      At Risk
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-base px-3 py-1">
                    {calculateAge(patient.dateOfBirth)} yrs
                  </Badge>
                  {patient.gender && (
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {patient.gender === 'male' || patient.gender === 'Male' ? '♂ Male' : '♀ Female'}
                    </Badge>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg">
                      Born{' '}
                      {new Date(patient.dateOfBirth).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {patient.email && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Mail className="w-5 h-5" />
                      <span className="text-lg">{patient.email}</span>
                    </div>
                  )}
                  {patient.phone && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Phone className="w-5 h-5" />
                      <span className="text-lg">{patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appointment Info */}
        {(patient.lastVisit || patient.nextAppointment) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2
                className={`text-xl font-bold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                Appointments
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patient.lastVisit && (
                  <div className="p-4 rounded-lg border dark:border-gray-700">
                    <p className="text-sm text-gray-500 mb-1">Last Visit</p>
                    <p
                      className={`text-lg font-semibold ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {new Date(patient.lastVisit).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                )}
                {patient.nextAppointment && (
                  <div className="p-4 rounded-lg border border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">
                      Next Appointment
                    </p>
                    <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                      {new Date(patient.nextAppointment).toLocaleDateString(
                        'en-US',
                        {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Medication Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-bold flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                <Pill className="w-6 h-6 mr-2 text-purple-500" />
                Medications
              </h2>
              <div className="flex gap-3">
                {/* CRITICAL FIX: Prescribe Medication Button */}
                {onPrescribeMedication && (
                  <Button
                    onClick={() => onPrescribeMedication(patient)}
                    className="h-12 sm:h-14 px-4 sm:px-6 bg-green-600 hover:bg-green-700 text-white touch-manipulation"
                  >
                    <Pill className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Prescribe
                  </Button>
                )}
                <Button
                  onClick={() => onViewMedications(patient)}
                  className="h-12 sm:h-14 px-4 sm:px-6 bg-purple-600 hover:bg-purple-700 text-white touch-manipulation"
                >
                  View All
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                <p className="text-4xl font-bold text-purple-600">
                  {medicationCount}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Prescribed
                </p>
              </div>
              <div
                className={`text-center p-4 rounded-lg ${
                  adherenceRate >= 80
                    ? 'bg-green-50 dark:bg-green-900/20'
                    : adherenceRate >= 60
                    ? 'bg-yellow-50 dark:bg-yellow-900/20'
                    : 'bg-red-50 dark:bg-red-900/20'
                }`}
              >
                <p
                  className={`text-4xl font-bold ${
                    adherenceRate >= 80
                      ? 'text-green-600'
                      : adherenceRate >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {adherenceRate}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Adherence
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Adherence Status
                </span>
                <span
                  className={`text-sm font-bold ${
                    adherenceRate >= 80
                      ? 'text-green-600'
                      : adherenceRate >= 60
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  }`}
                >
                  {adherenceRate >= 80
                    ? 'Good'
                    : adherenceRate >= 60
                    ? 'Fair'
                    : 'Poor'}
                </span>
              </div>
              <Progress value={adherenceRate} className="h-3" />
            </div>
          </Card>
        </motion.div>

        {/* Clinical Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <FileText className="w-6 h-6 mr-2 text-purple-500" />
              Clinical Notes
            </h2>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add clinical observations, treatment notes, or recommendations..."
              className="min-h-[150px] text-lg mb-4"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={isSavingNotes || !notes.trim()}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white text-lg"
            >
              {isSavingNotes ? (
                'Saving...'
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Save Notes
                </>
              )}
            </Button>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2
              className={`text-xl font-bold mb-4 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            >
              <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
              Recent Activity
            </h2>
            <p className="text-gray-500 text-center py-8">
              Activity tracking coming soon
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
