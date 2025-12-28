import { memo } from 'react';
import { Plus, Users, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

interface FABButtonsProps {
  role: 'patient' | 'caregiver' | 'doctor';
  onAddMedication?: () => void;
  onAddDependent?: () => void;
  onAddPatient?: () => void;
  darkMode: boolean;
}

function FABButtons({
  role,
  onAddMedication,
  onAddDependent,
  onAddPatient,
  darkMode
}: FABButtonsProps) {
  const handleClick = () => {
    if (role === 'patient' && onAddMedication) {
      onAddMedication();
    } else if (role === 'caregiver' && onAddDependent) {
      onAddDependent();
    } else if (role === 'doctor' && onAddPatient) {
      onAddPatient();
    }
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const getLabel = () => {
    if (role === 'patient') return 'Add Medication';
    if (role === 'caregiver') return 'Add Dependent';
    return 'Add Patient';
  };

  const getIcon = () => {
    if (role === 'patient') return <Plus className="w-7 h-7" strokeWidth={2.5} />;
    if (role === 'caregiver') return <Users className="w-7 h-7" strokeWidth={2.5} />;
    return <UserPlus className="w-7 h-7" strokeWidth={2.5} />;
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        fixed bottom-36 right-4 sm:bottom-40 lg:bottom-10 lg:right-10
        w-14 h-14 lg:w-18 lg:h-18
        rounded-full shadow-2xl
        bg-[#2196F3] hover:bg-[#1976D2]
        text-white
        flex items-center justify-center
        transition-all duration-200
        z-40
        touch-manipulation
        group
      `}
      style={{
        boxShadow: '0 10px 30px rgba(33, 150, 243, 0.4)'
      }}
      aria-label={getLabel()}
      title={getLabel()}
    >
      {getIcon()}
      
      {/* Tooltip on hover (desktop only) */}
      <span className={`
        hidden lg:group-hover:block
        absolute right-full mr-3
        px-4 py-2 rounded-lg
        whitespace-nowrap
        ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        shadow-lg border-2 border-[#2196F3]
        pointer-events-none
      `}>
        {getLabel()}
      </span>
    </motion.button>
  );
}

export default memo(FABButtons);