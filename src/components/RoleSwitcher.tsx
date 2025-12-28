import { useState } from 'react';
import { Users, User, Stethoscope, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'myself' | 'caregiver' | 'doctor';
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  darkMode: boolean;
}

export default function RoleSwitcher({ currentRole, onRoleChange, darkMode }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles = [
    { 
      id: 'myself' as const, 
      label: 'Myself',
      icon: User,
      color: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'caregiver' as const, 
      label: 'Caregiver',
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400'
    },
    { 
      id: 'doctor' as const, 
      label: 'Doctor',
      icon: Stethoscope,
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const currentRoleData = roles.find(r => r.id === currentRole)!;
  const CurrentIcon = currentRoleData.icon;

  const handleRoleSelect = (roleId: 'myself' | 'caregiver' | 'doctor') => {
    onRoleChange(roleId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full transition-all shadow-md hover:shadow-lg touch-manipulation ${
          darkMode 
            ? 'bg-gray-700 hover:bg-gray-600' 
            : 'bg-white hover:bg-gray-50'
        }`}
        aria-label="Switch role"
      >
        <CurrentIcon 
          size={24} 
          className={`sm:w-7 sm:h-7 ${currentRoleData.color}`}
          strokeWidth={2.5} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Compact Menu */}
          <div className={`absolute top-full right-0 mt-2 w-40 sm:w-44 rounded-xl shadow-2xl border z-50 overflow-hidden ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = role.id === currentRole;
              
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`w-full px-3 py-3 flex items-center gap-2.5 transition-colors ${
                    isActive
                      ? darkMode
                        ? 'bg-blue-900/30'
                        : 'bg-blue-50'
                      : darkMode
                        ? 'hover:bg-gray-750'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`flex-shrink-0 ${role.color}`}
                    strokeWidth={2.5} 
                  />
                  <span className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {role.label}
                  </span>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 ml-auto" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
