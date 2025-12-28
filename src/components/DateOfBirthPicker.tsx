import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

interface DateOfBirthPickerProps {
  value: string; // ISO format YYYY-MM-DD
  onChange: (date: string) => void;
  darkMode?: boolean;
  className?: string;
}

export default function DateOfBirthPicker({ 
  value, 
  onChange, 
  darkMode = false,
  className = ''
}: DateOfBirthPickerProps) {
  
  // Parse current value
  const parseDate = (isoDate: string) => {
    if (!isoDate) return { day: '', month: '', year: '' };
    const [year, month, day] = isoDate.split('-');
    return { day, month, year };
  };

  const [selectedDate, setSelectedDate] = useState(parseDate(value));

  // Update when external value changes
  useEffect(() => {
    setSelectedDate(parseDate(value));
  }, [value]);

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return { value: String(day).padStart(2, '0'), label: String(day) };
  });

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 120 }, (_, i) => {
    const year = currentYear - i;
    return { value: String(year), label: String(year) };
  });

  // Handle individual field changes
  const handleChange = (field: 'day' | 'month' | 'year', newValue: string) => {
    const updated = { ...selectedDate, [field]: newValue };
    setSelectedDate(updated);

    // Only call onChange if all fields are filled
    if (updated.day && updated.month && updated.year) {
      const isoDate = `${updated.year}-${updated.month}-${updated.day}`;
      onChange(isoDate);
    }
  };

  const selectClassName = `
    h-14 sm:h-16 px-3 sm:px-4 rounded-lg border-2 
    text-base sm:text-lg
    transition-all touch-manipulation
    ${darkMode 
      ? 'bg-slate-800 border-slate-600 text-white' 
      : 'bg-white border-gray-300 text-gray-900'
    }
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    hover:border-gray-400
    appearance-none cursor-pointer
  `;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Visual Header */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
        <span className={`text-base sm:text-lg font-medium ${
          darkMode ? 'text-slate-300' : 'text-gray-700'
        }`}>
          Select your date of birth
        </span>
      </div>

      {/* Dropdown Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* Day */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm sm:text-base font-medium px-1 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Day
          </label>
          <select
            value={selectedDate.day}
            onChange={(e) => handleChange('day', e.target.value)}
            className={selectClassName}
          >
            <option value="">--</option>
            {days.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Month */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm sm:text-base font-medium px-1 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Month
          </label>
          <select
            value={selectedDate.month}
            onChange={(e) => handleChange('month', e.target.value)}
            className={selectClassName}
          >
            <option value="">--</option>
            {months.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div className="flex flex-col gap-1.5">
          <label className={`text-sm sm:text-base font-medium px-1 ${
            darkMode ? 'text-slate-400' : 'text-gray-600'
          }`}>
            Year
          </label>
          <select
            value={selectedDate.year}
            onChange={(e) => handleChange('year', e.target.value)}
            className={selectClassName}
          >
            <option value="">----</option>
            {years.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Age Display (if complete) */}
      {selectedDate.day && selectedDate.month && selectedDate.year && (
        <div className={`text-sm sm:text-base mt-2 px-1 ${
          darkMode ? 'text-slate-400' : 'text-gray-600'
        }`}>
          Age: {calculateAge(value)} years
        </div>
      )}
    </div>
  );
}

// Helper function to calculate age
function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}
