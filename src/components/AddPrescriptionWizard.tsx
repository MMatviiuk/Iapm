import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Check,
  Pill,
  Clock,
  FileText,
  Camera,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { TooltipProvider } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import PhotoUploader from './PhotoUploader';
import { getSuccessMessage, formatSuccessForToast } from '../utils/successMessages';
import { checkNewMedicationSafety, type InteractionCheckResult } from '../utils/drugInteractionChecker';
import DrugInteractionWarning from './DrugInteractionWarning';

interface AddPrescriptionWizardProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  addMedication: (newMed: any) => void;
  existingMedications?: any[]; // For medication interaction checking
}

// Calculate medication time based on meal schedule
const calculateTime = (timeOfDay: 'morning' | 'afternoon' | 'evening', mealTiming: string): string => {
  const mealSchedule = {
    morning: '08:00',
    afternoon: '13:00',
    evening: '19:00'
  };

  const baseTime = mealSchedule[timeOfDay];
  const [hours, minutes] = baseTime.split(':').map(Number);

  let adjustedHours = hours;
  let adjustedMinutes = minutes;

  if (mealTiming === 'before meal') {
    adjustedMinutes -= 30;
    if (adjustedMinutes < 0) {
      adjustedMinutes += 60;
      adjustedHours -= 1;
    }
  } else if (mealTiming === 'after meal') {
    adjustedMinutes += 30;
    if (adjustedMinutes >= 60) {
      adjustedMinutes -= 60;
      adjustedHours += 1;
    }
  }

  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
};

// 8 Core Medication Forms (elderly-optimized)
const MEDICATION_FORMS = [
  'Tablet',
  'Capsule',
  'Liquid/Syrup',
  'Injection',
  'Cream/Ointment',
  'Inhaler',
  'Powder',
  'Other'
];

export default function AddPrescriptionWizard({ 
  darkMode, 
  setCurrentPage, 
  addMedication,
  existingMedications = []
}: AddPrescriptionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [interactionResult, setInteractionResult] = useState<InteractionCheckResult | null>(null);
  const [showInteractionWarning, setShowInteractionWarning] = useState(false);
  
  const [formData, setFormData] = useState({
    // Step 1: Essential Info
    name: '',
    dosageMg: '500',
    form: 'Tablet',
    quantity: '1',
    
    // Step 2: When to Take
    scheduleMode: 'preset', // 'preset' | 'custom' | 'frequency'
    timesPerDay: 1,
    timeOfDay: {
      morning: true,
      afternoon: false,
      evening: false
    },
    customTimes: ['08:00'], // For custom time mode
    frequencyHours: 4, // For "Every X hours" mode
    mealTiming: 'before meal',
    morningTime: calculateTime('morning', 'before meal'),
    afternoonTime: calculateTime('afternoon', 'before meal'),
    eveningTime: calculateTime('evening', 'before meal'),
    daysOfWeek: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true
    },
    
    // Step 3: Optional Details
    durationMode: 'preset', // 'preset' | 'exact'
    durationNumber: '30',
    exactDays: 14, // For exact days mode
    unit: 'Days',
    lifetime: false,
    specialInstructions: '',
    image: null as string | null
  });

  // Track selection order for "Twice daily" FIFO behavior
  const [selectionOrder, setSelectionOrder] = useState<Array<'morning' | 'afternoon' | 'evening'>>([]);

  const daysLabels = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' }
  ];

  // Load saved "Twice daily" preference on mount
  useEffect(() => {
    const savedTwiceDailyPreference = localStorage.getItem('twiceDailyPreference');
    if (savedTwiceDailyPreference) {
      try {
        const parsed = JSON.parse(savedTwiceDailyPreference);
        if (parsed && Object.values(parsed).filter(Boolean).length === 2) {
          // Saved for later use
        }
      } catch (e) {
        // Invalid data, ignore
      }
    }
  }, []);

  // Progress calculation
  const progressPercentage = (currentStep / 3) * 100;

  // Validation for each step
  const canProceedStep1 = () => {
    return formData.name.trim().length > 0 && formData.dosageMg.trim().length > 0;
  };

  const canProceedStep2 = () => {
    const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
    return selectedCount === formData.timesPerDay;
  };

  // Handle Next button
  const handleNext = () => {
    if (currentStep === 1 && !canProceedStep1()) {
      toast.error('Required Fields Missing', {
        description: 'Please fill in medication name and dosage',
        duration: 3000,
      });
      return;
    }

    if (currentStep === 2 && !canProceedStep2()) {
      const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
      toast.error(`Please Select ${formData.timesPerDay} Time${formData.timesPerDay > 1 ? 's' : ''}`, {
        description: `You selected ${selectedCount} but need ${formData.timesPerDay} for ${formData.timesPerDay === 1 ? 'once' : formData.timesPerDay === 2 ? 'twice' : 'three times'} daily`,
        duration: 3000,
      });
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle Back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle Skip Step 3
  const handleSkipOptional = () => {
    handleSubmit();
  };

  // Handle Submit
  const handleSubmit = () => {
    // Build list of selected times
    const times: string[] = [];
    if (formData.timeOfDay.morning) times.push(formData.morningTime);
    if (formData.timeOfDay.afternoon) times.push(formData.afternoonTime);
    if (formData.timeOfDay.evening) times.push(formData.eveningTime);

    const primaryTime = times[0] || '08:00';
    
    const newMedication = {
      name: formData.name,
      time: primaryTime,
      dosage: `${formData.dosageMg}mg - ${formData.quantity} ${formData.form.toLowerCase()}${formData.quantity !== '1' ? 's' : ''} ${formData.mealTiming}`,
      duration: formData.lifetime ? 'Ongoing' : `${formData.durationNumber} ${formData.unit.toLowerCase()}`,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      taken: false,
      quantity: formData.quantity,
      dosageMg: formData.dosageMg,
      form: formData.form,
      timesPerDay: formData.timesPerDay,
      mealTiming: formData.mealTiming,
      timeOfDay: formData.timeOfDay,
      morningTime: formData.morningTime,
      afternoonTime: formData.afternoonTime,
      eveningTime: formData.eveningTime,
      exactTime: primaryTime,
      daysOfWeek: formData.daysOfWeek,
      durationNumber: formData.durationNumber,
      unit: formData.unit,
      lifetime: formData.lifetime,
      specialInstructions: formData.specialInstructions,
      image: formData.image
    };
    
    // Check for medication interactions if there are existing medications
    if (existingMedications.length > 0) {
      const result = checkNewMedicationSafety(
        { id: 'new', name: formData.name },
        existingMedications.map(med => ({ id: med.id, name: med.name }))
      );
      
      if (result.hasInteractions) {
        setInteractionResult(result);
        setShowInteractionWarning(true);
        
        // For critical/major interactions, block adding until reviewed
        if (!result.safeToTake) {
          toast.error('Medication Interaction Detected', {
            description: 'Please review the interaction warning before adding this medication.',
            duration: 5000,
          });
          return; // Stop here - user must review warnings
        }
      }
    }
    
    addMedication(newMedication);
    
    // Save "Twice daily" preference
    if (formData.timesPerDay === 2) {
      localStorage.setItem('twiceDailyPreference', JSON.stringify(formData.timeOfDay));
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    // Success message using new utility
    const successInfo = getSuccessMessage('medication added', { 
      name: formData.name,
      dosage: `${formData.dosageMg}mg`
    });
    
    toast.success(formatSuccessForToast('medication added', { name: formData.name }), {
      description: successInfo.message,
      duration: 3000,
    });
    
    setTimeout(() => {
      setCurrentPage('medications-list');
    }, 500);
  };

  // Handle times per day change
  const handleTimesPerDayChange = (times: number) => {
    let newTimeOfDay;
    let newSelectionOrder: Array<'morning' | 'afternoon' | 'evening'> = [];
    
    if (times === 2) {
      // Load saved "Twice daily" preference
      const savedTwiceDailyPreference = localStorage.getItem('twiceDailyPreference');
      if (savedTwiceDailyPreference) {
        try {
          const parsed = JSON.parse(savedTwiceDailyPreference);
          if (parsed && Object.values(parsed).filter(Boolean).length === 2) {
            newTimeOfDay = parsed;
            if (parsed.morning) newSelectionOrder.push('morning');
            if (parsed.afternoon) newSelectionOrder.push('afternoon');
            if (parsed.evening) newSelectionOrder.push('evening');
          } else {
            newTimeOfDay = { morning: true, afternoon: true, evening: false };
            newSelectionOrder = ['morning', 'afternoon'];
          }
        } catch (e) {
          newTimeOfDay = { morning: true, afternoon: true, evening: false };
          newSelectionOrder = ['morning', 'afternoon'];
        }
      } else {
        newTimeOfDay = { morning: true, afternoon: true, evening: false };
        newSelectionOrder = ['morning', 'afternoon'];
      }
    } else {
      newTimeOfDay = {
        morning: times >= 1,
        afternoon: times >= 2,
        evening: times === 3
      };
      newSelectionOrder = [];
    }
    
    setSelectionOrder(newSelectionOrder);
    setFormData({
      ...formData,
      timesPerDay: times,
      timeOfDay: newTimeOfDay
    });
  };

  // Handle time of day toggle (FIFO for twice daily)
  const handleTimeOfDayToggle = (period: 'morning' | 'afternoon' | 'evening') => {
    if (formData.timesPerDay === 2) {
      // FIFO behavior for "Twice daily"
      const currentlySelected = formData.timeOfDay[period];
      
      if (currentlySelected) {
        // Unselecting
        const newSelectionOrder = selectionOrder.filter(p => p !== period);
        setSelectionOrder(newSelectionOrder);
        setFormData({
          ...formData,
          timeOfDay: {
            ...formData.timeOfDay,
            [period]: false
          }
        });
      } else {
        // Selecting
        const currentCount = Object.values(formData.timeOfDay).filter(Boolean).length;
        
        if (currentCount < 2) {
          // Can add more
          const newSelectionOrder = [...selectionOrder, period];
          setSelectionOrder(newSelectionOrder);
          setFormData({
            ...formData,
            timeOfDay: {
              ...formData.timeOfDay,
              [period]: true
            }
          });
        } else {
          // Remove oldest (FIFO)
          const oldestPeriod = selectionOrder[0];
          const newSelectionOrder = [...selectionOrder.slice(1), period];
          setSelectionOrder(newSelectionOrder);
          setFormData({
            ...formData,
            timeOfDay: {
              ...formData.timeOfDay,
              [oldestPeriod]: false,
              [period]: true
            }
          });
        }
      }
    } else {
      // Normal toggle for once/three times daily
      setFormData({
        ...formData,
        timeOfDay: {
          ...formData.timeOfDay,
          [period]: !formData.timeOfDay[period]
        }
      });
    }
  };

  // Handle meal timing change
  const handleMealTimingChange = (newMealTiming: string) => {
    setFormData({
      ...formData,
      mealTiming: newMealTiming,
      morningTime: calculateTime('morning', newMealTiming),
      afternoonTime: calculateTime('afternoon', newMealTiming),
      eveningTime: calculateTime('evening', newMealTiming)
    });
  };

  return (
    <TooltipProvider>
      <div className={`min-h-screen pb-6 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
        {/* Header */}
        <div className={`border-b-2 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10 shadow-sm ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        }`}>
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => setCurrentPage('medications-list')}
                className={`p-2 sm:p-2.5 rounded-lg transition-colors touch-manipulation ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                aria-label="Go back"
              >
                <ArrowLeft size={24} className={`sm:w-7 sm:h-7 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`} strokeWidth={2.5} />
              </button>
              <div>
                <h1 className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Add Medication
                </h1>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Step {currentStep} of 3
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
          />
          <div className="flex justify-between mt-2">
            <span className={`text-sm ${currentStep === 1 ? 'font-bold text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Essential
            </span>
            <span className={`text-sm ${currentStep === 2 ? 'font-bold text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              When to Take
            </span>
            <span className={`text-sm ${currentStep === 3 ? 'font-bold text-blue-600' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Optional
            </span>
          </div>
        </div>

        {/* Steps Content */}
        <div className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {/* STEP 1: Essential Info */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-5 sm:p-6 border-2 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white border-blue-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                  }`}>
                    <Pill className={`w-6 h-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Essential Information
                    </h2>
                    <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Basic medication details
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Medication Name */}
                  <FieldWithTooltip
                    label="Medication Name"
                    tooltip="The name of your medication (e.g., Aspirin, Metformin)"
                    required
                    darkMode={darkMode}
                  >
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[56px] sm:min-h-[60px] ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="e.g., Aspirin"
                      required
                      autoFocus
                    />
                  </FieldWithTooltip>

                  {/* Dosage and Form */}
                  <div className="grid grid-cols-2 gap-4">
                    <FieldWithTooltip
                      label="Dosage (mg)"
                      tooltip="The strength of one dose in milligrams (e.g., 500mg)"
                      required
                      darkMode={darkMode}
                    >
                      <input
                        type="number"
                        inputMode="numeric"
                        value={formData.dosageMg}
                        onChange={(e) => setFormData({ ...formData, dosageMg: e.target.value })}
                        placeholder="500"
                        min="1"
                        required
                        className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[56px] sm:min-h-[60px] ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </FieldWithTooltip>

                    <FieldWithTooltip
                      label="Form"
                      tooltip="How you take this medication (tablet, liquid, injection, etc.)"
                      required
                      darkMode={darkMode}
                    >
                      <select
                        value={formData.form}
                        onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                        className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[56px] sm:min-h-[60px] ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        {MEDICATION_FORMS.map(form => (
                          <option key={form} value={form}>{form}</option>
                        ))}
                      </select>
                    </FieldWithTooltip>
                  </div>

                  {/* Quantity */}
                  <FieldWithTooltip
                    label="Quantity per Dose"
                    tooltip="How many tablets/capsules to take each time (usually 1)"
                    darkMode={darkMode}
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="1"
                      min="1"
                      max="10"
                      required
                      className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[56px] sm:min-h-[60px] ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </FieldWithTooltip>
                </div>
              </motion.div>
            )}

            {/* STEP 2: When to Take */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-5 sm:p-6 border-2 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white border-green-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-green-900/30' : 'bg-green-100'
                  }`}>
                    <Clock className={`w-6 h-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      When to Take
                    </h2>
                    <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.name ? `Schedule for ${formData.name}` : 'Schedule and timing'}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Times Per Day */}
                  <FieldWithTooltip
                    label="How Many Times Per Day?"
                    tooltip="How often you need to take this medication each day"
                    required
                    darkMode={darkMode}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map(times => (
                        <button
                          key={times}
                          type="button"
                          onClick={() => handleTimesPerDayChange(times)}
                          className={`h-14 sm:h-16 rounded-lg border-2 transition-all touch-manipulation ${
                            formData.timesPerDay === times
                              ? darkMode
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-blue-600 border-blue-500 text-white'
                              : darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                          }`}
                        >
                          <span className="block">{times}×</span>
                          <span className="block text-xs sm:text-sm">
                            {times === 1 ? 'Once' : times === 2 ? 'Twice' : 'Three times'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </FieldWithTooltip>

                  {/* ✅ NEW: Schedule Mode Selection */}
                  <FieldWithTooltip
                    label="Schedule Type"
                    tooltip="Choose how to set medication times"
                    required
                    darkMode={darkMode}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleMode: 'preset' })}
                        className={`h-16 sm:h-18 rounded-lg border-2 transition-all touch-manipulation ${
                          formData.scheduleMode === 'preset'
                            ? darkMode
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-purple-600 border-purple-500 text-white'
                            : darkMode
                              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 hover:border-purple-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="block text-sm sm:text-base">Preset Times</span>
                          <span className="block text-xs opacity-70">Morning/Afternoon/Evening</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleMode: 'custom' })}
                        className={`h-16 sm:h-18 rounded-lg border-2 transition-all touch-manipulation ${
                          formData.scheduleMode === 'custom'
                            ? darkMode
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-purple-600 border-purple-500 text-white'
                            : darkMode
                              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 hover:border-purple-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="block text-sm sm:text-base">Custom Times</span>
                          <span className="block text-xs opacity-70">Set exact times</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, scheduleMode: 'frequency' })}
                        className={`h-16 sm:h-18 rounded-lg border-2 transition-all touch-manipulation ${
                          formData.scheduleMode === 'frequency'
                            ? darkMode
                              ? 'bg-purple-600 border-purple-500 text-white'
                              : 'bg-purple-600 border-purple-500 text-white'
                            : darkMode
                              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 hover:border-purple-400'
                        }`}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <span className="block text-sm sm:text-base">Every X Hours</span>
                          <span className="block text-xs opacity-70">Frequency mode</span>
                        </div>
                      </button>
                    </div>
                  </FieldWithTooltip>

                  {/* Preset Times Mode */}
                  {formData.scheduleMode === 'preset' && (
                    <>
                      {/* Time of Day */}
                      <FieldWithTooltip
                        label={`Select ${formData.timesPerDay} Time${formData.timesPerDay > 1 ? 's' : ''} of Day`}
                        tooltip={formData.timesPerDay === 2 ? "Click to change which 2 times. First click replaces oldest selection." : "Select when to take your medication"}
                        required
                        darkMode={darkMode}
                      >
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { key: 'morning', label: 'Morning', time: '8 AM' },
                            { key: 'afternoon', label: 'Afternoon', time: '1 PM' },
                            { key: 'evening', label: 'Evening', time: '7 PM' }
                          ].map(period => (
                            <button
                              key={period.key}
                              type="button"
                              onClick={() => handleTimeOfDayToggle(period.key as 'morning' | 'afternoon' | 'evening')}
                              className={`h-16 sm:h-20 rounded-lg border-2 transition-all touch-manipulation ${
                                formData.timeOfDay[period.key as keyof typeof formData.timeOfDay]
                                  ? darkMode
                                    ? 'bg-green-600 border-green-500 text-white'
                                    : 'bg-green-600 border-green-500 text-white'
                                  : darkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-green-500'
                                    : 'bg-white border-gray-300 text-gray-900 hover:border-green-400'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span className="block text-base sm:text-lg">{period.label}</span>
                                <span className="block text-xs sm:text-sm opacity-70">{period.time}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </FieldWithTooltip>
                    </>
                  )}

                  {/* ✅ NEW: Custom Times Mode */}
                  {formData.scheduleMode === 'custom' && (
                    <FieldWithTooltip
                      label="Set Exact Times"
                      tooltip="Enter the exact time(s) to take your medication"
                      required
                      darkMode={darkMode}
                    >
                      <div className="space-y-3">
                        {formData.customTimes.map((time, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="time"
                              value={time}
                              onChange={(e) => {
                                const newTimes = [...formData.customTimes];
                                newTimes[index] = e.target.value;
                                setFormData({ ...formData, customTimes: newTimes });
                              }}
                              className={`flex-1 px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] ${
                                darkMode
                                  ? 'bg-gray-700 border-gray-600 text-white'
                                  : 'bg-white border-gray-300 text-gray-900'
                              }`}
                            />
                            {formData.customTimes.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const newTimes = formData.customTimes.filter((_, i) => i !== index);
                                  setFormData({ ...formData, customTimes: newTimes });
                                }}
                                className={`p-3 rounded-lg border-2 hover:bg-red-50 hover:border-red-500 ${
                                  darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300'
                                }`}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        {formData.customTimes.length < formData.timesPerDay && (
                          <button
                            type="button"
                            onClick={() => setFormData({ 
                              ...formData, 
                              customTimes: [...formData.customTimes, '12:00'] 
                            })}
                            className={`w-full h-12 rounded-lg border-2 border-dashed transition-all ${
                              darkMode
                                ? 'border-gray-600 text-gray-400 hover:border-blue-500 hover:text-blue-400'
                                : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                            }`}
                          >
                            + Add Time
                          </button>
                        )}
                      </div>
                    </FieldWithTooltip>
                  )}

                  {/* ✅ NEW: Frequency Mode (Every X Hours) */}
                  {formData.scheduleMode === 'frequency' && (
                    <FieldWithTooltip
                      label="Take Every X Hours"
                      tooltip="How many hours between each dose"
                      required
                      darkMode={darkMode}
                    >
                      <div className="grid grid-cols-4 gap-3">
                        {[4, 6, 8, 12].map(hours => (
                          <button
                            key={hours}
                            type="button"
                            onClick={() => setFormData({ ...formData, frequencyHours: hours })}
                            className={`h-16 sm:h-18 rounded-lg border-2 transition-all touch-manipulation ${
                              formData.frequencyHours === hours
                                ? darkMode
                                  ? 'bg-orange-600 border-orange-500 text-white'
                                  : 'bg-orange-600 border-orange-500 text-white'
                                : darkMode
                                  ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-orange-500'
                                  : 'bg-white border-gray-300 text-gray-900 hover:border-orange-400'
                            }`}
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="block text-xl">{hours}h</span>
                              <span className="block text-xs opacity-70">Every {hours} hrs</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className={`mt-3 p-3 rounded-lg ${
                        darkMode ? 'bg-orange-900/20 border border-orange-700' : 'bg-orange-50 border border-orange-200'
                      }`}>
                        <p className={`text-sm ${darkMode ? 'text-orange-300' : 'text-orange-800'}`}>
                          📅 <strong>Example:</strong> Every {formData.frequencyHours} hours = {24 / formData.frequencyHours} times per day
                          <br/>
                          🕐 Starting at 8:00 AM → {formData.frequencyHours === 4 && '8AM, 12PM, 4PM, 8PM, 12AM, 4AM'}
                          {formData.frequencyHours === 6 && '8AM, 2PM, 8PM, 2AM'}
                          {formData.frequencyHours === 8 && '8AM, 4PM, 12AM'}
                          {formData.frequencyHours === 12 && '8AM, 8PM'}
                        </p>
                      </div>
                    </FieldWithTooltip>
                  )}

                  {/* Meal Timing - Only for Preset mode */}
                  {formData.scheduleMode === 'preset' && (
                    <FieldWithTooltip
                      label="Meal Timing"
                      tooltip="When to take relative to meals (affects automatic time calculation)"
                      required
                      darkMode={darkMode}
                    >
                      <select
                        value={formData.mealTiming}
                        onChange={(e) => handleMealTimingChange(e.target.value)}
                        className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[56px] sm:min-h-[60px] ${
                          darkMode
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                        }`}
                      >
                        <option value="before meal">Before Meal (30 min before)</option>
                        <option value="with meal">With Meal</option>
                        <option value="after meal">After Meal (30 min after)</option>
                        <option value="anytime">Anytime</option>
                      </select>
                    </FieldWithTooltip>
                  )}

                  {/* Days of Week */}
                  <FieldWithTooltip
                    label="Days to Take"
                    tooltip="Which days of the week to take this medication (default: every day)"
                    darkMode={darkMode}
                  >
                    <div className="grid grid-cols-7 gap-2">
                      {daysLabels.map(day => (
                        <button
                          key={day.key}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            daysOfWeek: {
                              ...formData.daysOfWeek,
                              [day.key]: !formData.daysOfWeek[day.key as keyof typeof formData.daysOfWeek]
                            }
                          })}
                          className={`h-12 sm:h-14 rounded-lg border-2 text-sm sm:text-base transition-all touch-manipulation ${
                            formData.daysOfWeek[day.key as keyof typeof formData.daysOfWeek]
                              ? darkMode
                                ? 'bg-blue-600 border-blue-500 text-white'
                                : 'bg-blue-600 border-blue-500 text-white'
                              : darkMode
                                ? 'bg-gray-700 border-gray-600 text-gray-300 hover:border-blue-500'
                                : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                  </FieldWithTooltip>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Optional Details */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-2xl p-5 sm:p-6 border-2 ${
                  darkMode 
                    ? 'bg-gray-800/50 border-gray-700' 
                    : 'bg-white border-purple-100'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    darkMode ? 'bg-purple-900/30' : 'bg-purple-100'
                  }`}>
                    <FileText className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className={`text-xl sm:text-2xl ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                      Optional Details
                    </h2>
                    <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formData.name ? `Additional info for ${formData.name}` : 'Add extra information (optional)'}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Duration */}
                  <FieldWithTooltip
                    label="How Long to Take?"
                    tooltip="Duration of the medication course (you can change this later)"
                    darkMode={darkMode}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id="lifetime"
                          checked={formData.lifetime}
                          onChange={(e) => setFormData({ ...formData, lifetime: e.target.checked })}
                          className="w-6 h-6 rounded border-2 focus:ring-2 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor="lifetime"
                          className={`text-base sm:text-lg cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}
                        >
                          Ongoing (lifetime medication)
                        </label>
                      </div>

                      {!formData.lifetime && (
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={formData.durationNumber}
                            onChange={(e) => setFormData({ ...formData, durationNumber: e.target.value })}
                            placeholder="30"
                            min="1"
                            className={`px-4 py-3.5 text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                            }`}
                          />
                          <select
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            className={`px-4 py-3.5 text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[56px] ${
                              darkMode
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                            }`}
                          >
                            <option value="Days">Days</option>
                            <option value="Weeks">Weeks</option>
                            <option value="Months">Months</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </FieldWithTooltip>

                  {/* Special Instructions */}
                  <FieldWithTooltip
                    label="Special Instructions"
                    tooltip="Any special notes about taking this medication (optional)"
                    darkMode={darkMode}
                  >
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                      placeholder="e.g., Take with food, avoid alcohol..."
                      rows={3}
                      className={`w-full px-4 sm:px-5 py-3.5 sm:py-4 text-lg sm:text-xl rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </FieldWithTooltip>

                  {/* Photo Upload */}
                  <FieldWithTooltip
                    label="Medication Photo"
                    tooltip="Add a photo to help identify your medication (optional)"
                    darkMode={darkMode}
                  >
                    <PhotoUploader
                      currentPhoto={formData.image}
                      onPhotoChange={(photo) => setFormData({ ...formData, image: photo })}
                      size="large"
                      darkMode={darkMode}
                    />
                  </FieldWithTooltip>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Medication Interaction Warning */}
          {showInteractionWarning && interactionResult && (
            <div className="mt-6">
              <DrugInteractionWarning
                result={interactionResult}
                darkMode={darkMode}
                onDismiss={() => setShowInteractionWarning(false)}
                onContactDoctor={() => {
                  toast.info('Contact Doctor', {
                    description: 'Opening help center to contact your doctor...',
                  });
                  // Could open help center or doctor contact page
                }}
              />
            </div>
          )}

        </div>

        {/* Sticky Footer with Cancel + Navigation Buttons - ELDERLY OPTIMIZED */}
        <div className={`sticky bottom-0 z-20 border-t-2 shadow-lg safe-area-pb ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
        }`}>
          <div className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between gap-4">
              {/* Cancel Button - Always Visible (CRITICAL for elderly) */}
              <Button
                type="button"
                onClick={() => {
                  if (formData.name.trim()) {
                    const confirm = window.confirm('Are you sure you want to cancel? Your changes will be lost.');
                    if (!confirm) return;
                  }
                  setCurrentPage('medications-list');
                }}
                variant="outline"
                className={`h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg min-w-[100px] ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-red-500 hover:text-red-400' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-red-500 hover:text-red-600'
                }`}
              >
                <X className="w-5 h-5 mr-2" />
                Cancel
              </Button>

              {/* Navigation Buttons */}
              <div className="flex gap-3">
                {/* Back Button */}
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handleBack}
                    variant="outline"
                    className={`h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg ${
                      darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                )}

                {/* Skip Button (Step 3 only) */}
                {currentStep === 3 && (
                  <Button
                    type="button"
                    onClick={handleSkipOptional}
                    variant="ghost"
                    className={`h-14 sm:h-16 px-5 sm:px-6 text-base sm:text-lg ${
                      darkMode ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Skip
                  </Button>
                )}

                {/* Next / Finish Button */}
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 min-w-[120px]"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    className="h-14 sm:h-16 px-6 sm:px-8 text-base sm:text-lg bg-blue-600 hover:bg-blue-700 min-w-[140px]"
                  >
                    <Check className="w-5 h-5 mr-2" />
                    Add Medication
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}