import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Users, Stethoscope, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import RoleSwitchConfirmDialog from './RoleSwitchConfirmDialog';

interface RoleSwitcherModalProps {
  currentRole: 'myself' | 'caregiver' | 'doctor';
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  darkMode: boolean;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function RoleSwitcherModal({ 
  currentRole, 
  onRoleChange, 
  darkMode,
  isOpen: externalIsOpen,
  onClose 
}: RoleSwitcherModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState<'myself' | 'caregiver' | 'doctor' | null>(null);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onClose ? onClose : setInternalIsOpen;

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
      buttonBg: 'bg-blue-500',
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
      buttonBg: 'bg-orange-500',
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
      buttonBg: 'bg-purple-500',
    },
  ];

  const currentRoleData = roles.find(r => r.id === currentRole)!;
  const CurrentIcon = currentRoleData.icon;

  const handleRoleSelect = (roleId: 'myself' | 'caregiver' | 'doctor') => {
    if (roleId === currentRole) {
      if (onClose) {
        onClose();
      } else {
        setInternalIsOpen(false);
      }
      return;
    }

    // Show confirmation dialog before switching
    setPendingRole(roleId);
    setShowConfirmDialog(true);
  };

  const handleConfirmRoleSwitch = () => {
    if (!pendingRole) return;

    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    const newRole = roles.find(r => r.id === pendingRole)!;
    toast.success(`Switched to ${newRole.title}`, {
      description: newRole.subtitle,
      duration: 2000,
    });

    onRoleChange(pendingRole);
    setPendingRole(null);
    
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger Button - only show if not controlled externally */}
      {externalIsOpen === undefined && (
        <button
          onClick={() => {
            if ('vibrate' in navigator) {
              navigator.vibrate(30);
            }
            setInternalIsOpen(true);
          }}
          className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full transition-all shadow-md hover:shadow-lg touch-manipulation ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-white hover:bg-gray-50'
          }`}
          aria-label="Switch role"
        >
          <CurrentIcon 
            size={20} 
            className={`sm:w-6 sm:h-6 ${currentRoleData.iconColor}`}
            strokeWidth={2.5} 
          />
        </button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (onClose) {
                  onClose();
                } else {
                  setInternalIsOpen(false);
                }
              }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className={`w-full max-w-md rounded-2xl shadow-2xl ${
                  darkMode ? 'bg-gray-800' : 'bg-white'
                }`}
              >
                {/* Header */}
                <div className={`flex items-center justify-between p-5 sm:p-6 border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div>
                    <h2 className={`text-lg sm:text-xl font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      Switch Role
                    </h2>
                    <p className={`text-sm sm:text-base mt-1 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Select your active profile
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (onClose) {
                        onClose();
                      } else {
                        setInternalIsOpen(false);
                      }
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      darkMode
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                    }`}
                    aria-label="Close"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Role Cards */}
                <div className="p-4 sm:p-6 space-y-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    const isActive = role.id === currentRole;

                    return (
                      <motion.button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 touch-manipulation ${
                          isActive
                            ? `${role.borderColor} ${role.bgColor}`
                            : darkMode
                              ? 'border-gray-700 bg-gray-750 hover:bg-gray-700'
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          {/* Icon */}
                          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isActive ? role.bgColor : darkMode ? 'bg-gray-700' : 'bg-white'
                          }`}>
                            <Icon 
                              className={`w-7 h-7 sm:w-8 sm:h-8 ${isActive ? role.iconColor : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                              strokeWidth={2}
                            />
                          </div>

                          {/* Text */}
                          <div className="flex-1 text-left">
                            <h4 className={`text-base sm:text-lg font-semibold mb-0.5 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {role.title}
                            </h4>
                            <p className={`text-sm leading-snug ${
                              darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {role.subtitle}
                            </p>
                          </div>

                          {/* Check/Radio */}
                          <div className="flex-shrink-0">
                            {isActive ? (
                              <CheckCircle2 
                                className={`w-6 h-6 sm:w-7 sm:h-7 ${role.iconColor}`}
                                strokeWidth={2.5}
                              />
                            ) : (
                              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 ${
                                darkMode ? 'border-gray-600' : 'border-gray-300'
                              }`} />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Footer Info */}
                <div className={`px-5 sm:px-6 pb-5 sm:pb-6 pt-2`}>
                  <div className={`p-3 sm:p-4 rounded-lg ${
                    darkMode ? 'bg-gray-750' : 'bg-gray-50'
                  }`}>
                    <p className={`text-sm leading-relaxed ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Your data is kept separate for each role. Switch anytime to access the appropriate dashboard.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      {pendingRole && (
        <RoleSwitchConfirmDialog
          isOpen={showConfirmDialog}
          onClose={() => {
            setShowConfirmDialog(false);
            setPendingRole(null);
          }}
          onConfirm={handleConfirmRoleSwitch}
          currentRole={currentRole}
          newRole={pendingRole}
          darkMode={darkMode}
        />
      )}
    </>
  );
}
