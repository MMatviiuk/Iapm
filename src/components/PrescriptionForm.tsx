import { useState, useEffect } from 'react';
import TimePicker from './TimePicker';

interface PrescriptionFormProps {
  darkMode: boolean;
  initialData?: {
    name: string;
    quantity: string;
    dosageMg: string;
    timesPerDay: number;
    timeOfDay: {
      morning: boolean;
      afternoon: boolean;
      evening: boolean;
    };
    mealTiming: string;
    morningTime: string;
    afternoonTime: string;
    eveningTime: string;
    daysOfWeek: {
      mon: boolean;
      tue: boolean;
      wed: boolean;
      thu: boolean;
      fri: boolean;
      sat: boolean;
      sun: boolean;
    };
    durationNumber: string;
    unit: string;
    lifetime: boolean;
  };
  formData?: any;
  setFormData?: (data: any) => void;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
  accentColor?: string;
  editingPrescription?: any;
}

const calculateTime = (timeOfDay: 'morning' | 'afternoon' | 'evening', mealTiming: string): string => {
  const mealSchedule = {
    morning: '08:00',   // Breakfast
    afternoon: '13:00', // Lunch
    evening: '19:00'    // Dinner
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
  // 'with meal' or 'anytime' - use base time

  return `${String(adjustedHours).padStart(2, '0')}:${String(adjustedMinutes).padStart(2, '0')}`;
};

const defaultFormData = {
  name: '',
  quantity: '1',
  dosageMg: '500',
  timesPerDay: 1,
  timeOfDay: {
    morning: true,
    afternoon: false,
    evening: false
  },
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
  durationNumber: '30',
  unit: 'Days',
  lifetime: false
};

export default function PrescriptionForm({
  darkMode,
  initialData,
  formData: externalFormData,
  setFormData: externalSetFormData,
  onSubmit,
  onCancel,
  submitLabel = 'Add Prescription',
  accentColor = 'blue',
  editingPrescription
}: PrescriptionFormProps) {
  const [internalFormData, setInternalFormData] = useState(initialData || defaultFormData);
  
  // Track selection order for "Twice daily" FIFO behavior
  const [selectionOrder, setSelectionOrder] = useState<Array<'morning' | 'afternoon' | 'evening'>>([]);

  // Use external formData if provided, otherwise use internal
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  useEffect(() => {
    if (initialData && !externalFormData) {
      setInternalFormData(initialData);
    }
  }, [initialData, externalFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate time selection
    const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
    if (formData.timesPerDay === 2 && selectedCount !== 2) {
      // Don't submit, the warning is already shown
      return;
    }
    if (formData.timesPerDay === 1 && selectedCount !== 1) {
      return;
    }
    
    // Save "Twice daily" preference to localStorage
    if (formData.timesPerDay === 2) {
      localStorage.setItem('twiceDailyPreference', JSON.stringify(formData.timeOfDay));
    }
    
    onSubmit(formData);
  };

  const daysLabels = [
    { key: 'mon', label: 'Mon' },
    { key: 'tue', label: 'Tue' },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    { key: 'fri', label: 'Fri' },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' }
  ];

  const getButtonColors = () => {
    switch (accentColor) {
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600';
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'blue':
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getDayButtonColors = (isActive: boolean) => {
    if (!isActive) {
      return darkMode
        ? 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    }

    switch (accentColor) {
      case 'purple':
        return darkMode
          ? 'bg-purple-600 border-purple-600 text-white'
          : 'bg-purple-500 border-purple-500 text-white';
      case 'orange':
        return darkMode
          ? 'bg-orange-600 border-orange-600 text-white'
          : 'bg-orange-500 border-orange-500 text-white';
      case 'blue':
      default:
        return darkMode
          ? 'bg-blue-600 border-blue-600 text-white'
          : 'bg-blue-500 border-blue-500 text-white';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* Medication Name */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Medication Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Aspirin"
          required
          className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
        />
      </div>

      {/* Quantity and Dosage */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div>
          <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Quantity
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            placeholder="1"
            min="1"
            max="10"
            required
            className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
        <div>
          <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Dosage (mg)
          </label>
          <input
            type="number"
            value={formData.dosageMg}
            onChange={(e) => setFormData({ ...formData, dosageMg: e.target.value })}
            placeholder="500"
            min="1"
            required
            className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
              darkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>
      </div>

      {/* Meal Timing */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Meal Timing
        </label>
        <select
          value={formData.mealTiming}
          onChange={(e) => {
            const newMealTiming = e.target.value;
            // Auto-update times based on new meal timing
            setFormData({ 
              ...formData, 
              mealTiming: newMealTiming,
              morningTime: calculateTime('morning', newMealTiming),
              afternoonTime: calculateTime('afternoon', newMealTiming),
              eveningTime: calculateTime('evening', newMealTiming)
            });
          }}
          className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="before meal">Before Meal</option>
          <option value="with meal">With Meal</option>
          <option value="after meal">After Meal</option>
          <option value="anytime">Anytime</option>
        </select>
      </div>

      {/* Times Per Day */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Times Per Day
        </label>
        <select
          value={formData.timesPerDay}
          onChange={(e) => {
            const times = parseInt(e.target.value);
            
            let newTimeOfDay;
            let newSelectionOrder: Array<'morning' | 'afternoon' | 'evening'> = [];
            
            if (times === 2) {
              // Load saved "Twice daily" preference
              const savedTwiceDailyPreference = localStorage.getItem('twiceDailyPreference');
              if (savedTwiceDailyPreference) {
                try {
                  const parsed = JSON.parse(savedTwiceDailyPreference);
                  // Validate that exactly 2 are selected
                  if (parsed && Object.values(parsed).filter(Boolean).length === 2) {
                    newTimeOfDay = parsed;
                    // Build selection order from saved preference
                    if (parsed.morning) newSelectionOrder.push('morning');
                    if (parsed.afternoon) newSelectionOrder.push('afternoon');
                    if (parsed.evening) newSelectionOrder.push('evening');
                  } else {
                    // Default for twice daily
                    newTimeOfDay = { morning: true, afternoon: true, evening: false };
                    newSelectionOrder = ['morning', 'afternoon'];
                  }
                } catch (e) {
                  // Invalid data, use default
                  newTimeOfDay = { morning: true, afternoon: true, evening: false };
                  newSelectionOrder = ['morning', 'afternoon'];
                }
              } else {
                // No saved preference, use default
                newTimeOfDay = { morning: true, afternoon: true, evening: false };
                newSelectionOrder = ['morning', 'afternoon'];
              }
            } else {
              // For once daily or three times daily
              newTimeOfDay = {
                morning: times >= 1,
                afternoon: times >= 2,
                evening: times === 3
              };
              newSelectionOrder = [];
            }
            
            setSelectionOrder(newSelectionOrder);
            setFormData({ ...formData, timesPerDay: times, timeOfDay: newTimeOfDay });
          }}
          className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
            darkMode
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        >
          <option value="1">1 time per day</option>
          <option value="2">2 times per day</option>
          <option value="3">3 times per day</option>
        </select>
      </div>

      {/* Time of Day Selection */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Time of Day {formData.timesPerDay === 1 ? '(Select one)' : formData.timesPerDay === 2 ? '(Select two)' : '(All three)'}
        </label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <button
            type="button"
            disabled={formData.timesPerDay === 3}
            onClick={() => {
              if (formData.timesPerDay === 1) {
                // Once daily - radio button behavior
                setFormData({
                  ...formData,
                  timeOfDay: { morning: true, afternoon: false, evening: false }
                });
                setSelectionOrder([]);
              } else if (formData.timesPerDay === 2) {
                // Twice daily - FIFO behavior
                if (formData.timeOfDay.morning) {
                  // Deselect morning
                  const newOrder = selectionOrder.filter(slot => slot !== 'morning');
                  setSelectionOrder(newOrder);
                  setFormData({
                    ...formData,
                    timeOfDay: { ...formData.timeOfDay, morning: false }
                  });
                } else {
                  // Select morning
                  const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
                  if (selectedCount < 2) {
                    // Can add directly
                    setSelectionOrder([...selectionOrder, 'morning']);
                    setFormData({
                      ...formData,
                      timeOfDay: { ...formData.timeOfDay, morning: true }
                    });
                  } else {
                    // FIFO: Remove first selected, keep second, add new
                    const firstSelected = selectionOrder[0];
                    const newOrder = [selectionOrder[1], 'morning'];
                    setSelectionOrder(newOrder);
                    setFormData({
                      ...formData,
                      timeOfDay: {
                        morning: true,
                        afternoon: firstSelected === 'afternoon' ? false : formData.timeOfDay.afternoon,
                        evening: firstSelected === 'evening' ? false : formData.timeOfDay.evening
                      }
                    });
                  }
                }
              }
            }}
            className={`py-3 sm:py-3.5 text-sm sm:text-base rounded-lg border-2 transition-all min-h-[48px] ${
              getDayButtonColors(formData.timeOfDay.morning)
            } ${formData.timesPerDay === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Morning
          </button>
          <button
            type="button"
            disabled={formData.timesPerDay === 3}
            onClick={() => {
              if (formData.timesPerDay === 1) {
                // Once daily - radio button behavior
                setFormData({
                  ...formData,
                  timeOfDay: { morning: false, afternoon: true, evening: false }
                });
                setSelectionOrder([]);
              } else if (formData.timesPerDay === 2) {
                // Twice daily - FIFO behavior
                if (formData.timeOfDay.afternoon) {
                  // Deselect afternoon
                  const newOrder = selectionOrder.filter(slot => slot !== 'afternoon');
                  setSelectionOrder(newOrder);
                  setFormData({
                    ...formData,
                    timeOfDay: { ...formData.timeOfDay, afternoon: false }
                  });
                } else {
                  // Select afternoon
                  const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
                  if (selectedCount < 2) {
                    // Can add directly
                    setSelectionOrder([...selectionOrder, 'afternoon']);
                    setFormData({
                      ...formData,
                      timeOfDay: { ...formData.timeOfDay, afternoon: true }
                    });
                  } else {
                    // FIFO: Remove first selected, keep second, add new
                    const firstSelected = selectionOrder[0];
                    const newOrder = [selectionOrder[1], 'afternoon'];
                    setSelectionOrder(newOrder);
                    setFormData({
                      ...formData,
                      timeOfDay: {
                        morning: firstSelected === 'morning' ? false : formData.timeOfDay.morning,
                        afternoon: true,
                        evening: firstSelected === 'evening' ? false : formData.timeOfDay.evening
                      }
                    });
                  }
                }
              }
            }}
            className={`py-3 sm:py-3.5 text-sm sm:text-base rounded-lg border-2 transition-all min-h-[48px] ${
              getDayButtonColors(formData.timeOfDay.afternoon)
            } ${formData.timesPerDay === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Afternoon
          </button>
          <button
            type="button"
            disabled={formData.timesPerDay === 3}
            onClick={() => {
              if (formData.timesPerDay === 1) {
                // Once daily - radio button behavior
                setFormData({
                  ...formData,
                  timeOfDay: { morning: false, afternoon: false, evening: true }
                });
                setSelectionOrder([]);
              } else if (formData.timesPerDay === 2) {
                // Twice daily - FIFO behavior
                if (formData.timeOfDay.evening) {
                  // Deselect evening
                  const newOrder = selectionOrder.filter(slot => slot !== 'evening');
                  setSelectionOrder(newOrder);
                  setFormData({
                    ...formData,
                    timeOfDay: { ...formData.timeOfDay, evening: false }
                  });
                } else {
                  // Select evening
                  const selectedCount = Object.values(formData.timeOfDay).filter(Boolean).length;
                  if (selectedCount < 2) {
                    // Can add directly
                    setSelectionOrder([...selectionOrder, 'evening']);
                    setFormData({
                      ...formData,
                      timeOfDay: { ...formData.timeOfDay, evening: true }
                    });
                  } else {
                    // FIFO: Remove first selected, keep second, add new
                    const firstSelected = selectionOrder[0];
                    const newOrder = [selectionOrder[1], 'evening'];
                    setSelectionOrder(newOrder);
                    setFormData({
                      ...formData,
                      timeOfDay: {
                        morning: firstSelected === 'morning' ? false : formData.timeOfDay.morning,
                        afternoon: firstSelected === 'afternoon' ? false : formData.timeOfDay.afternoon,
                        evening: true
                      }
                    });
                  }
                }
              }
            }}
            className={`py-3 sm:py-3.5 text-sm sm:text-base rounded-lg border-2 transition-all min-h-[48px] ${
              getDayButtonColors(formData.timeOfDay.evening)
            } ${formData.timesPerDay === 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Evening
          </button>
        </div>
        
        {/* Helper prompt for twice daily */}
        {formData.timesPerDay === 2 && Object.values(formData.timeOfDay).filter(Boolean).length === 1 && (
          <div className={`mt-3 p-3 rounded-lg border-2 ${
            darkMode 
              ? 'bg-orange-900/20 border-orange-700 text-orange-300' 
              : 'bg-orange-50 border-orange-300 text-orange-800'
          }`}>
            <p className="text-sm sm:text-base">
              Please select a second time of day for your twice-daily medication.
            </p>
          </div>
        )}
      </div>

      {/* Time(s) */}
      <div className="space-y-2">
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Time
        </label>
        {formData.timeOfDay.morning && (
          <div>
            <label className={`block mb-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Morning
            </label>
            <TimePicker
              value={formData.morningTime}
              onChange={(value) => setFormData({ ...formData, morningTime: value })}
              darkMode={darkMode}
            />
          </div>
        )}
        {formData.timeOfDay.afternoon && (
          <div>
            <label className={`block mb-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Afternoon
            </label>
            <TimePicker
              value={formData.afternoonTime}
              onChange={(value) => setFormData({ ...formData, afternoonTime: value })}
              darkMode={darkMode}
            />
          </div>
        )}
        {formData.timeOfDay.evening && (
          <div>
            <label className={`block mb-1 text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Evening
            </label>
            <TimePicker
              value={formData.eveningTime}
              onChange={(value) => setFormData({ ...formData, eveningTime: value })}
              darkMode={darkMode}
            />
          </div>
        )}
      </div>

      {/* Days of Week */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Days of Week
        </label>
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {daysLabels.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFormData({
                ...formData,
                daysOfWeek: {
                  ...formData.daysOfWeek,
                  [key]: !formData.daysOfWeek[key as keyof typeof formData.daysOfWeek]
                }
              })}
              className={`py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg border-2 transition-all min-h-[44px] sm:min-h-[48px] ${
                getDayButtonColors(formData.daysOfWeek[key as keyof typeof formData.daysOfWeek])
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className={`block mb-2 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Duration
        </label>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <input
            type="number"
            value={formData.durationNumber}
            onChange={(e) => setFormData({ ...formData, durationNumber: e.target.value })}
            disabled={formData.lifetime}
            placeholder="30"
            min="1"
            className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
              formData.lifetime
                ? darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            disabled={formData.lifetime}
            className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-${accentColor}-500 min-h-[48px] ${
              formData.lifetime
                ? darkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-500'
                  : 'bg-gray-100 border-gray-200 text-gray-400'
                : darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="Days">Days</option>
            <option value="Weeks">Weeks</option>
            <option value="Months">Months</option>
          </select>
        </div>
      </div>

      {/* Lifetime Checkbox */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="lifetime"
          checked={formData.lifetime}
          onChange={(e) => setFormData({ ...formData, lifetime: e.target.checked })}
          className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 border-gray-300 text-${accentColor}-500 focus:ring-2 focus:ring-${accentColor}-500`}
        />
        <label htmlFor="lifetime" className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Ongoing medication (no end date)
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 sm:gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={`flex-1 py-3 sm:py-3.5 px-3 sm:px-4 text-base sm:text-lg border-2 rounded-lg transition-colors min-h-[48px] ${
            darkMode
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex-1 py-3 sm:py-3.5 px-3 sm:px-4 text-base sm:text-lg text-white rounded-lg shadow-lg hover:shadow-xl transition-all min-h-[48px] ${getButtonColors()}`}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
