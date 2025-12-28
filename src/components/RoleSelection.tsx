import { motion } from 'motion/react';
import { User, Users, Stethoscope, CheckCircle2 } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole: 'myself' | 'caregiver' | 'doctor';
  onRoleSelect: (role: 'myself' | 'caregiver' | 'doctor') => void;
  darkMode?: boolean;
}

export default function RoleSelection({ selectedRole, onRoleSelect, darkMode }: RoleSelectionProps) {
  const roles = [
    {
      id: 'myself' as const,
      title: 'Patient',
      subtitle: 'Managing my own medications',
      icon: User,
      color: 'blue',
      bgColor: darkMode ? 'bg-blue-900/20' : 'bg-blue-50',
      borderColor: 'border-blue-500',
      iconColor: 'text-blue-500',
      hoverBg: darkMode ? 'hover:bg-blue-900/30' : 'hover:bg-blue-100',
    },
    {
      id: 'caregiver' as const,
      title: 'Caregiver',
      subtitle: 'Caring for family or friends',
      icon: Users,
      color: 'orange',
      bgColor: darkMode ? 'bg-orange-900/20' : 'bg-orange-50',
      borderColor: 'border-orange-500',
      iconColor: 'text-orange-500',
      hoverBg: darkMode ? 'hover:bg-orange-900/30' : 'hover:bg-orange-100',
    },
    {
      id: 'doctor' as const,
      title: 'Healthcare Professional',
      subtitle: 'Managing patient prescriptions',
      icon: Stethoscope,
      color: 'purple',
      bgColor: darkMode ? 'bg-purple-900/20' : 'bg-purple-50',
      borderColor: 'border-purple-500',
      iconColor: 'text-purple-500',
      hoverBg: darkMode ? 'hover:bg-purple-900/30' : 'hover:bg-purple-100',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center mb-5 sm:mb-6">
        <h3 className={`text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 leading-tight ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Select Your Role
        </h3>
        <p className={`text-base sm:text-lg leading-relaxed ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Choose how you will use Prescription Clarity
        </p>
      </div>

      <div className="space-y-4">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => {
                if ('vibrate' in navigator) {
                  navigator.vibrate(30);
                }
                onRoleSelect(role.id);
              }}
              whileTap={{ scale: 0.98 }}
              className={`w-full p-5 sm:p-6 rounded-xl border-3 transition-all duration-200 min-h-[88px] ${
                isSelected
                  ? `${role.borderColor} ${role.bgColor}`
                  : darkMode
                    ? 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
              } ${role.hoverBg} touch-manipulation`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? role.bgColor : darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <Icon 
                    className={`w-8 h-8 sm:w-9 sm:h-9 ${isSelected ? role.iconColor : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    strokeWidth={2.5}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 text-left">
                  <h4 className={`text-lg sm:text-xl font-semibold mb-1.5 leading-tight ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {role.title}
                  </h4>
                  <p className={`text-base sm:text-lg leading-relaxed ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {role.subtitle}
                  </p>
                </div>

                {/* Check Icon */}
                <div className="flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle2 
                      className={`w-7 h-7 sm:w-8 sm:h-8 ${role.iconColor}`}
                      strokeWidth={2.5}
                    />
                  ) : (
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 ${
                      darkMode ? 'border-gray-600' : 'border-gray-300'
                    }`} />
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
