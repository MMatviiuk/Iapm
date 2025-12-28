import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  darkMode?: boolean;
  className?: string;
  label?: string;
  mealType?: 'breakfast' | 'lunch' | 'dinner' | null;
}

export default function TimePicker({ value, onChange, darkMode = false, className = '', label, mealType = null }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(value.split(':')[0] || '08');
  const [selectedMinute, setSelectedMinute] = useState(value.split(':')[1] || '00');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getFilteredHours = () => {
    const allHours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
    
    if (!mealType) return allHours;
    
    switch (mealType) {
      case 'breakfast':
        return allHours.filter(h => parseInt(h) >= 5 && parseInt(h) <= 11);
      case 'lunch':
        return allHours.filter(h => parseInt(h) >= 11 && parseInt(h) <= 16);
      case 'dinner':
        return allHours.filter(h => parseInt(h) >= 16 && parseInt(h) <= 22);
      default:
        return allHours;
    }
  };

  const hours = getFilteredHours();
  const minutes = ['00', '15', '30', '45'];

  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || '08');
      setSelectedMinute(minute || '00');
    }
  }, [value]);

  // Update position when opening
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = 520;
      const isMobile = viewportWidth < 640;
      const dropdownWidth = isMobile ? Math.min(viewportWidth - 32, 380) : 420;
      
      const spaceBelow = viewportHeight - rect.bottom;
      const shouldShowAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
      
      let leftPosition = rect.left;
      
      if (isMobile && dropdownWidth < viewportWidth - 32) {
        leftPosition = (viewportWidth - dropdownWidth) / 2;
      } else {
        if (leftPosition + dropdownWidth > viewportWidth) {
          leftPosition = viewportWidth - dropdownWidth - 16;
        }
      }
      
      if (leftPosition < 16) {
        leftPosition = 16;
      }
      
      setDropdownPosition({
        top: shouldShowAbove ? rect.top - dropdownHeight - 8 : rect.bottom + 8,
        left: leftPosition,
        width: rect.width
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle scroll to close dropdown
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll, true);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen]);

  const handleTimeSelect = (hour: string, minute: string) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    onChange(`${hour}:${minute}`);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleHourClick = (hour: string) => {
    handleTimeSelect(hour, selectedMinute);
  };

  const handleMinuteClick = (minute: string) => {
    handleTimeSelect(selectedHour, minute);
  };

  const dropdown = isOpen ? (
    <div
      ref={dropdownRef}
      className={`fixed z-[9999] rounded-xl shadow-2xl border overflow-visible pointer-events-auto ${
        darkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
      style={{
        top: `${dropdownPosition.top}px`,
        left: `${dropdownPosition.left}px`,
        width: window.innerWidth < 640 ? `${Math.min(window.innerWidth - 32, 380)}px` : '420px',
        minWidth: '320px',
        maxWidth: '420px'
      }}
    >
      <div className="flex divide-x divide-gray-200 dark:divide-gray-700">
        {/* Hours - Much wider column */}
        <div className="p-3 sm:p-4" style={{ flex: '0 0 70%' }}>
          <div className={`text-base sm:text-lg font-medium text-center mb-3 pb-2 border-b ${
            darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-900 border-gray-200'
          }`}>
            Hour
          </div>
          <div className="max-h-72 overflow-y-auto scrollbar-thin pr-1">
            <div className="grid grid-cols-3 gap-2">
              {hours.map((hour) => (
                <button
                  key={hour}
                  type="button"
                  onClick={() => handleHourClick(hour)}
                  className={`py-2.5 sm:py-3 px-2 rounded-lg transition-all min-h-[48px] sm:min-h-[56px] cursor-pointer font-medium w-full flex items-center justify-center ${
                    hour === selectedHour
                      ? 'bg-[#2196F3] text-white shadow-md scale-105'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700 border border-gray-700'
                        : 'text-gray-900 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <span className="text-base sm:text-lg">{hour}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Minutes - Much narrower single column */}
        <div className="p-2 sm:p-3" style={{ flex: '0 0 30%' }}>
          <div className={`text-base sm:text-lg font-medium text-center mb-3 pb-2 border-b ${
            darkMode ? 'text-gray-300 border-gray-700' : 'text-gray-900 border-gray-200'
          }`}>
            Min
          </div>
          <div className="flex flex-col gap-2">
            {minutes.map((minute) => (
              <button
                key={minute}
                type="button"
                onClick={() => handleMinuteClick(minute)}
                className={`py-2.5 sm:py-3 px-1.5 rounded-lg transition-all min-h-[48px] sm:min-h-[56px] cursor-pointer font-medium w-full flex items-center justify-center ${
                  minute === selectedMinute
                    ? 'bg-[#2196F3] text-white shadow-md scale-105'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 border border-gray-700'
                      : 'text-gray-900 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span className="text-base sm:text-lg">{minute}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-3 sm:p-4 border-t ${
        darkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          type="button"
          onClick={() => {
            const finalTime = `${selectedHour}:${selectedMinute}`;
            if (finalTime !== value) {
              onChange(finalTime);
            }
            setIsOpen(false);
          }}
          className="w-full py-3.5 sm:py-4 px-4 bg-[#2196F3] text-white rounded-lg hover:bg-[#1976D2] transition-colors text-base sm:text-lg font-medium min-h-[56px] sm:min-h-[60px] shadow-md cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={`relative ${className}`}>
        {label && (
          <label className={`text-sm sm:text-base block mb-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-700'
          }`}>
            {label}
          </label>
        )}
        
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border flex items-center justify-center text-base sm:text-lg lg:text-xl min-h-[52px] sm:min-h-[56px] ${
            darkMode
              ? 'border-gray-600 bg-gray-700 text-white hover:border-gray-500'
              : 'border-gray-300 bg-white text-gray-900 hover:border-gray-400'
          } focus:outline-none focus:ring-2 focus:ring-[#2196F3] transition-colors`}
        >
          <span className="flex items-center justify-center leading-none">
            {value || '08:00'}
          </span>
        </button>
      </div>

      {/* Portal for dropdown */}
      {typeof document !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
    </>
  );
}
