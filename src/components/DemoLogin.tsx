import { useState } from 'react';
import { User, Users, Stethoscope, ArrowLeft, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { PillShieldLogo } from './PillShieldLogo';

interface DemoLoginProps {
  onDemoLogin: (email: string, password: string, role: 'patient' | 'caregiver' | 'doctor') => void;
  onBack: () => void;
  darkMode: boolean;
}

const DEMO_ACCOUNTS = [
  {
    role: 'patient' as const,
    title: 'Patient Demo',
    subtitle: 'Manage your own medications',
    icon: User,
    email: 'patient@demo.com',
    password: 'demo123',
    color: 'blue',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    description: 'Experience managing your daily medication schedule with reminders and tracking.'
  },
  {
    role: 'caregiver' as const,
    title: 'Caregiver Demo',
    subtitle: 'Manage family members\' health',
    icon: Users,
    email: 'caregiver@demo.com',
    password: 'demo123',
    color: 'orange',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/50',
    iconColor: 'text-orange-600 dark:text-orange-400',
    description: 'Oversee medication schedules for multiple family members with analytics.'
  },
  {
    role: 'doctor' as const,
    title: 'Doctor Demo',
    subtitle: 'Manage patients & prescriptions',
    icon: Stethoscope,
    email: 'doctor@demo.com',
    password: 'demo123',
    color: 'purple',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    description: 'Access professional tools for prescribing and monitoring patient adherence.'
  }
];

export default function DemoLogin({ onDemoLogin, onBack, darkMode }: DemoLoginProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleDemoClick = async (account: typeof DEMO_ACCOUNTS[0]) => {
    setLoading(account.role);
    
    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onDemoLogin(account.email, account.password, account.role);
  };

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-950' : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    }`}>
      {/* Header */}
      <div className={`border-b-2 ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <PillShieldLogo size={48} />
              <div>
                <h1 className={`text-xl sm:text-2xl lg:text-3xl ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Try Demo
                </h1>
                <p className={`text-sm sm:text-base ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Choose your role to explore
                </p>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="ghost"
              className="h-11 sm:h-12 lg:h-14 px-4 sm:px-6"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Experience Prescription Clarity
          </h2>
          <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Explore the platform from different perspectives. All demo accounts are pre-populated with sample data.
          </p>
        </motion.div>

        {/* Demo Account Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {DEMO_ACCOUNTS.map((account, index) => {
            const Icon = account.icon;
            const isLoading = loading === account.role;
            
            return (
              <motion.div
                key={account.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div
                  className={`
                    h-full rounded-2xl border-2 ${account.borderColor}
                    ${account.bgColor}
                    p-6 sm:p-8
                    transition-all duration-200
                    cursor-pointer
                    ${isLoading ? 'opacity-50' : account.hoverColor}
                    ${darkMode ? 'shadow-xl' : 'shadow-lg'}
                  `}
                  onClick={() => !loading && handleDemoClick(account)}
                >
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 sm:w-20 sm:h-20
                    rounded-2xl
                    ${account.bgColor}
                    flex items-center justify-center
                    mb-4 sm:mb-6
                    mx-auto
                    border-2 ${account.borderColor}
                  `}>
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${account.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-xl sm:text-2xl text-center mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {account.title}
                  </h3>

                  {/* Subtitle */}
                  <p className={`text-sm sm:text-base text-center mb-4 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {account.subtitle}
                  </p>

                  {/* Description */}
                  <p className={`text-sm text-center mb-6 leading-relaxed ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {account.description}
                  </p>

                  {/* Login Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!loading) handleDemoClick(account);
                    }}
                    disabled={!!loading}
                    className={`
                      w-full h-12 sm:h-14
                      bg-${account.color}-600 hover:bg-${account.color}-700
                      text-white
                      transition-all duration-200
                    `}
                    style={{
                      backgroundColor: account.color === 'blue' ? '#2196F3' : 
                                      account.color === 'orange' ? '#F97316' : '#9333EA',
                    }}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                        Try {account.title}
                      </>
                    )}
                  </Button>

                  {/* Credentials (for reference) */}
                  <div className={`
                    mt-4 pt-4 border-t-2
                    ${darkMode ? 'border-gray-700' : 'border-gray-200'}
                    text-xs sm:text-sm text-center
                    ${darkMode ? 'text-gray-500' : 'text-gray-400'}
                  `}>
                    <p className="font-mono">{account.email}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`
            mt-8 sm:mt-12 p-6 rounded-xl border-2
            ${darkMode 
              ? 'bg-gray-900 border-gray-700' 
              : 'bg-blue-50 border-blue-200'
            }
          `}
        >
          <p className={`text-sm sm:text-base text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-700'
          }`}>
            💡 All demo data is for demonstration purposes only and will reset on logout.
            <br className="hidden sm:block" />
            Feel free to add, edit, or delete items to explore the full functionality.
          </p>
        </motion.div>
      </div>
    </div>
  );
}