import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  CalendarDays,
  Clock,
  Pill,
  Award,
  Settings,
  Users,
  User,
  BarChart3,
  LogOut,
  Bell,
  RefreshCw,
  Home,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';
import RoleSwitcherModal from '../RoleSwitcherModal';
import { generateUserPhoto, getFullName, getRoleColor } from '../../utils/photoUtils';
import { PillShieldLogo } from '../PillShieldLogo';

interface BurgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  userGender?: 'Male' | 'Female' | 'Other';
  userAge?: number;
  userFirstName?: string;
  userLastName?: string;
  userPhotoUrl?: string; // CRITICAL FIX: Add photoUrl prop
}

export default function BurgerMenu({
  isOpen,
  onToggle,
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onRoleChange,
  onLogout,
  userName = 'User',
  userEmail = 'user@example.com',
  userGender,
  userAge,
  userFirstName,
  userLastName,
  userPhotoUrl, // CRITICAL FIX: Accept photoUrl
}: BurgerMenuProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  // OPTIMIZATION: Only Overview section open by default to minimize scrolling
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,    // ✅ Open by default
    tracking: false,   // ❌ Closed - minimize scrolling
    personal: false,   // ❌ Closed - minimize scrolling
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Close menu on navigation
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    onToggle();
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const roleColors = getRoleColor(userRole);

  // Unified blue color scheme for all roles
  const bgColorClass = 'bg-blue-600';
  const textColorClass = 'text-blue-600';

  const getRoleLabel = () => {
    switch (userRole) {
      case 'caregiver':
        return 'Caregiver';
      case 'doctor':
        return 'Healthcare Professional';
      default:
        return 'Patient';
    }
  };

  const getNavSections = () => {
    if (userRole === 'caregiver') {
      return {
        main: [
          { id: 'caregiver', label: 'Dependents', icon: Users, page: 'caregiver' },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            page: 'caregiver-analytics',
          },
          { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
        ]
      };
    }

    if (userRole === 'doctor') {
      return {
        main: [
          { id: 'doctor', label: 'Patients', icon: User, page: 'doctor' },
          {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            page: 'doctor-analytics',
          },
          {
            id: 'medication-reference',
            label: 'Medication Database',
            icon: Pill,
            page: 'medication-reference',
          },
          { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
        ]
      };
    }

    // Patient (myself) navigation - grouped
    return {
      overview: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { id: 'today', label: 'Today', icon: Calendar, page: 'today' },
        {
          id: 'week-view',
          label: 'Week View',
          icon: CalendarDays,
          page: 'week-view',
        },
      ],
      tracking: [
        { id: 'history', label: 'History', icon: Clock, page: 'history' },
        {
          id: 'all-medications',
          label: 'All Medications',
          icon: Pill,
          page: 'all-medications',
        },
        {
          id: 'notifications',
          label: 'Notifications',
          icon: Bell,
          page: 'notifications',
        },
      ],
      personal: [
        { id: 'rewards', label: 'Achievements', icon: Award, page: 'rewards' },
        { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
      ]
    };
  };

  const navSections = getNavSections();

  // Generate user photo - CRITICAL FIX: Use userPhotoUrl if available!
  const userPhoto = userPhotoUrl || generateUserPhoto({
    firstName: userFirstName || userName.split(' ')[0],
    lastName: userLastName || userName.split(' ')[1],
    age: userAge,
    gender: userGender,
    role: userRole === 'myself' ? 'patient' : userRole,
  });

  const fullName = getFullName(
    userFirstName || userName.split(' ')[0],
    userLastName || userName.split(' ')[1]
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm ${
              darkMode ? 'bg-gray-900' : 'bg-white'
            } shadow-2xl z-50 lg:hidden flex flex-col`}
          >
            {/* Header with User Profile Photo - Sticky */}
            <div
              className={`sticky top-0 z-10 ${
                darkMode ? 'bg-gray-900' : 'bg-white'
              } border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
            >
              {/* Close Button - Top Right */}
              <div className="flex justify-end p-3 pb-0">
                <button
                  onClick={onToggle}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-700'
                  } transition-colors touch-manipulation`}
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile - Top Left */}
              <div className="px-4 pb-4">
                <div className="flex items-start gap-3">
                  {/* Profile Photo with Role Border - DOUBLE CIRCLE FIX */}
                  <div className="relative flex-shrink-0">
                    {/* Outer circle - Role border */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center"
                      style={{
                        border: `2px solid ${roleColors.border}`,
                        backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                        padding: '2px',
                      }}
                    >
                      {/* Inner circle - Photo container */}
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={userPhoto}
                          alt={fullName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to initials if photo fails to load
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full rounded-full flex items-center justify-center font-semibold text-base"
                                     style="background-color: ${roleColors.bg}; color: ${roleColors.text}">
                                  ${fullName.split(' ').map(n => n[0]).join('')}
                                </div>
                              `;
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Name and Email */}
                  <div className="flex-1 min-w-0">
                    <h2
                      className={`font-semibold text-lg leading-tight truncate ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {fullName}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate leading-tight mt-0.5">
                      {userEmail}
                    </p>
                    <Badge
                      className={`mt-1.5 ${bgColorClass} text-white text-xs px-2 py-0.5 border-none`}
                    >
                      {getRoleLabel()}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation - Scrollable */}
            <nav className="flex-1 overflow-y-auto p-3">
              {/* Switch Role Button */}
              <button
                onClick={() => setShowRoleSwitcher(true)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl mb-2 transition-colors touch-manipulation ${
                  darkMode
                    ? 'bg-gray-800 hover:bg-gray-700 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                style={{ minHeight: '48px' }}
              >
                <RefreshCw className="w-5 h-5" />
                <span className="font-medium text-base">Switch Role</span>
              </button>

              <div className="h-px bg-gray-200 dark:bg-gray-800 my-3" />

              {/* Navigation Items */}
              {userRole === 'myself' ? (
                // Grouped navigation for Patient role
                <div className="space-y-2">
                  {/* Overview Section */}
                  <Collapsible open={openSections.overview} onOpenChange={() => toggleSection('overview')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-sm font-bold">Overview</span>
                      {openSections.overview ? (
                        <ChevronUp size={18} strokeWidth={2.5} />
                      ) : (
                        <ChevronDown size={18} strokeWidth={2.5} />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navSections.overview?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.page;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.page)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors touch-manipulation ${
                              isActive
                                ? `${bgColorClass} text-white`
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            <span className="font-medium text-base">{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Tracking Section */}
                  <Collapsible open={openSections.tracking} onOpenChange={() => toggleSection('tracking')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-sm font-bold">Tracking</span>
                      {openSections.tracking ? (
                        <ChevronUp size={18} strokeWidth={2.5} />
                      ) : (
                        <ChevronDown size={18} strokeWidth={2.5} />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navSections.tracking?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.page;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.page)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors touch-manipulation ${
                              isActive
                                ? `${bgColorClass} text-white`
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            <span className="font-medium text-base">{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Personal Section */}
                  <Collapsible open={openSections.personal} onOpenChange={() => toggleSection('personal')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}>
                      <span className="text-sm font-bold">Personal</span>
                      {openSections.personal ? (
                        <ChevronUp size={18} strokeWidth={2.5} />
                      ) : (
                        <ChevronDown size={18} strokeWidth={2.5} />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navSections.personal?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.page;

                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.page)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors touch-manipulation ${
                              isActive
                                ? `${bgColorClass} text-white`
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                            <span className="font-medium text-base">{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              ) : (
                // Simple list for Caregiver/Doctor roles
                <div className="space-y-1">
                  {navSections.main?.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.page)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors touch-manipulation ${
                          isActive
                            ? `${bgColorClass} text-white`
                            : darkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2.5} />
                        <span className="font-medium text-base">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="h-px bg-gray-200 dark:bg-gray-800 my-3" />

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-colors touch-manipulation ${
                  darkMode
                    ? 'text-red-400 hover:bg-red-900/20'
                    : 'text-red-600 hover:bg-red-50'
                }`}
                style={{ minHeight: '48px' }}
              >
                <LogOut className="w-5 h-5" strokeWidth={2.5} />
                <span className="font-medium text-base">Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Switcher Modal */}
      <RoleSwitcherModal
        isOpen={showRoleSwitcher}
        onClose={() => setShowRoleSwitcher(false)}
        currentRole={userRole}
        onRoleChange={(role) => {
          onRoleChange(role);
          setShowRoleSwitcher(false);
          onToggle();
        }}
        darkMode={darkMode}
      />
    </>
  );
}
