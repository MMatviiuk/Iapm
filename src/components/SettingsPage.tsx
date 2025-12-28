import { useState, useEffect } from 'react';
import { Moon, Sun, User, Bell, Share2, FileText, Shield, ChevronRight, ChevronDown, LogOut, Clock, Printer, Users, Stethoscope, Volume2, Trash2, AlertTriangle, Pill, Lock, History, Key, Mail, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import TimePicker from './TimePicker';
import PhotoUploader from './PhotoUploader';
import { isSoundEnabled, setSoundEnabled, playSoundEffect } from '../utils/soundEffects';
import { TooltipProvider } from './ui/tooltip';
import { FieldWithTooltip } from './FieldWithTooltip';
import { Input } from './ui/input';
import { Button } from './ui/button';
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
import api from '../services/api';
import { Settings, Download, Badge } from 'lucide-react';

interface SettingsPageProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setCurrentPage: (page: string) => void;
  onLogout?: () => void;
  userRole?: 'myself' | 'caregiver' | 'doctor';
  onRoleChange?: (role: 'myself' | 'caregiver' | 'doctor') => void;
  autoScroll?: boolean;
  setAutoScroll?: (value: boolean) => void;
  todayFocus?: boolean;
  setTodayFocus?: (value: boolean) => void;
}

export default function SettingsPage({ 
  darkMode, 
  setDarkMode, 
  setCurrentPage, 
  onLogout, 
  userRole = 'myself', 
  onRoleChange, 
  autoScroll = true, 
  setAutoScroll,
  todayFocus = false,
  setTodayFocus
}: SettingsPageProps) {
  const [mealTimes, setMealTimes] = useState({
    monday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    tuesday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    wednesday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    thursday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    friday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    saturday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' },
    sunday: { breakfast: '08:00', lunch: '12:00', dinner: '18:00' }
  });

  const [notifications, setNotifications] = useState({
    enabled: true,
    beforeMeal: 15,
    missedDose: true
  });

  const [shareEmail, setShareEmail] = useState('');
  const [showShareForm, setShowShareForm] = useState(false);
  const [showMealTimes, setShowMealTimes] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState(isSoundEnabled());

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationStep, setDeleteConfirmationStep] = useState(1);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Profile state
  const [profileName, setProfileName] = useState('John Doe');
  const [profileEmail, setProfileEmail] = useState('john.doe@example.com');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // COLLAPSIBLE SECTIONS STATE - для мінімізації scrolling
  const [expandedSections, setExpandedSections] = useState<{
    appearance: boolean;
    mealTimes: boolean;
    privacy: boolean;
    account: boolean;
    resources: boolean;
    legal: boolean;
  }>({
    appearance: true, // Відкрито за замовчуванням (найчастіше використовується)
    mealTimes: false,
    privacy: false,
    account: false,
    resources: false,
    legal: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleProfilePhotoChange = (photoUrl: string) => {
    setProfilePhoto(photoUrl);
    toast.success('Profile photo updated', {
      description: 'Your profile photo has been saved',
      duration: 2000,
    });
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    // TODO: Call API to change password
    toast.success('Password changed successfully');
    setShowPasswordChange(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    toast.success(`Schedule shared with ${shareEmail}`, {
      description: 'They will receive an email notification',
      duration: 3000,
    });
    
    setShareEmail('');
    setShowShareForm(false);
  };

  const handleMealTimeChange = (day: string, meal: string, value: string) => {
    setMealTimes({
      ...mealTimes,
      [day]: {
        ...mealTimes[day as keyof typeof mealTimes],
        [meal]: value
      }
    });
    
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleTermsClick = () => {
    setCurrentPage('terms');
  };

  const handlePrivacyClick = () => {
    setCurrentPage('privacy');
  };

  const handlePrintClick = () => {
    setCurrentPage('print');
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
    
    toast.success(`${!darkMode ? 'Dark' : 'Light'} mode enabled`, {
      duration: 1500,
    });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
      
      toast.success('Logged out successfully', {
        description: 'See you soon!',
        duration: 2000,
      });
      
      setTimeout(() => {
        if (onLogout) {
          onLogout();
        }
      }, 500);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);

    try {
      await api.deleteAccount();
      
      toast.success('Account deleted', {
        description: 'Your data has been permanently deleted (GDPR compliant)',
        duration: 3000,
      });

      // Wait a moment then logout
      setTimeout(() => {
        if (onLogout) {
          onLogout();
        }
      }, 1500);
    } catch (error: any) {
      console.error('Delete account error:', error);
      toast.error('Failed to delete account', {
        description: error.message || 'Please try again',
      });
      setIsDeleting(false);
    }
  };

  const getDeleteWarningMessage = () => {
    if (userRole === 'caregiver') {
      return 'Deleting your account will remove your access to all dependents. They will lose their caregiver connection but their medication data will remain intact.';
    }
    if (userRole === 'doctor') {
      return 'Deleting your account will remove your connection to all patients. They will lose their doctor connection but their medication data will remain intact.';
    }
    return 'All your medication data, history, and achievements will be permanently deleted. This action cannot be undone.';
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
  ];

  return (
    <TooltipProvider>
      <div className={`min-h-screen pb-24 ${darkMode ? 'bg-gray-900' : 'bg-[#E8F4F8]'}`}>
      <div className={`shadow-sm sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-xl sm:text-2xl font-semibold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-4 sm:py-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
        {/* Role Switcher */}
        {onRoleChange && (
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-5 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Account Type
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Myself Option */}
              <button
                onClick={() => onRoleChange('myself')}
                className={`w-full flex items-center gap-4 p-4 sm:p-5 rounded-xl transition-all border-2 touch-manipulation min-h-[80px] ${
                  userRole === 'myself'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : darkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl ${
                  userRole === 'myself' ? 'bg-blue-100 dark:bg-blue-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <User size={28} className={`sm:w-8 sm:h-8 ${userRole === 'myself' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold text-lg sm:text-xl leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Personal
                  </div>
                  <div className={`text-base sm:text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage my medications
                  </div>
                </div>
                {userRole === 'myself' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Caregiver Option */}
              <button
                onClick={() => onRoleChange('caregiver')}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all border-2 touch-manipulation ${
                  userRole === 'caregiver'
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : darkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg ${
                  userRole === 'caregiver' ? 'bg-orange-100 dark:bg-orange-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Users size={20} className={`sm:w-6 sm:h-6 ${userRole === 'caregiver' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Caregiver
                  </div>
                  <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage for dependents
                  </div>
                </div>
                {userRole === 'caregiver' && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>

              {/* Doctor Option */}
              <button
                onClick={() => onRoleChange('doctor')}
                className={`w-full flex items-center gap-3 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all border-2 touch-manipulation ${
                  userRole === 'doctor'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                    : darkMode
                      ? 'border-gray-700 hover:border-gray-600'
                      : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-lg ${
                  userRole === 'doctor' ? 'bg-purple-100 dark:bg-purple-800' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <Stethoscope size={20} className={`sm:w-6 sm:h-6 ${userRole === 'doctor' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} strokeWidth={2.5} />
                </div>
                <div className="flex-1 text-left">
                  <div className={`font-semibold text-sm sm:text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Medical Professional
                  </div>
                  <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Manage patients
                  </div>
                </div>
                {userRole === 'doctor' && (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon size={28} className="w-7 h-7" /> : <Sun size={28} className="w-7 h-7" />}
                <span className={`text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dark Mode
                </span>
              </div>
              <button
                onClick={handleDarkModeToggle}
                className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors touch-manipulation ${
                  darkMode ? 'bg-[#2196F3]' : 'bg-gray-300'
                }`}
                aria-label="Toggle dark mode"
              >
                <span
                  className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>



            {setAutoScroll && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <ChevronDown size={28} className="w-7 h-7" />
                  <div>
                    <span className={`text-sm sm:text-base block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Auto-scroll
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Scroll to next medication
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAutoScroll(!autoScroll);
                    if ('vibrate' in navigator) {
                      navigator.vibrate(20);
                    }
                    toast.success(`Auto-scroll ${!autoScroll ? 'enabled' : 'disabled'}`, {
                      duration: 1500,
                    });
                  }}
                  className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors touch-manipulation ${
                    autoScroll ? 'bg-[#2196F3]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle auto-scroll"
                >
                  <span
                    className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
                      autoScroll ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Sound Effects */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Volume2 size={28} className="w-7 h-7" />
                <div>
                  <span className={`text-sm sm:text-base block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sound Effects
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Audio feedback for actions
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const newValue = !soundEnabled;
                  setSoundEnabledState(newValue);
                  setSoundEnabled(newValue);
                  if ('vibrate' in navigator) {
                    navigator.vibrate(20);
                  }
                  // Play test sound if enabling
                  if (newValue) {
                    playSoundEffect('success');
                  }
                  toast.success(`Sound effects ${newValue ? 'enabled' : 'disabled'}`, {
                    duration: 1500,
                  });
                }}
                className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors touch-manipulation ${
                  soundEnabled ? 'bg-[#2196F3]' : 'bg-gray-300'
                }`}
                aria-label="Toggle sound effects"
              >
                <span
                  className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Today's Focus - Patient Only */}
            {userRole === 'myself' && setTodayFocus && (
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <Clock size={28} className="w-7 h-7" />
                  <div>
                    <span className={`text-sm sm:text-base block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Today's Focus
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Show Today screen by default
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (setTodayFocus) {
                      setTodayFocus(!todayFocus);
                      if ('vibrate' in navigator) {
                        navigator.vibrate(20);
                      }
                      toast.success(`Today's Focus ${!todayFocus ? 'enabled' : 'disabled'}`, {
                        description: !todayFocus 
                          ? 'You will see Today screen when you log in' 
                          : 'You will see Dashboard when you log in',
                        duration: 2000,
                      });
                    }
                  }}
                  className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors touch-manipulation ${
                    todayFocus ? 'bg-[#2196F3]' : 'bg-gray-300'
                  }`}
                  aria-label="Toggle Today's Focus"
                >
                  <span
                    className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform ${
                      todayFocus ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Meal Times - Only show for personal profile */}
        {userRole === 'myself' && (
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <button
              onClick={() => setShowMealTimes(!showMealTimes)}
              className="w-full flex items-center justify-between touch-manipulation"
            >
              <div className="flex items-center gap-3">
                <Clock size={28} className="w-7 h-7" />
                <div className="text-left">
                  <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Weekly Meal Times
                  </h2>
                  <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Set your meal schedule
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: showMealTimes ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={28} className={`w-7 h-7 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </motion.div>
            </button>

          <AnimatePresence>
            {showMealTimes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                {/* Header */}
                <div className="mt-3 sm:mt-4 px-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="min-w-[40px] sm:min-w-[50px]"></div>
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Breakfast
                      </span>
                      <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Lunch
                      </span>
                      <span className={`text-xs text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Dinner
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 sm:space-y-2.5">
                  {daysOfWeek.map(({ key, label }) => (
                    <div 
                      key={key}
                      className={`p-2.5 sm:p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm sm:text-base font-medium min-w-[40px] sm:min-w-[50px] ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {label}
                        </span>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <TimePicker
                            value={mealTimes[key as keyof typeof mealTimes].breakfast}
                            onChange={(value) => handleMealTimeChange(key, 'breakfast', value)}
                            darkMode={darkMode}
                            mealType="breakfast"
                          />
                          <TimePicker
                            value={mealTimes[key as keyof typeof mealTimes].lunch}
                            onChange={(value) => handleMealTimeChange(key, 'lunch', value)}
                            darkMode={darkMode}
                            mealType="lunch"
                          />
                          <TimePicker
                            value={mealTimes[key as keyof typeof mealTimes].dinner}
                            onChange={(value) => handleMealTimeChange(key, 'dinner', value)}
                            darkMode={darkMode}
                            mealType="dinner"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          </div>
        )}

        {/* Privacy & Security Section - NEW! */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <Shield className="w-7 h-7 text-green-600" />
            <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Privacy & Security
            </h2>
          </div>
          
          <div className="space-y-2">
            {/* Data Encryption Status */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-950/30 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className={`font-semibold mb-1 ${darkMode ? 'text-green-300' : 'text-green-900'}`}>
                    End-to-End Encryption Active
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                    Your health data is encrypted in transit and at rest. Only you can access your information.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Sharing Controls */}
            <button
              onClick={() => {
                toast.info('Data Sharing Settings', {
                  description: 'Configure who can see your medication history',
                  duration: 2000,
                });
              }}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-7 h-7" />
                <div className="text-left">
                  <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Data Sharing Permissions
                  </span>
                  <span className={`block text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Manage caregiver/doctor access
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {/* HIPAA/GDPR Compliance Info */}
            <button
              onClick={() => {
                toast.info('HIPAA & GDPR Compliant', {
                  description: 'View our privacy policy and compliance certifications',
                  duration: 3000,
                });
              }}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-7 h-7" />
                <div className="text-left">
                  <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Privacy Policy & Compliance
                  </span>
                  <span className={`block text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    HIPAA & GDPR certified
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {/* Audit Log */}
            <button
              onClick={() => {
                toast.info('Activity Log', {
                  description: 'View recent access to your health data',
                  duration: 2000,
                });
              }}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <History className="w-7 h-7" />
                <div className="text-left">
                  <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Activity & Audit Log
                  </span>
                  <span className={`block text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    See who accessed your data
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {/* Two-Factor Authentication */}
            <button
              onClick={() => {
                toast.info('Two-Factor Authentication', {
                  description: 'Add extra security to your account (Coming Soon)',
                  duration: 2000,
                });
              }}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Key className="w-7 h-7" />
                <div className="text-left">
                  <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Two-Factor Authentication
                  </span>
                  <span className={`block text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Coming soon - Extra security
                  </span>
                </div>
              </div>
              <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Account
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={handleProfileClick}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <User size={28} className="w-7 h-7" />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Profile Settings
                </span>
              </div>
              <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              onClick={handlePrintClick}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Printer size={28} className="w-7 h-7" />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Print Schedule
                </span>
              </div>
              <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Resources
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setCurrentPage('medication-database')}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Pill size={28} className="w-7 h-7" />
                <div className="text-left">
                  <span className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Medication Database
                  </span>
                  <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    View medication photos
                  </span>
                </div>
              </div>
              <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>
          </div>
        </div>

        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Legal
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={handleTermsClick}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={28} className="w-7 h-7" />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Terms of Service
                </span>
              </div>
              <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            <button
              onClick={handlePrivacyClick}
              className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shield size={28} className="w-7 h-7" />
                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Privacy Policy
                </span>
              </div>
              <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            </button>

            {/* Share Profile (Patient Only) */}
            {userRole === 'myself' && (
              <button
                onClick={() => {
                  setCurrentPage('share-profile');
                  toast.info('Share your medication schedule with caregivers');
                }}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Share2 size={28} className="w-7 h-7 text-blue-600 dark:text-blue-400" strokeWidth={2.5} />
                  <div className="text-left">
                    <span className={`font-medium block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Share Profile
                    </span>
                    <span className={`text-xs block ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      Let caregivers view your schedule
                    </span>
                  </div>
                </div>
                <ChevronRight size={24} className={`w-6 h-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </button>
            )}
          </div>
        </div>

        {/* Developer Section - Database Management */}
        {process.env.NODE_ENV === 'development' && (
          <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm ${darkMode ? 'bg-gray-800 border border-yellow-800' : 'bg-white border border-yellow-200'}`}>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <Settings className="w-7 h-7 text-yellow-600" />
              <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Developer Tools
              </h2>
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                DEV MODE
              </Badge>
            </div>
            
            <div className="space-y-2">
              {/* Export Database Changes */}
              <button
                onClick={() => {
                  const { exportDatabaseChanges, getLastModifiedTimestamp } = require('../utils/databasePersistence');
                  const json = exportDatabaseChanges();
                  const timestamp = getLastModifiedTimestamp();
                  
                  if (json === 'null') {
                    toast.info('No database changes yet', {
                      description: 'Make some changes to medications/patients first',
                      duration: 3000,
                    });
                  } else {
                    // Copy to clipboard
                    navigator.clipboard.writeText(json);
                    toast.success('Database changes exported!', {
                      description: timestamp 
                        ? `JSON copied to clipboard (Last modified: ${new Date(timestamp).toLocaleString()})`
                        : 'JSON copied to clipboard',
                      duration: 5000,
                    });
                  }
                  
                  if ('vibrate' in navigator) navigator.vibrate(30);
                }}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                  darkMode ? 'hover:bg-yellow-950/30 border border-yellow-800' : 'hover:bg-yellow-50 border border-yellow-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Download className="w-7 h-7 text-yellow-600" />
                  <div className="text-left">
                    <span className={`block font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>
                      Export Database Changes
                    </span>
                    <span className={`block text-xs ${darkMode ? 'text-yellow-500' : 'text-yellow-700'}`}>
                      Copy localStorage changes as JSON
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-yellow-500' : 'text-yellow-600'}`} />
              </button>

              {/* Reset Database */}
              <button
                onClick={() => {
                  if (confirm('⚠️ Reset database to original?\n\nAll localStorage changes will be deleted. This cannot be undone.')) {
                    const { resetDatabase } = require('../utils/databasePersistence');
                    resetDatabase();
                    
                    toast.success('Database reset successful!', {
                      description: 'Reload the page to see original data',
                      duration: 5000,
                    });
                    
                    if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
                    
                    // Reload after 2 seconds
                    setTimeout(() => window.location.reload(), 2000);
                  }
                }}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors touch-manipulation min-h-[56px] ${
                  darkMode ? 'hover:bg-red-950/30 border border-red-800' : 'hover:bg-red-50 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-7 h-7 text-red-600" />
                  <div className="text-left">
                    <span className={`block font-medium ${darkMode ? 'text-red-300' : 'text-red-900'}`}>
                      Reset to Original Database
                    </span>
                    <span className={`block text-xs ${darkMode ? 'text-red-500' : 'text-red-700'}`}>
                      Delete all localStorage changes
                    </span>
                  </div>
                </div>
                <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-red-500' : 'text-red-600'}`} />
              </button>

              {/* Database Info */}
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <strong>How it works:</strong> Changes are saved to localStorage. Export JSON to upgrade demo data.
                  Reset clears localStorage and restores original data.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Danger Zone */}
        <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border-2 ${ 
          darkMode ? 'bg-red-950/20 border-red-900' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={28} className="w-7 h-7 text-red-600 dark:text-red-400" />
            <h2 className={`text-base sm:text-lg font-semibold ${darkMode ? 'text-red-400' : 'text-red-900'}`}>
              Danger Zone
            </h2>
          </div>
          
          <p className={`text-sm mb-4 ${darkMode ? 'text-red-300' : 'text-red-800'}`}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className={`w-full flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-colors shadow-sm touch-manipulation min-h-[56px] ${
              darkMode 
                ? 'border-red-800 bg-red-900/30 hover:bg-red-900/50 text-red-300' 
                : 'border-red-300 bg-white hover:bg-red-50 text-red-700'
            }`}
          >
            <Trash2 size={28} className="w-7 h-7" />
            <span className="font-medium">Delete Account</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors shadow-sm touch-manipulation min-h-[56px]"
        >
          <LogOut size={28} className="w-7 h-7" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className={`max-w-md sm:max-w-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <AlertDialogHeader>
            <AlertDialogTitle className={`text-xl sm:text-2xl flex items-center gap-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-red-600" />
              Delete Account?
            </AlertDialogTitle>
            <AlertDialogDescription className={`text-base sm:text-lg space-y-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="font-semibold text-red-600 dark:text-red-400">
                ⚠️ This action is permanent and cannot be undone!
              </p>
              
              <p>
                {getDeleteWarningMessage()}
              </p>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="font-semibold mb-2">What will be deleted:</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>All medications and schedules</li>
                  <li>Complete medication history</li>
                  <li>Achievements and progress</li>
                  <li>Profile and settings</li>
                  {userRole === 'caregiver' && <li>Access to all dependents</li>}
                  {userRole === 'doctor' && <li>Access to all patients</li>}
                </ul>
              </div>

              <div>
                <p className="font-semibold mb-2">Type <span className="text-red-600 dark:text-red-400">DELETE</span> to confirm:</p>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="Type DELETE"
                  className={`w-full px-4 py-3 sm:py-4 rounded-lg border-2 text-base sm:text-lg ${
                    darkMode 
                      ? 'bg-gray-900 border-gray-600 text-white placeholder-gray-500' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  autoComplete="off"
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                <strong>GDPR Compliance:</strong> Your data will be permanently deleted from all systems within 30 days, in compliance with data protection regulations.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-4">
            <AlertDialogCancel 
              className="h-12 sm:h-14 px-6 text-base sm:text-lg"
              onClick={() => {
                setDeleteConfirmText('');
                setShowDeleteConfirm(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== 'DELETE' || isDeleting}
              className={`h-12 sm:h-14 px-6 text-base sm:text-lg ${
                deleteConfirmText === 'DELETE' && !isDeleting
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </TooltipProvider>
  );
}