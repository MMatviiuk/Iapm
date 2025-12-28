import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight,
  Check,
  Camera,
  Pill,
  Clock,
  Calendar,
  Timer,
  Coffee,
  Utensils,
  Moon,
  X,
  AlertCircle,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { TooltipProvider } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import PhotoUploader from './PhotoUploader';

interface EditPrescriptionEnhancedProps {
  darkMode: boolean;
  setCurrentPage: (page: string) => void;
  medication: any; // The medication being edited
  updateMedication: (updatedMed: any) => void;
  deleteMedication: (medId: number) => void;
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

export default function EditPrescriptionEnhanced({ 
  darkMode, 
  setCurrentPage, 
  medication,
  updateMedication,
  deleteMedication
}: EditPrescriptionEnhancedProps) {
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Delete confirmation
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Parse existing medication data
  const parseDosage = (dosage: string | undefined) => {
    if (!dosage) {
      return { quantity: '1', dosageMg: '500' };
    }
    const pillsMatch = dosage.match(/(\d+)\s*pill/);
    const mgMatch = dosage.match(/(\d+)\s*mg/);
    return {
      quantity: pillsMatch ? pillsMatch[1] : '1',
      dosageMg: mgMatch ? mgMatch[1] : '500'
    };
  };

  const parseDuration = (duration: string | undefined) => {
    if (!duration) {
      return { lifetime: false, durationNumber: '30', unit: 'Days' };
    }
    if (duration === 'Lifetime' || duration === 'Ongoing') {
      return { lifetime: true, durationNumber: '30', unit: 'Days' };
    }
    const match = duration.match(/(\d+)\s*(\w+)/);
    if (match) {
      return {
        lifetime: false,
        durationNumber: match[1],
        unit: match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase()
      };
    }
    return { lifetime: false, durationNumber: '30', unit: 'Days' };
  };

  const parseTimeOfDay = (times: string[] | undefined) => {
    const timeOfDay = {
      morning: false,
      afternoon: false,
      evening: false
    };
    
    if (!times || times.length === 0) {
      timeOfDay.morning = true; // Default to morning
      return timeOfDay;
    }
    
    times.forEach(time => {
      if (!time) return;
      const hour = parseInt(time.split(':')[0]);
      if (hour >= 5 && hour < 12) timeOfDay.morning = true;
      else if (hour >= 12 && hour < 17) timeOfDay.afternoon = true;
      else timeOfDay.evening = true;
    });

    return timeOfDay;
  };

  const { quantity, dosageMg } = parseDosage(medication.dosage);
  const durationData = parseDuration(medication.duration || '30 Days');
  const timesArray = medication.times || (medication.time ? [medication.time] : ['08:00']);
  const initialTimeOfDay = parseTimeOfDay(timesArray);

  // Form data - Pre-filled with existing medication
  const [formData, setFormData] = useState({
    name: medication.name || '',
    form: medication.form || 'Tablet',
    quantity: quantity,
    dosageMg: dosageMg,
    timesPerDay: timesArray.length,
    timeOfDay: initialTimeOfDay,
    mealTiming: medication.mealTiming || 'before meal',
    morningTime: timesArray[0] || calculateTime('morning', medication.mealTiming || 'before meal'),
    afternoonTime: timesArray[1] || calculateTime('afternoon', medication.mealTiming || 'before meal'),
    eveningTime: timesArray[2] || calculateTime('evening', medication.mealTiming || 'before meal'),
    daysOfWeek: medication.daysOfWeek || {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true
    },
    durationNumber: durationData.durationNumber,
    unit: durationData.unit,
    lifetime: durationData.lifetime,
    specialInstructions: medication.specialInstructions || ''
  });

  const [medicationImage, setMedicationImage] = useState<string | null>(medication.photo || null);
  const [selectionOrder, setSelectionOrder] = useState<Array<'morning' | 'afternoon' | 'evening'>>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Medication name is required';
      }
      if (!formData.quantity || parseInt(formData.quantity) < 1) {
        newErrors.quantity = 'Quantity must be at least 1';
      }
      if (!formData.dosageMg || parseInt(formData.dosageMg) < 1) {
        newErrors.dosageMg = 'Dosage must be at least 1 mg';
      }
    }

    if (step === 2) {
      const selectedTimes = Object.values(formData.timeOfDay).filter(Boolean).length;
      if (selectedTimes !== formData.timesPerDay) {
        newErrors.timeOfDay = `Please select exactly ${formData.timesPerDay} time${formData.timesPerDay > 1 ? 's' : ''} of day`;
      }
    }

    if (step === 3) {
      const selectedDays = Object.values(formData.daysOfWeek).filter(Boolean).length;
      if (selectedDays === 0) {
        newErrors.daysOfWeek = 'Please select at least one day';
      }
    }

    if (step === 4) {
      if (!formData.lifetime && (!formData.durationNumber || parseInt(formData.durationNumber) < 1)) {
        newErrors.duration = 'Duration must be at least 1';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation
  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast.error('Please fix the errors before continuing');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Times per day selection
  const handleTimesPerDayChange = (times: number) => {
    setFormData({ ...formData, timesPerDay: times });
    
    const newTimeOfDay = {
      morning: false,
      afternoon: false,
      evening: false
    };

    if (times === 1) {
      newTimeOfDay.morning = true;
    } else if (times === 2) {
      newTimeOfDay.morning = true;
      newTimeOfDay.evening = true;
    } else if (times === 3) {
      newTimeOfDay.morning = true;
      newTimeOfDay.afternoon = true;
      newTimeOfDay.evening = true;
    }

    setFormData({ ...formData, timesPerDay: times, timeOfDay: newTimeOfDay });
  };

  // Time of day toggle with FIFO
  const handleTimeOfDayToggle = (time: 'morning' | 'afternoon' | 'evening') => {
    const currentlySelected = Object.entries(formData.timeOfDay)
      .filter(([_, val]) => val)
      .map(([key, _]) => key as 'morning' | 'afternoon' | 'evening');

    let newTimeOfDay = { ...formData.timeOfDay };
    let newSelectionOrder = [...selectionOrder];

    if (formData.timeOfDay[time]) {
      newTimeOfDay[time] = false;
      newSelectionOrder = newSelectionOrder.filter(t => t !== time);
    } else {
      if (currentlySelected.length >= formData.timesPerDay) {
        const oldest = newSelectionOrder[0];
        newTimeOfDay[oldest] = false;
        newSelectionOrder = newSelectionOrder.slice(1);
      }
      newTimeOfDay[time] = true;
      newSelectionOrder.push(time);
    }

    setFormData({ ...formData, timeOfDay: newTimeOfDay });
    setSelectionOrder(newSelectionOrder);
  };

  // Meal timing change
  const handleMealTimingChange = (timing: string) => {
    const newFormData = { ...formData, mealTiming: timing };
    
    if (formData.timeOfDay.morning) {
      newFormData.morningTime = calculateTime('morning', timing);
    }
    if (formData.timeOfDay.afternoon) {
      newFormData.afternoonTime = calculateTime('afternoon', timing);
    }
    if (formData.timeOfDay.evening) {
      newFormData.eveningTime = calculateTime('evening', timing);
    }

    setFormData(newFormData);
  };

  // Days of week toggle
  const toggleDay = (day: string) => {
    setFormData({
      ...formData,
      daysOfWeek: {
        ...formData.daysOfWeek,
        [day]: !formData.daysOfWeek[day as keyof typeof formData.daysOfWeek]
      }
    });
  };

  // Quick day selections
  const selectAllDays = () => {
    setFormData({
      ...formData,
      daysOfWeek: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true
      }
    });
  };

  const selectWeekdays = () => {
    setFormData({
      ...formData,
      daysOfWeek: {
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: false,
        sun: false
      }
    });
  };

  const selectWeekends = () => {
    setFormData({
      ...formData,
      daysOfWeek: {
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: true,
        sun: true
      }
    });
  };

  // Duration presets
  const durationPresets = [
    { label: '7 days', value: 7, unit: 'Days' },
    { label: '14 days', value: 14, unit: 'Days' },
    { label: '30 days', value: 30, unit: 'Days' },
    { label: '3 months', value: 3, unit: 'Months' },
    { label: '6 months', value: 6, unit: 'Months' },
  ];

  const handleDurationPreset = (value: number, unit: string) => {
    setFormData({
      ...formData,
      durationNumber: String(value),
      unit,
      lifetime: false
    });
  };

  // Submit Update
  const handleSubmit = () => {
    if (!validateStep(5)) return;

    const times: string[] = [];
    if (formData.timeOfDay.morning) times.push(formData.morningTime);
    if (formData.timeOfDay.afternoon) times.push(formData.afternoonTime);
    if (formData.timeOfDay.evening) times.push(formData.eveningTime);

    const updatedMedication = {
      ...medication,
      name: formData.name,
      dosage: `${formData.quantity} pill${parseInt(formData.quantity) !== 1 ? 's' : ''}, ${formData.dosageMg} mg`,
      time: times[0] || '08:00',
      times: times,
      daysOfWeek: formData.daysOfWeek,
      photo: medicationImage || undefined,
      mealTiming: formData.mealTiming,
      duration: formData.lifetime 
        ? 'Lifetime' 
        : `${formData.durationNumber} ${formData.unit}`,
      instructions: `Take ${formData.mealTiming}${formData.lifetime ? ', ongoing treatment' : ''}`
    };

    // DEBUG: Verify meal timing is being passed
    console.log('📝 Updating medication with meal timing:', formData.mealTiming);
    
    updateMedication(updatedMedication);
    
    toast.success('Medication updated successfully!', {
      description: `${formData.name} has been updated`,
      duration: 4000
    });

    setCurrentPage('main');
  };

  // Delete medication
  const handleDelete = () => {
    deleteMedication(medication.id);
    
    toast.success('Medication deleted', {
      description: `${medication.name} has been removed`,
      duration: 3000
    });

    setCurrentPage('main');
  };

  // Get time string
  const getTimeString = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Render step content (same as AddPrescriptionEnhanced, but with step 5 having delete button)
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-blue-950/30' : 'bg-blue-50'
              }`}>
                <Pill className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Basic Information
              </h2>
              <p className={`text-base lg:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Update the medication details
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <FieldWithTooltip
                  label="Medication Name"
                  tooltip="<strong>Enter the full name</strong> of your medication as shown on the prescription bottle.<br/><br/><strong>Examples:</strong><br/>• Lisinopril<br/>• Aspirin<br/>• Metformin<br/>• Vitamin D3"
                  required={true}
                  htmlFor="name"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Aspirin"
                  className={`h-14 text-lg ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldWithTooltip
                    label="Dosage (mg)"
                    tooltip="<strong>The amount of medication</strong> in each dose. Look for this on your prescription label.<br/><br/><strong>Examples:</strong><br/>• 10mg (milligrams)<br/>• 500mg<br/>• 100mcg (micrograms)"
                    required={true}
                    htmlFor="dosageMg"
                    darkMode={darkMode}
                    className="mb-2 block"
                  />
                  <Input
                    id="dosageMg"
                    type="number"
                    min="1"
                    value={formData.dosageMg}
                    onChange={(e) => setFormData({ ...formData, dosageMg: e.target.value })}
                    className={`h-14 text-lg ${errors.dosageMg ? 'border-red-500' : ''}`}
                  />
                </div>

                <div>
                  <FieldWithTooltip
                    label="Form"
                    tooltip="<strong>How you take this medication</strong> (tablet, liquid, injection, etc.)<br/><br/><strong>Common forms:</strong><br/>• Tablet<br/>• Capsule<br/>• Liquid/Syrup<br/>• Injection<br/>• Cream/Ointment"
                    required={true}
                    htmlFor="form"
                    darkMode={darkMode}
                    className="mb-2 block"
                  />
                  <select
                    id="form"
                    value={formData.form}
                    onChange={(e) => setFormData({ ...formData, form: e.target.value })}
                    className={`w-full h-14 px-4 text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      darkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {MEDICATION_FORMS.map(form => (
                      <option key={form} value={form}>{form}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <FieldWithTooltip
                  label="Quantity per Dose"
                  tooltip="<strong>How many pills or units</strong> you take at each dose.<br/><br/><strong>Examples:</strong><br/>• 1 tablet<br/>• 2 capsules<br/>• 5ml liquid"
                  required={true}
                  htmlFor="quantity"
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className={`h-14 text-lg ${errors.quantity ? 'border-red-500' : ''}`}
                />
              </div>

              <div>
                <FieldWithTooltip
                  label="Medication Photo (Optional)"
                  tooltip="<strong>Upload a photo</strong> of your medication bottle or pills.<br/><br/><strong>Benefits:</strong><br/>• Helps identify medication<br/>• Useful for doctor visits<br/>• Reminds you of what it looks like<br/><br/>✅ <strong>Optional:</strong> Skip if you don't have a camera"
                  required={false}
                  darkMode={darkMode}
                  className="mb-2 block"
                />
                <PhotoUploader
                  currentPhoto={medicationImage}
                  onPhotoChange={setMedicationImage}
                  size="medium"
                  darkMode={darkMode}
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-blue-950/30' : 'bg-blue-50'
              }`}>
                <Clock className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Dosing Schedule
              </h2>
              <p className={`text-base lg:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {formData.name ? `When do you take ${formData.name}?` : 'When do you take this medication?'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <FieldWithTooltip
                  label="How many times per day?"
                  tooltip="<strong>How many times per day</strong> you need to take this medication.<br/><br/><strong>Options:</strong><br/>• Once Daily: One time each day<br/>• Twice Daily: Two times (morning + evening)<br/>• Three Times: Morning, afternoon, evening<br/><br/>Your doctor's prescription will specify this."
                  required={true}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((times) => (
                    <button
                      key={times}
                      type="button"
                      onClick={() => handleTimesPerDayChange(times)}
                      className={`h-16 rounded-xl border-2 transition-all ${
                        formData.timesPerDay === times
                          ? darkMode
                            ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                            : 'bg-blue-50 border-blue-600 text-blue-600'
                          : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-xl font-bold">{times}x</span>
                      <span className="text-sm block">
                        {times === 1 ? 'Once' : times === 2 ? 'Twice' : 'Three times'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldWithTooltip
                  label={`Select ${formData.timesPerDay} Time${formData.timesPerDay > 1 ? 's' : ''} of Day`}
                  tooltip={`<strong>Select exactly ${formData.timesPerDay} time${formData.timesPerDay > 1 ? 's' : ''}:</strong><br/><br/>You selected <strong>${formData.timesPerDay === 1 ? 'Once' : formData.timesPerDay === 2 ? 'Twice' : 'Three times'} daily</strong>, so you must choose ${formData.timesPerDay} time${formData.timesPerDay > 1 ? 's' : ''}.<br/><br/><strong>Tips:</strong><br/>• Pick times you'll remember<br/>• Space doses evenly<br/>• Set phone reminders<br/><br/>💡 Click again to unselect a time.`}
                  required={true}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                
                {/* Selection Counter */}
                {(() => {
                  const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
                  return (
                    <div className={`mb-3 text-center text-sm ${
                      selectedCount === formData.timesPerDay
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : darkMode ? 'text-orange-400' : 'text-orange-600'
                    }`}>
                      {selectedCount === formData.timesPerDay ? (
                        <span>✓ {selectedCount} of {formData.timesPerDay} selected</span>
                      ) : selectedCount < formData.timesPerDay ? (
                        <span>Select {formData.timesPerDay - selectedCount} more time{formData.timesPerDay - selectedCount > 1 ? 's' : ''}</span>
                      ) : (
                        <span>Too many selected - click one to remove</span>
                      )}
                    </div>
                  );
                })()}
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTimeOfDayToggle('morning')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeOfDay.morning
                        ? darkMode
                          ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                          : 'bg-blue-50 border-blue-600 text-blue-600'
                        : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Coffee className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-base font-semibold block">Morning</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTimeOfDayToggle('afternoon')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeOfDay.afternoon
                        ? darkMode
                          ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                          : 'bg-blue-50 border-blue-600 text-blue-600'
                        : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Utensils className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-base font-semibold block">Afternoon</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTimeOfDayToggle('evening')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.timeOfDay.evening
                        ? darkMode
                          ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                          : 'bg-blue-50 border-blue-600 text-blue-600'
                        : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <Moon className="w-8 h-8 mx-auto mb-2" />
                    <span className="text-base font-semibold block">Evening</span>
                  </button>
                </div>
                {errors.timeOfDay && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.timeOfDay}
                  </p>
                )}
              </div>

              <div>
                <FieldWithTooltip
                  label="Meal Timing"
                  tooltip="<strong>When to take relative to meals.</strong> This affects how your body absorbs the medication.<br/><br/><strong>Options:</strong><br/>• Before Meal: 30 minutes before eating<br/>• With Meal: During your meal<br/>• After Meal: 30 minutes after eating<br/>• Anytime: No meal restriction<br/><br/>Check your prescription label or ask your pharmacist."
                  required={true}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'before meal', label: 'Before Meal', desc: '30 min before' },
                    { value: 'with meal', label: 'With Meal', desc: 'During meal' },
                    { value: 'after meal', label: 'After Meal', desc: '30 min after' },
                    { value: 'anytime', label: 'Anytime', desc: 'No restriction' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleMealTimingChange(option.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.mealTiming === option.value
                          ? darkMode
                            ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                            : 'bg-blue-50 border-blue-600 text-blue-600'
                          : darkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                            : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span className="text-base font-semibold block mb-1">{option.label}</span>
                      <span className="text-sm opacity-75">{option.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-blue-950/30' : 'bg-blue-50'
              }`}>
                <Calendar className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Weekly Frequency
              </h2>
              <p className={`text-base lg:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {formData.name ? `Which days do you take ${formData.name}?` : 'Which days do you take this medication?'}
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={selectAllDays}
                  variant="outline"
                  className="flex-1 h-12 border-2"
                >
                  All Days
                </Button>
                <Button
                  type="button"
                  onClick={selectWeekdays}
                  variant="outline"
                  className="flex-1 h-12 border-2"
                >
                  Weekdays
                </Button>
                <Button
                  type="button"
                  onClick={selectWeekends}
                  variant="outline"
                  className="flex-1 h-12 border-2"
                >
                  Weekends
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {[
                  { key: 'mon', label: 'Mon', full: 'Monday' },
                  { key: 'tue', label: 'Tue', full: 'Tuesday' },
                  { key: 'wed', label: 'Wed', full: 'Wednesday' },
                  { key: 'thu', label: 'Thu', full: 'Thursday' },
                  { key: 'fri', label: 'Fri', full: 'Friday' },
                  { key: 'sat', label: 'Sat', full: 'Saturday' },
                  { key: 'sun', label: 'Sun', full: 'Sunday' }
                ].map((day) => (
                  <button
                    key={day.key}
                    type="button"
                    onClick={() => toggleDay(day.key)}
                    className={`h-20 rounded-xl border-2 transition-all ${
                      formData.daysOfWeek[day.key as keyof typeof formData.daysOfWeek]
                        ? darkMode
                          ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                          : 'bg-blue-50 border-blue-600 text-blue-600'
                        : darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                    }`}
                    title={day.full}
                  >
                    <span className="text-sm sm:text-base font-semibold block">{day.label}</span>
                  </button>
                ))}
              </div>

              {errors.daysOfWeek && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.daysOfWeek}
                </p>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-blue-950/30' : 'bg-blue-50'
              }`}>
                <Timer className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Treatment Duration
              </h2>
              <p className={`text-base lg:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {formData.name ? `How long will you take ${formData.name}?` : 'How long will you take this medication?'}
              </p>
            </div>

            <div className="space-y-5">
              {/* Main Duration Input - PRIORITY (Number + Unit) */}
              <div>
                <FieldWithTooltip
                  label="Treatment Duration"
                  tooltip="<strong>How long to take:</strong> Enter the duration of your medication course.<br/><br/><strong>Examples:</strong><br/>• 7 days for antibiotics<br/>• 2 weeks for pain relief<br/>• 3 months for trial medication<br/>• Ongoing for lifetime medication<br/><br/>💡 Your doctor's prescription will specify the duration."
                  required={false}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                
                {/* Ongoing/Lifetime Checkbox */}
                <div className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    id="lifetime-checkbox-edit"
                    checked={formData.lifetime}
                    onChange={(e) => setFormData({ ...formData, lifetime: e.target.checked })}
                    className="w-6 h-6 rounded border-2 focus:ring-2 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor="lifetime-checkbox-edit"
                    className={`text-lg cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  >
                    Ongoing (lifetime medication)
                  </label>
                </div>

                {/* Duration Input Fields */}
                {!formData.lifetime && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        min="1"
                        value={formData.durationNumber}
                        onChange={(e) => setFormData({ ...formData, durationNumber: e.target.value })}
                        className={`h-14 text-lg ${errors.duration ? 'border-red-500' : ''}`}
                        placeholder="Number"
                      />
                    </div>
                    <div>
                      <select
                        value={formData.unit}
                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                        className={`w-full h-14 px-4 text-lg rounded-xl border-2 ${
                          darkMode 
                            ? 'bg-slate-800 border-slate-700 text-white' 
                            : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      >
                        <option value="Days">Days</option>
                        <option value="Weeks">Weeks</option>
                        <option value="Months">Months</option>
                      </select>
                    </div>
                  </div>
                )}

                {errors.duration && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {errors.duration}
                  </p>
                )}
              </div>

              {/* Quick Presets (Optional) */}
              {!formData.lifetime && (
                <div>
                  <label className={`text-sm mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick Presets (optional)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {durationPresets.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleDurationPreset(preset.value, preset.unit)}
                        className={`p-3 rounded-lg border transition-all text-sm ${
                          formData.durationNumber === String(preset.value) && 
                          formData.unit === preset.unit
                            ? darkMode
                              ? 'bg-blue-950/30 border-blue-600 text-blue-400'
                              : 'bg-blue-50 border-blue-600 text-blue-600'
                            : darkMode
                              ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                              : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <FieldWithTooltip
                  label="Special Instructions (Optional)"
                  tooltip="<strong>Any special notes</strong> about taking this medication.<br/><br/><strong>Examples:</strong><br/>• Take with food<br/>• Avoid alcohol<br/>• Take at bedtime<br/>• Do not crush or chew"
                  required={false}
                  darkMode={darkMode}
                  className="mb-3 block"
                />
                <textarea
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="e.g., Take with food, avoid alcohol..."
                  rows={3}
                  className={`w-full px-4 py-3.5 text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                darkMode ? 'bg-green-950/30' : 'bg-green-50'
              }`}>
                <CheckCircle2 className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <h2 className={`text-2xl lg:text-3xl font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                Review Changes
              </h2>
              <p className={`text-base lg:text-lg ${
                darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Please review your updated medication details
              </p>
            </div>

            <Card className={`p-5 lg:p-6 border-2 ${
              darkMode 
                ? 'bg-slate-900 border-slate-800' 
                : 'bg-white border-slate-200'
            }`}>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  {medicationImage && (
                    <img
                      src={medicationImage}
                      alt={formData.name}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className={`text-xl lg:text-2xl font-bold mb-1 ${
                      darkMode ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formData.name}
                    </h3>
                    <p className={`text-base lg:text-lg ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {formData.quantity} pill{parseInt(formData.quantity) !== 1 ? 's' : ''}, {formData.dosageMg} mg
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`text-base font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Schedule
                  </h4>
                  <div className="space-y-2">
                    {formData.timeOfDay.morning && (
                      <div className="flex items-center gap-2">
                        <Coffee className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                          Morning - {getTimeString(formData.morningTime)}
                        </span>
                      </div>
                    )}
                    {formData.timeOfDay.afternoon && (
                      <div className="flex items-center gap-2">
                        <Utensils className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                          Afternoon - {getTimeString(formData.afternoonTime)}
                        </span>
                      </div>
                    )}
                    {formData.timeOfDay.evening && (
                      <div className="flex items-center gap-2">
                        <Moon className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                        <span className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                          Evening - {getTimeString(formData.eveningTime)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className={`text-sm mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Take {formData.mealTiming}
                  </p>
                </div>

                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`text-base font-semibold mb-2 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Frequency
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.daysOfWeek)
                      .filter(([_, selected]) => selected)
                      .map(([day, _]) => (
                        <Badge
                          key={day}
                          variant="outline"
                          className={`${
                            darkMode 
                              ? 'bg-blue-950/30 border-blue-700 text-blue-400' 
                              : 'bg-blue-50 border-blue-300 text-blue-700'
                          }`}
                        >
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </Badge>
                      ))}
                  </div>
                </div>

                <div className={`p-4 rounded-xl ${
                  darkMode ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`text-base font-semibold mb-1 ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}>
                    Duration
                  </h4>
                  <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                    {formData.lifetime 
                      ? 'Lifetime (ongoing treatment)'
                      : `${formData.durationNumber} ${formData.unit}`
                    }
                  </p>
                </div>
              </div>
            </Card>

            {/* Delete Button */}
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="outline"
              className="w-full h-14 text-lg border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete Medication
            </Button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => {
              if (currentStep === 1) {
                setCurrentPage('main');
              } else {
                handleBack();
              }
            }}
            variant="ghost"
            className="h-12 px-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <h1 className={`text-xl lg:text-2xl font-bold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Edit Medication
          </h1>

          <div className="w-24" />
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Step {currentStep} of {totalSteps}
            </span>
            <span className={`text-sm font-semibold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <Progress 
            value={(currentStep / totalSteps) * 100} 
            className="h-3"
          />
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="flex-1 h-14 border-2 text-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              onClick={handleNext}
              className={`flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-700 ${
                currentStep === 1 ? 'w-full' : ''
              }`}
            >
              Next
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex-1 h-14 text-lg bg-green-600 hover:bg-green-700"
            >
              <Check className="w-5 h-5 mr-2" />
              Update Medication
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Medication?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {formData.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </TooltipProvider>
  );
}