import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users,
  TrendingUp,
  Pill,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronUp,
  Clock,
  Activity,
  CheckCircle2,
  Edit2,
  Trash2,
  Printer,
  BarChart3,
  UserPlus,
  Stethoscope,
  Info,
  ShieldAlert
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Progress } from './ui/progress';
import { calculateAge } from '../utils/dateUtils';
import { getAvatarUrl } from '../utils/avatarUtils';
import { loadDatabase } from '../data/database';
import FABButtons from './FABButtons';
import { toast } from 'sonner@2.0.3';
import { checkMedicationInteractions } from '../utils/drugInteractionChecker';
import { getMedicationSideEffects } from '../utils/sideEffectsDatabase';

interface DoctorDashboardEnhancedProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
}

interface PatientData {
  id: string;
  name: string;
  dateOfBirth: string;
  adherence: number;
  photoUrl?: string;
  gender?: 'male' | 'female';
  status: 'Active' | 'At Risk' | 'Critical';
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken?: boolean;
  }>;
}

export default function DoctorDashboardEnhanced({ 
  darkMode, 
  setCurrentPage 
}: DoctorDashboardEnhancedProps) {
  
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const db = await loadDatabase();
        
        // Use Dr. James Anderson (doc_001)
        const currentDoctorId = 'doc_001';
        
        // Get current user from localStorage to exclude them from patient list
        const currentUserStr = localStorage.getItem('currentUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        const currentUserId = currentUser?.id;
        
        console.log('🔍 Current user:', currentUserId, currentUser?.name, currentUser?.role);
        
        let myPatients = db.patients.filter(p => p.primaryDoctorId === currentDoctorId);
        
        // CRITICAL FIX: Exclude current user from patient list
        // Doctor cannot be their own patient
        if (currentUser && currentUserId) {
          const beforeCount = myPatients.length;
          
          // Filter out current user (regardless of their role)
          // This prevents: Doctor seeing themselves as patient, Patient seeing duplicate
          myPatients = myPatients.filter(p => {
            // Check by ID
            if (p.id === currentUserId) return false;
            
            // Check by email (additional safety check)
            if (currentUser.email && p.email === currentUser.email) return false;
            
            // Check by name match (for demo accounts without proper IDs)
            const patientFullName = `${p.firstName} ${p.lastName}`;
            const currentUserName = currentUser.name || `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim();
            if (patientFullName === currentUserName) return false;
            
            return true;
          });
          
          const afterCount = myPatients.length;
          
          if (beforeCount > afterCount) {
            console.log('✅ EXCLUDED current user from patient list:', currentUser.name);
            console.log(`   Patients before: ${beforeCount}, after: ${afterCount}`);
            console.log(`   Reason: Doctor cannot be their own patient (HIPAA/GDPR compliance)`);
          }
        }

        const patientsData: PatientData[] = myPatients.map(patient => ({
          id: patient.id,
          name: `${patient.firstName} ${patient.lastName}`,
          dateOfBirth: patient.dateOfBirth,
          adherence: patient.adherenceRate,
          photoUrl: getAvatarUrl({
            name: `${patient.firstName} ${patient.lastName}`,
            gender: patient.gender.toLowerCase() as 'male' | 'female',
            customPhotoUrl: patient.photoUrl
          }),
          gender: patient.gender.toLowerCase() as 'male' | 'female',
          status: patient.adherenceRate >= 90 ? 'Active' : 
                  patient.adherenceRate >= 80 ? 'At Risk' : 'Critical',
          medications: (patient.medications || []).map((med) => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            time: med.times?.[0] || '08:00',
            taken: Math.random() > 0.3
          }))
        }));

        setPatients(patientsData);
        
        // Save to localStorage for analytics
        localStorage.setItem('doctorPatients', JSON.stringify(patientsData));
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load patients:', error);
        toast.error('Failed to load patients');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate stats
  const totalPatients = patients.length;
  const averageAdherence = patients.length > 0
    ? Math.round(patients.reduce((sum, p) => sum + p.adherence, 0) / patients.length)
    : 0;
  const totalMedications = patients.reduce((sum, p) => sum + p.medications.length, 0);
  const atRiskPatients = patients.filter(p => p.status === 'At Risk' || p.status === 'Critical').length;

  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      case 'At Risk':
        return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      case 'Critical':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  // Handle check interactions
  const handleCheckInteractions = (patient: PatientData) => {
    if (patient.medications.length === 0) {
      toast.info('No medications to check', {
        description: `${patient.name} has no active medications`,
      });
      return;
    }

    const medications = patient.medications.map(m => ({
      id: m.id,
      name: m.name
    }));

    const result = checkMedicationInteractions(medications);

    if (!result.hasInteractions) {
      toast.success('No interactions found', {
        description: `${patient.name}'s medications are safe to take together`,
        duration: 3000,
      });
    } else {
      const critical = result.interactions.filter(i => i.severity === 'critical').length;
      const major = result.interactions.filter(i => i.severity === 'major').length;
      
      toast.error(`${result.interactions.length} interaction${result.interactions.length > 1 ? 's' : ''} found!`, {
        description: critical > 0 
          ? `🚨 ${critical} CRITICAL interaction${critical > 1 ? 's' : ''}! Review immediately.`
          : `⚠️ ${major} major interaction${major > 1 ? 's' : ''}. Review recommended.`,
        duration: 6000,
      });
    }

    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
  };

  // Handle view side effects
  const handleViewSideEffects = (medName: string, patientName: string) => {
    const sideEffects = getMedicationSideEffects(medName);

    if (!sideEffects) {
      toast.info('No side effects data', {
        description: `Side effects database doesn't have information for ${medName}`,
        duration: 3000,
      });
      return;
    }

    const commonCount = sideEffects.commonSideEffects.length;
    const seriousCount = sideEffects.seriousSideEffects.length;
    const warningsCount = sideEffects.warnings.length;

    toast.info(`${medName} Side Effects`, {
      description: `Common: ${commonCount} | Serious: ${seriousCount} | Warnings: ${warningsCount}`,
      duration: 5000,
    });

    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Handle edit/prescribe medication
  const handlePrescribeMedication = (patient: PatientData) => {
    const prescribeData = {
      patientId: patient.id,
      patientName: patient.name
    };
    localStorage.setItem('prescribeMedicationData', JSON.stringify(prescribeData));
    setCurrentPage('add');
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Handle edit existing medication
  const handleEditMedication = (med: any, patient: PatientData) => {
    // Create a complete medication object for editing
    const editData = {
      id: med.id,
      name: med.name,
      dosage: med.dosage,
      form: 'Tablet', // Default form
      times: [med.time],
      mealTiming: 'anytime',
      daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      duration: '30 Days',
      instructions: '',
      photo: null,
      // Context info
      context: 'doctor',
      patientId: patient.id,
      patientName: patient.name
    };
    localStorage.setItem('editMedicationData', JSON.stringify(editData));
    setCurrentPage('edit-medication');
    if ('vibrate' in navigator) navigator.vibrate(30);
    toast.info(`Editing ${med.name} for ${patient.name}`);
  };

  // Handle delete medication
  const handleDeleteMedication = async (medId: string, medName: string, patient: PatientData) => {
    const confirmMsg = `Are you sure you want to delete ${medName} for ${patient.name}?\n\nThis action cannot be undone.`;
    if (confirm(confirmMsg)) {
      try {
        setPatients(prev => 
          prev.map(p => 
            p.id === patient.id
              ? { ...p, medications: p.medications.filter(m => m.id !== medId) }
              : p
          )
        );
        toast.success(`${medName} deleted successfully`);
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
      } catch (error) {
        console.error('Failed to delete medication:', error);
        toast.error('Failed to delete medication');
      }
    }
  };

  // Handle print all medications
  const handlePrintAll = (patient: PatientData) => {
    const printData = {
      personName: patient.name,
      prescriptions: patient.medications,
      doctorInfo: {
        name: 'Dr. James Anderson',
        specialty: 'General Practitioner'
      }
    };
    localStorage.setItem('printScheduleData', JSON.stringify(printData));
    setCurrentPage('print');
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <Skeleton className="h-10 w-64 mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (patients.length === 0) {
    return (
      <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Stethoscope className="w-12 h-12 text-indigo-600 dark:text-indigo-400" strokeWidth={1.5} />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No Patients Yet
            </h2>
            
            <p className={`text-lg mb-8 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Start managing patient care by inviting your first patient.
            </p>

            <Button
              onClick={() => setCurrentPage('add-patient')}
              className="h-14 px-8 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="w-6 h-6 mr-2" strokeWidth={2} />
              Invite First Patient
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Compact Stats - Single Line Format
  const compactStats = `${totalPatients} Patient${totalPatients !== 1 ? 's' : ''} • ${averageAdherence}% Adherence • ${totalMedications} Rx${atRiskPatients > 0 ? ` • ${atRiskPatients} At Risk` : ''}`;

  // Main Dashboard View - PROFESSIONAL MEDICAL UI
  return (
    <div className={`min-h-screen overflow-x-hidden pb-24 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-indigo-50/30'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Professional Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
              </div>
              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                My Patients
              </h1>
            </div>
            <p className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'} ml-0 sm:ml-13`}>
              {compactStats}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentPage('add-patient')}
              className="h-10 sm:h-12 lg:h-14 px-3 sm:px-4 lg:px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">Invite</span>
            </Button>
            <Button
              onClick={() => {
                // Update localStorage with latest data before navigating
                localStorage.setItem('doctorPatients', JSON.stringify(patients));
                setCurrentPage('doctor-analytics');
                if ('vibrate' in navigator) navigator.vibrate(30);
              }}
              variant="outline"
              className={`h-10 sm:h-12 lg:h-14 px-3 sm:px-4 lg:px-6 border-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-white'} shadow-sm hover:shadow transition-all duration-200`}
              title="View Analytics"
            >
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">Analytics</span>
            </Button>
          </div>
        </div>

        {/* Professional Patient Cards */}
        <div className="space-y-4">
          {patients.map((patient, index) => {
            const age = calculateAge(patient.dateOfBirth);
            const isExpanded = expandedPatient === patient.id;

            return (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`overflow-hidden border ${darkMode ? 'bg-slate-900/50 border-slate-800 backdrop-blur-sm' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'} transition-all duration-200`}>
                  
                  {/* Card Header */}
                  <div 
                    className={`p-3 sm:p-5 lg:p-6 cursor-pointer ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} transition-colors`}
                    onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}
                  >
                    <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-6">
                      
                      {/* Avatar + Info */}
                      <div className="flex items-start sm:items-center gap-3 sm:gap-5 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                            <AvatarImage src={patient.photoUrl} alt={patient.name} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-700 dark:text-indigo-400">
                              {patient.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-5 sm:h-5 rounded-full border-2 ${darkMode ? 'border-slate-900' : 'border-white'} ${
                            patient.status === 'Active' ? 'bg-emerald-500' :
                            patient.status === 'At Risk' ? 'bg-amber-500' :
                            'bg-rose-500'
                          }`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                            <h3 className={`text-base sm:text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} truncate`}>
                              {patient.name}
                            </h3>
                            <Badge className={`text-xs font-medium px-2 py-0.5 ${getStatusColor(patient.status)}`}>
                              {patient.status}
                            </Badge>
                          </div>
                          <p className={`text-xs sm:text-sm lg:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <span className="hidden sm:inline">{age} years • {patient.adherence}% adherence • {patient.medications.length} medication{patient.medications.length !== 1 ? 's' : ''}</span>
                            <span className="sm:hidden">{age} yrs • {patient.adherence}% • {patient.medications.length} med{patient.medications.length !== 1 ? 's' : ''}</span>
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons - Mobile Optimized */}
                      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        {/* Print - Hidden on mobile */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintAll(patient);
                          }}
                          variant="outline"
                          size="sm"
                          className={`hidden sm:flex h-10 w-10 lg:h-14 lg:w-14 p-0 rounded-xl border-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800 hover:border-slate-600' : 'border-slate-300 hover:bg-slate-100 hover:border-slate-400'} transition-all duration-200 shadow-sm hover:shadow touch-manipulation`}
                          title="Print Schedule"
                        >
                          <Printer className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
                        </Button>

                        {/* View All - Icon only on mobile */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('selectedPatient', JSON.stringify(patient));
                            setCurrentPage('patient-details');
                          }}
                          variant="outline"
                          size="sm"
                          className={`h-10 w-10 sm:h-12 sm:w-auto lg:h-14 sm:px-4 lg:px-6 p-0 rounded-xl border-2 ${darkMode ? 'border-indigo-700 hover:bg-indigo-950/30 text-indigo-400 hover:border-indigo-600' : 'border-indigo-300 hover:bg-indigo-50 text-indigo-600 hover:border-indigo-400'} transition-all duration-200 shadow-sm hover:shadow touch-manipulation`}
                          title="View All Medications"
                        >
                          <Edit2 className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2} />
                          <span className="hidden sm:inline sm:ml-2 font-semibold">View All</span>
                        </Button>

                        {/* Prescribe - Icon only on mobile */}
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrescribeMedication(patient);
                          }}
                          size="sm"
                          className="h-10 w-10 sm:h-12 sm:w-auto lg:h-14 sm:px-4 lg:px-6 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-indigo-600/20 rounded-xl touch-manipulation"
                          title="Prescribe New Medication"
                        >
                          <Plus className="w-4 h-4 lg:w-6 lg:h-6" strokeWidth={2.5} />
                          <span className="hidden sm:inline sm:ml-2 font-semibold">Prescribe</span>
                        </Button>

                        {/* Expand indicator */}
                        <div className={`p-1 sm:p-2 lg:p-3 rounded-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'} shrink-0 touch-manipulation cursor-pointer`}>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
                          ) : (
                            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" strokeWidth={2.5} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medications Preview - Show first 2 medications when collapsed */}
                    {!isExpanded && patient.medications.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {patient.medications.slice(0, 2).map((med) => (
                          <div
                            key={med.id}
                            className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  med.taken 
                                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30' 
                                    : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30'
                                }`}>
                                  {med.taken ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                                  ) : (
                                    <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-base font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {med.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                      {med.dosage}
                                    </p>
                                    <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>•</span>
                                    <p className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                      {getTimeString(med.time)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditMedication(med, patient);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className={`h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-lg ${darkMode ? 'hover:bg-blue-950/30 text-slate-400 hover:text-blue-400' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600'} transition-all duration-200 touch-manipulation`}
                                  title="Edit"
                                >
                                  <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                </Button>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMedication(med.id, med.name, patient);
                                  }}
                                  size="sm"
                                  variant="ghost"
                                  className={`h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-lg ${darkMode ? 'hover:bg-rose-950/30 text-slate-400 hover:text-rose-400' : 'hover:bg-rose-50 text-slate-600 hover:text-rose-600'} transition-all duration-200 touch-manipulation`}
                                  title="Delete"
                                >
                                  <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                        {patient.medications.length > 2 && (
                          <p className={`text-sm text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            +{patient.medications.length - 2} more • Click to expand
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Expanded Medications */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`border-t ${darkMode ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'}`}
                    >
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                            Current Medications ({patient.medications.length})
                          </h4>
                          <Button
                            onClick={() => handlePrescribeMedication(patient)}
                            size="sm"
                            className="h-9 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5 mr-1.5" strokeWidth={2.5} />
                            Add New
                          </Button>
                        </div>
                        
                        {patient.medications.length === 0 ? (
                          <p className={`text-sm text-center py-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            No medications prescribed yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {patient.medications.map((med) => (
                              <div
                                key={med.id}
                                className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                      med.taken 
                                        ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30' 
                                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30'
                                    }`}>
                                      {med.taken ? (
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                                      ) : (
                                        <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className={`text-base sm:text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {med.name}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                          {med.dosage}
                                        </p>
                                        <span className={`text-xs ${darkMode ? 'text-slate-600' : 'text-slate-400'}`}>•</span>
                                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                          {getTimeString(med.time)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => handleEditMedication(med, patient)}
                                      size="sm"
                                      variant="ghost"
                                      className={`h-14 w-14 sm:h-14 sm:w-14 p-0 rounded-xl ${darkMode ? 'hover:bg-blue-950/30 text-slate-400 hover:text-blue-400 border border-slate-700 hover:border-blue-600' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-400'} transition-all duration-200 touch-manipulation`}
                                      title="Edit Prescription"
                                    >
                                      <Edit2 className="w-6 h-6" strokeWidth={2} />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteMedication(med.id, med.name, patient)}
                                      size="sm"
                                      variant="ghost"
                                      className={`h-14 w-14 sm:h-14 sm:w-14 p-0 rounded-xl ${darkMode ? 'hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-600' : 'hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-400'} transition-all duration-200 touch-manipulation`}
                                      title="Delete Prescription"
                                    >
                                      <Trash2 className="w-6 h-6" strokeWidth={2} />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* FAB - Add Patient */}
      <FABButtons
        role="doctor"
        onAddPatient={() => setCurrentPage('add-patient')}
        darkMode={darkMode}
      />
    </div>
  );
}