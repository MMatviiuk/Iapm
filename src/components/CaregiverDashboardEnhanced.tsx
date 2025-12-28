import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus,
  Pill,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Activity,
  CheckCircle2,
  Edit2,
  Trash2,
  Printer,
  BarChart3,
  Heart
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
import { toast } from 'sonner@2.0.3';
import FABButtons from './FABButtons';

interface CaregiverDashboardEnhancedProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
}

interface DependentData {
  id: string;
  name: string;
  dateOfBirth: string;
  adherence: number;
  photoUrl?: string;
  gender?: 'male' | 'female';
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    taken?: boolean;
  }>;
}

export default function CaregiverDashboardEnhanced({ 
  darkMode, 
  setCurrentPage 
}: CaregiverDashboardEnhancedProps) {
  
  const [dependents, setDependents] = useState<DependentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDependent, setExpandedDependent] = useState<string | null>(null);
  const [sortByRisk, setSortByRisk] = useState(true);
  const [filterMissed, setFilterMissed] = useState(false);

  // Helper: Calculate risk status
  const getRiskStatus = (adherence: number): 'high' | 'medium' | 'low' => {
    if (adherence < 70) return 'high';
    if (adherence < 85) return 'medium';
    return 'low';
  };

  // Filter by missed medications today
  const filteredDependents = filterMissed
    ? dependents.filter(d => {
        const missedToday = d.medications.filter(m => !m.taken).length > 0;
        return missedToday;
      })
    : dependents;

  // Sort dependents by risk (high risk first)
  const sortedDependents = sortByRisk
    ? [...filteredDependents].sort((a, b) => {
        const riskOrder = { high: 0, medium: 1, low: 2 };
        return riskOrder[getRiskStatus(a.adherence)] - riskOrder[getRiskStatus(b.adherence)];
      })
    : filteredDependents;

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const db = await loadDatabase();
        
        // Use Catherine Bennett (cg_001)
        const currentCaregiverId = 'cg_001';
        const myDependents = db.patients.filter(p => p.caregiverId === currentCaregiverId);

        const dependentsData: DependentData[] = myDependents.map(patient => ({
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
          medications: (patient.medications || []).map((med) => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            time: med.times?.[0] || '08:00',
            taken: Math.random() > 0.3
          }))
        }));

        setDependents(dependentsData);
        
        // Save to localStorage for analytics
        localStorage.setItem('caregiverDependents', JSON.stringify(dependentsData));
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to load dependents:', error);
        toast.error('Failed to load dependents');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Calculate stats
  const totalDependents = dependents.length;
  const averageAdherence = dependents.length > 0
    ? Math.round(dependents.reduce((sum, d) => sum + d.adherence, 0) / dependents.length)
    : 0;
  const totalMedications = dependents.reduce((sum, d) => sum + d.medications.length, 0);
  const alerts = dependents.filter(d => d.adherence < 80).length;

  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Handle edit medication
  const handleEditMedication = (med: any, dependent: DependentData) => {
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
      context: 'caregiver',
      dependentId: dependent.id,
      dependentName: dependent.name
    };
    localStorage.setItem('editMedicationData', JSON.stringify(editData));
    setCurrentPage('edit-medication');
    if ('vibrate' in navigator) navigator.vibrate(30);
    toast.info(`Editing ${med.name} for ${dependent.name}`);
  };

  // Handle delete medication
  const handleDeleteMedication = async (medId: string, medName: string, dependent: DependentData) => {
    const confirmMsg = `Are you sure you want to delete ${medName} for ${dependent.name}?\n\nThis action cannot be undone.`;
    if (confirm(confirmMsg)) {
      try {
        setDependents(prev => 
          prev.map(d => 
            d.id === dependent.id
              ? { ...d, medications: d.medications.filter(m => m.id !== medId) }
              : d
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
  const handlePrintAll = (dependent: DependentData) => {
    const printData = {
      personName: dependent.name,
      prescriptions: dependent.medications,
      caregiverInfo: {
        name: 'Catherine Bennett',
        relationship: 'Caregiver'
      }
    };
    localStorage.setItem('printScheduleData', JSON.stringify(printData));
    setCurrentPage('print');
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Loading State
  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
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
  if (dependents.length === 0) {
    return (
      <div className={`min-h-screen overflow-x-hidden ${darkMode ? 'bg-slate-950' : 'bg-slate-50/50'}`}>
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Heart className="w-12 h-12 text-orange-600 dark:text-orange-400" strokeWidth={1.5} />
            </div>
            
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              No Dependents Yet
            </h2>
            
            <p className={`text-lg mb-8 max-w-md mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Start caring for your loved ones by adding them as dependents.
            </p>

            <Button
              onClick={() => setCurrentPage('add-dependent')}
              className="h-14 px-8 text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-6 h-6 mr-2" strokeWidth={2} />
              Add Your First Dependent
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Compact Stats - Single Line Format
  const compactStats = `${totalDependents} Dependent${totalDependents !== 1 ? 's' : ''} • ${averageAdherence}% Adherence • ${totalMedications} Rx${alerts > 0 ? ` • ${alerts} Alert${alerts !== 1 ? 's' : ''}` : ''}`;

  // Main Dashboard View - PROFESSIONAL MEDICAL UI
  return (
    <div className={`min-h-screen overflow-x-hidden pb-24 ${darkMode ? 'bg-slate-950' : 'bg-gradient-to-br from-slate-50 to-orange-50/20'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Professional Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-md">
                <Heart className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                My Dependents
              </h1>
            </div>
            <p className={`text-sm lg:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'} ml-13`}>
              {compactStats}
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => setFilterMissed(!filterMissed)}
              variant="outline"
              className={`h-12 sm:h-14 px-4 sm:px-6 border-2 ${
                filterMissed 
                  ? 'bg-red-50 border-red-500 text-red-700 dark:bg-red-950/30 dark:border-red-700 dark:text-red-400'
                  : darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-white'
              } shadow-sm hover:shadow transition-all duration-200`}
              title={filterMissed ? 'Show all' : 'Show only missed today'}
            >
              <Activity className="w-5 h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">{filterMissed ? 'Missed' : 'All'}</span>
            </Button>
            <Button
              onClick={() => setSortByRisk(!sortByRisk)}
              variant="outline"
              className={`h-12 sm:h-14 px-4 sm:px-6 border-2 ${
                sortByRisk 
                  ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-950/30 dark:border-orange-700 dark:text-orange-400'
                  : darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-white'
              } shadow-sm hover:shadow transition-all duration-200`}
              title={sortByRisk ? 'Sort by name' : 'Sort by risk (high first)'}
            >
              <AlertCircle className="w-5 h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">{sortByRisk ? 'Risk' : 'Name'}</span>
            </Button>
            <Button
              onClick={() => setCurrentPage('add-dependent')}
              className="h-12 sm:h-14 px-4 sm:px-6 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">Add</span>
            </Button>
            <Button
              onClick={() => {
                // Update localStorage with latest data before navigating
                localStorage.setItem('caregiverDependents', JSON.stringify(dependents));
                setCurrentPage('caregiver-analytics');
                if ('vibrate' in navigator) navigator.vibrate(30);
              }}
              variant="outline"
              className={`h-12 sm:h-14 px-4 sm:px-6 border-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-200 hover:bg-white'} shadow-sm hover:shadow transition-all duration-200`}
              title="View Analytics"
            >
              <BarChart3 className="w-5 h-5" strokeWidth={2} />
              <span className="hidden sm:inline ml-2">Analytics</span>
            </Button>
          </div>
        </div>

        {/* Professional Dependent Cards */}
        <div className="space-y-4">
          {sortedDependents.map((dependent, index) => {
            const riskStatus = getRiskStatus(dependent.adherence);
            const age = calculateAge(dependent.dateOfBirth);
            const isExpanded = expandedDependent === dependent.id;

            return (
              <motion.div
                key={dependent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: index * 0.05 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(e, info) => {
                  // Swipe right (>100px): Edit dependent
                  if (info.offset.x > 100) {
                    localStorage.setItem('selectedDependent', JSON.stringify(dependent));
                    setCurrentPage('dependent-details');
                  }
                  // Swipe left (<-100px): Print schedule
                  else if (info.offset.x < -100) {
                    handlePrintAll(dependent);
                  }
                }}
                className="cursor-grab active:cursor-grabbing"
              >
                <Card className={`overflow-hidden border ${darkMode ? 'bg-slate-900/50 border-slate-800 backdrop-blur-sm' : 'bg-white border-slate-200 shadow-sm hover:shadow-md'} transition-all duration-200`}>
                  
                  {/* Card Header */}
                  <div 
                    className={`p-5 sm:p-6 cursor-pointer ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'} transition-colors`}
                    onClick={() => setExpandedDependent(isExpanded ? null : dependent.id)}
                  >
                    <div className="flex items-center justify-between gap-6">
                      
                      {/* Avatar + Info */}
                      <div className="flex items-center gap-5 flex-1">
                        <div className="relative flex-shrink-0">
                          <Avatar className="w-16 h-16 sm:w-20 sm:h-20 ring-2 ring-orange-500/20 ring-offset-2 ring-offset-white dark:ring-offset-slate-900">
                            <AvatarImage 
                              src={dependent.photoUrl} 
                              alt={dependent.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/50 dark:to-amber-950/50 text-orange-700 dark:text-orange-400">
                              {dependent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 ${darkMode ? 'border-slate-900' : 'border-white'} ${
                            dependent.adherence >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {dependent.name}
                            </h3>
                            {riskStatus === 'high' && (
                              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5">
                                High Risk
                              </Badge>
                            )}
                            {riskStatus === 'medium' && sortByRisk && (
                              <Badge className="bg-yellow-500 text-white text-xs px-2 py-0.5">
                                Medium Risk
                              </Badge>
                            )}
                          </div>
                          <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {age} years • {dependent.adherence}% adherence • {dependent.medications.length} medication{dependent.medications.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons - ELDERLY-FRIENDLY LARGE SIZES */}
                      <div className="flex items-center gap-2 sm:gap-2 shrink-0">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrintAll(dependent);
                          }}
                          variant="outline"
                          size="sm"
                          className={`h-12 w-12 sm:h-14 sm:w-14 p-0 rounded-xl border-2 ${darkMode ? 'border-slate-700 hover:bg-slate-800 hover:border-slate-600' : 'border-slate-300 hover:bg-slate-100 hover:border-slate-400'} transition-all duration-200 shadow-sm hover:shadow touch-manipulation`}
                          title="Print Schedule"
                        >
                          <Printer className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            localStorage.setItem('selectedDependent', JSON.stringify(dependent));
                            setCurrentPage('dependent-details');
                          }}
                          size="sm"
                          className="h-12 sm:h-14 w-12 sm:w-auto sm:px-6 p-0 sm:p-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-orange-600/20 rounded-xl touch-manipulation"
                          title="View & Edit All Medications"
                        >
                          <Edit2 className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                          <span className="hidden sm:inline sm:ml-2 font-semibold">Edit</span>
                        </Button>

                        <div className={`p-2 sm:p-3 rounded-xl ${darkMode ? 'text-slate-400' : 'text-slate-600'} shrink-0 touch-manipulation cursor-pointer`}>
                          {isExpanded ? (
                            <ChevronUp className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
                          ) : (
                            <ChevronDown className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Medications Preview - Show first 2 medications when collapsed */}
                    {!isExpanded && dependent.medications.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {dependent.medications.slice(0, 2).map((med) => (
                          <div
                            key={med.id}
                            className={`p-3 rounded-lg border ${darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  med.taken 
                                    ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30' 
                                    : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30'
                                }`}>
                                  {med.taken ? (
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                                  ) : (
                                    <Pill className="w-5 h-5 text-orange-600 dark:text-orange-400" strokeWidth={2} />
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
                                    <p className={`text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                      {getTimeString(med.time)}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditMedication(med, dependent);
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
                                    handleDeleteMedication(med.id, med.name, dependent);
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
                        {dependent.medications.length > 2 && (
                          <p className={`text-sm text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            +{dependent.medications.length - 2} more • Click to expand
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
                        <h4 className={`text-base font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                          Medications ({dependent.medications.length})
                        </h4>
                        
                        {dependent.medications.length === 0 ? (
                          <p className={`text-sm text-center py-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            No medications yet
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {dependent.medications.map((med) => (
                              <div
                                key={med.id}
                                className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'} shadow-sm`}
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                      med.taken 
                                        ? 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30' 
                                        : 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30'
                                    }`}>
                                      {med.taken ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                                      ) : (
                                        <Pill className="w-6 h-6 text-orange-600 dark:text-orange-400" strokeWidth={2} />
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
                                        <p className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                          {getTimeString(med.time)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Button
                                      onClick={() => handleEditMedication(med, dependent)}
                                      size="sm"
                                      variant="ghost"
                                      className={`h-14 w-14 sm:h-14 sm:w-14 p-0 rounded-xl ${darkMode ? 'hover:bg-blue-950/30 text-slate-400 hover:text-blue-400 border border-slate-700 hover:border-blue-600' : 'hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-400'} transition-all duration-200 touch-manipulation`}
                                      title="Edit Dosage"
                                    >
                                      <Edit2 className="w-6 h-6" strokeWidth={2} />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteMedication(med.id, med.name, dependent)}
                                      size="sm"
                                      variant="ghost"
                                      className={`h-14 w-14 sm:h-14 sm:w-14 p-0 rounded-xl ${darkMode ? 'hover:bg-rose-950/30 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-600' : 'hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-400'} transition-all duration-200 touch-manipulation`}
                                      title="Delete Medication"
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

      {/* FAB - Add Dependent */}
      <FABButtons
        role="caregiver"
        onAddDependent={() => setCurrentPage('add-dependent')}
        darkMode={darkMode}
      />
    </div>
  );
}