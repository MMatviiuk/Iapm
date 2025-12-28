import { 
  LayoutDashboard, 
  Calendar,
  CalendarDays,
  Clock, 
  Plus, 
  Award, 
  Settings, 
  Users, 
  User, 
  Stethoscope,
  LogOut,
  Pill,
  BarChart3,
  Bell,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import RoleSwitcherModal from '../RoleSwitcherModal';
import { PillShieldLogo, PillShieldLogoOutline } from '../PillShieldLogo';
import { getAvatarUrl as getAvatarUrlUtil } from '../../utils/avatarUtils';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  currentUser?: any;
}

export default function Sidebar({
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onRoleChange,
  onLogout,
  currentUser,
}: SidebarProps) {
  // OPTIMIZATION: Only Overview section open by default to minimize scrolling
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({

    overview: true,    // ✅ Open by default
    tracking: false,   // ❌ Closed - minimize scrolling
    personal: false,   // ❌ Closed - minimize scrolling
  });
  
  // State for Role Switcher Modal
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const getRoleColor = () => {
    switch (userRole) {
      case 'caregiver': return 'orange';
      case 'doctor': return 'purple';
      default: return 'blue';
    }
  };

  const roleColor = getRoleColor();
  
  const getRoleColorClasses = () => {
    switch (userRole) {
      case 'caregiver':
        return {
          bg: 'bg-orange-500',
          bgLight: 'bg-orange-50 dark:bg-orange-950/30',
          bgHover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800',
          active: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 border-l-4 border-orange-600 dark:border-orange-400',
        };
      case 'doctor':
        return {
          bg: 'bg-purple-600',
          bgLight: 'bg-purple-50 dark:bg-purple-950/30',
          bgHover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
          text: 'text-purple-600 dark:text-purple-400',
          border: 'border-purple-200 dark:border-purple-800',
          active: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-l-4 border-purple-600 dark:border-purple-400',
        };
      default:
        return {
          bg: 'bg-blue-600',
          bgLight: 'bg-blue-50 dark:bg-blue-950/30',
          bgHover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          active: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400',
        };
    }
  };

  const colorClasses = getRoleColorClasses();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  // Get avatar URL (priority: custom photo → user photoUrl → fallback)
  const getAvatarUrl = () => {
    if (!currentUser) return null;
    
    return getAvatarUrlUtil({
      name: currentUser.name || 'User',
      gender: currentUser.gender?.toLowerCase() as 'male' | 'female',
      customPhotoUrl: currentUser.photoUrl
    });
  };

  // Navigation items based on role - grouped for Patient
  const getNavSections = () => {
    if (userRole === 'caregiver') {
      return {
        main: [
          { id: 'caregiver', label: 'Dependents', icon: Users, page: 'caregiver' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, page: 'caregiver-analytics' },
          { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
        ]
      };
    }

    if (userRole === 'doctor') {
      return {
        main: [
          { id: 'doctor', label: 'Patients', icon: User, page: 'doctor' },
          { id: 'analytics', label: 'Analytics', icon: BarChart3, page: 'doctor-analytics' },
          { id: 'medication-reference', label: 'Medication Database', icon: Pill, page: 'medication-reference' },
          { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
        ]
      };
    }

    // Patient (myself) navigation - grouped
    return {
      overview: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, page: 'dashboard' },
        { id: 'today', label: 'Today', icon: Calendar, page: 'main' },
        { id: 'week', label: 'Week View', icon: CalendarDays, page: 'week-view' },
      ],
      tracking: [
        { id: 'history', label: 'History', icon: Clock, page: 'history' },
        { id: 'medications', label: 'Medications', icon: Pill, page: 'medications-list' },
        { id: 'notifications', label: 'Notifications', icon: Bell, page: 'notifications' },
      ],
      personal: [
        { id: 'rewards', label: 'Achievements', icon: Award, page: 'rewards' },
        { id: 'settings', label: 'Settings', icon: Settings, page: 'settings' },
      ]
    };
  };

  const navSections = getNavSections();

  // Tooltip descriptions for navigation items (elderly-friendly explanations)
  const getTooltipDescription = (itemId: string): { title: string; description: string } => {
    const tooltips: Record<string, { title: string; description: string }> = {
      // Patient (myself) navigation
      dashboard: {
        title: 'Dashboard - Your Overview',
        description: 'See your medication statistics, upcoming doses, and today\'s progress at a glance'
      },
      today: {
        title: 'Today - Today\'s Schedule',
        description: 'View all medications you need to take today with times and mark them as taken'
      },
      week: {
        title: 'Week View - 7-Day Calendar',
        description: 'Plan ahead by seeing your entire week\'s medication schedule in one view'
      },
      history: {
        title: 'History - Past Tracking',
        description: 'Review when you took medications and track your adherence over time'
      },
      medications: {
        title: 'Medications - Your Complete List',
        description: 'See all your medications, supplements, and prescriptions in one place'
      },
      notifications: {
        title: 'Notifications - Manage Reminders',
        description: 'Set up and manage email or push notifications for medication times'
      },
      rewards: {
        title: 'Achievements - Earn Rewards',
        description: 'Track your streaks and earn achievement medals for consistent adherence'
      },
      settings: {
        title: 'Settings - App Configuration',
        description: 'Customize your profile, preferences, and app settings'
      },
      // Caregiver navigation
      caregiver: {
        title: 'Dependents - Family Members',
        description: 'Manage medications for family members you care for'
      },
      analytics: {
        title: 'Analytics - Track Performance',
        description: 'View adherence statistics and medication trends for all dependents'
      },
      // Doctor navigation
      doctor: {
        title: 'Patients - Your Patient List',
        description: 'View and manage all patients under your care'
      },
      'medication-reference': {
        title: 'Medication Database',
        description: 'Search and reference medication information and photos'
      }
    };

    return tooltips[itemId] || { title: '', description: '' };
  };

  return (
    <aside className={`h-screen border-r flex flex-col shadow-lg ${ 
      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
    }`} style={{ width: '264px' }}>
      {/* Logo & Brand - COMPACT */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <PillShieldLogo 
            size={48} 
            role={roleColor === 'blue' ? 'patient' : roleColor === 'orange' ? 'caregiver' : 'doctor'}
            className="flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className={`text-2xl font-bold tracking-tight leading-tight whitespace-nowrap ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Prescription
            </h1>
            <p className={`text-base font-medium leading-tight whitespace-nowrap ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Clarity
            </p>
          </div>
        </div>
      </div>

      {/* User Profile - COMPACT */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {/* User Avatar with Photo */}
          <Avatar className={`w-12 h-12 shadow-md flex-shrink-0 ring-2 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-900 ${
            roleColor === 'orange' ? 'ring-orange-500' : roleColor === 'purple' ? 'ring-purple-600' : 'ring-blue-600'
          }`}>
            {getAvatarUrl() && (
              <AvatarImage 
                src={getAvatarUrl()!} 
                alt={currentUser?.name || 'User'} 
              />
            )}
            <AvatarFallback className={`text-white text-base ${
              roleColor === 'orange' ? 'bg-orange-500' : roleColor === 'purple' ? 'bg-purple-600' : 'bg-blue-600'
            }`}>
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          
          {/* User Info with Role Switcher */}
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              {currentUser?.name || 'User'}
            </p>
            <button
              onClick={() => {
                // Open role switcher modal (you can add state for this)
                setShowRoleSwitcher(true);
              }}
              className={`text-xs hover:underline ${
                darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-700'
              }`}
            >
              {userRole === 'myself' ? 'Patient' : userRole === 'caregiver' ? 'Caregiver' : 'Doctor'} • Switch Role
            </button>
          </div>
          
          {/* RoleSwitcherModal - NOW VISIBLE */}
          <RoleSwitcherModal
            isOpen={showRoleSwitcher}
            onClose={() => setShowRoleSwitcher(false)}
            currentRole={userRole}
            onRoleChange={(role) => {
              onRoleChange(role);
              setShowRoleSwitcher(false);
            }}
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Navigation - SCROLLABLE with COMPACT spacing */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto">
        {userRole === 'myself' ? (
          // Grouped navigation for Patient role with collapsible sections
          <div className="space-y-2">
            {/* Overview Section */}
            <Collapsible open={openSections.overview} onOpenChange={() => toggleSection('overview')}>
              <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}>
                <span className="text-sm font-bold">Overview</span>
                {openSections.overview ? (
                  <ChevronUp size={18} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={18} strokeWidth={2.5} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                <TooltipProvider delayDuration={300}>
                  {navSections.overview?.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page || 
                      (item.page === 'main' && (currentPage === 'main' || currentPage === 'today'));
                    const tooltipData = getTooltipDescription(item.id);

                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? colorClasses.active + ' shadow-md'
                                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} ${colorClasses.bgHover}`
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon size={24} strokeWidth={2.5} className="flex-shrink-0" />
                            <span className="text-base font-semibold leading-tight flex-1 text-left">{item.label}</span>
                            {isActive && <ChevronRight size={18} strokeWidth={3} className="flex-shrink-0" />}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs p-3">
                          <p className="font-bold mb-1">{tooltipData.title}</p>
                          <p className="text-sm">{tooltipData.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </CollapsibleContent>
            </Collapsible>

            {/* Tracking Section */}
            <Collapsible open={openSections.tracking} onOpenChange={() => toggleSection('tracking')}>
              <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}>
                <span className="text-sm font-bold">Tracking</span>
                {openSections.tracking ? (
                  <ChevronUp size={18} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={18} strokeWidth={2.5} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                <TooltipProvider delayDuration={300}>
                  {navSections.tracking?.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page;
                    const tooltipData = getTooltipDescription(item.id);

                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? colorClasses.active + ' shadow-md'
                                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} ${colorClasses.bgHover}`
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon size={24} strokeWidth={2.5} className="flex-shrink-0" />
                            <span className="text-base font-semibold leading-tight flex-1 text-left">{item.label}</span>
                            {isActive && <ChevronRight size={18} strokeWidth={3} className="flex-shrink-0" />}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs p-3">
                          <p className="font-bold mb-1">{tooltipData.title}</p>
                          <p className="text-sm">{tooltipData.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </CollapsibleContent>
            </Collapsible>

            {/* Personal Section */}
            <Collapsible open={openSections.personal} onOpenChange={() => toggleSection('personal')}>
              <CollapsibleTrigger className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
              }`}>
                <span className="text-sm font-bold">Personal</span>
                {openSections.personal ? (
                  <ChevronUp size={18} strokeWidth={2.5} />
                ) : (
                  <ChevronDown size={18} strokeWidth={2.5} />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1 mt-1">
                <TooltipProvider delayDuration={300}>
                  {navSections.personal?.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page;
                    const tooltipData = getTooltipDescription(item.id);

                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentPage(item.page)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive
                                ? colorClasses.active + ' shadow-md'
                                : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} ${colorClasses.bgHover}`
                            }`}
                            style={{ minHeight: '48px' }}
                          >
                            <Icon size={24} strokeWidth={2.5} className="flex-shrink-0" />
                            <span className="text-base font-semibold leading-tight flex-1 text-left">{item.label}</span>
                            {isActive && <ChevronRight size={18} strokeWidth={3} className="flex-shrink-0" />}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs p-3">
                          <p className="font-bold mb-1">{tooltipData.title}</p>
                          <p className="text-sm">{tooltipData.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </CollapsibleContent>
            </Collapsible>

            {/* Quick Add Button - COMPACT */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentPage('add')}
                      className={`w-full flex items-center justify-center gap-3 px-5 py-4 ${colorClasses.bg} hover:opacity-90 text-white rounded-xl text-base font-bold transition-all shadow-lg hover:shadow-xl`}
                      style={{ minHeight: '56px' }}
                    >
                      <Plus size={24} strokeWidth={2.5} />
                      Add Medication
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs p-3">
                    <p className="font-bold mb-1">Quick Add Medication</p>
                    <p className="text-sm">Add a new medication, supplement, or prescription to your tracking list</p>
                    <p className="text-sm mt-2 text-blue-400">💡 Takes only 2-3 minutes to add</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        ) : (
          // Simple list for Caregiver/Doctor roles (no grouping needed - only 3-4 items)
          <div className="space-y-1">
            <TooltipProvider delayDuration={300}>
              {navSections.main?.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.page;
                const tooltipData = getTooltipDescription(item.id);

                return (
                  <Tooltip key={item.id}>
                    <TooltipTrigger asChild>
                      <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentPage(item.page)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive
                            ? colorClasses.active + ' shadow-md'
                            : `${darkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'} ${colorClasses.bgHover}`
                        }`}
                        style={{ minHeight: '48px' }}
                      >
                        <Icon size={24} strokeWidth={2.5} className="flex-shrink-0" />
                        <span className="text-base font-semibold leading-tight flex-1 text-left">{item.label}</span>
                        {isActive && <ChevronRight size={18} strokeWidth={3} className="flex-shrink-0" />}
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs p-3">
                      <p className="font-bold mb-1">{tooltipData.title}</p>
                      <p className="text-sm">{tooltipData.description}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        )}
      </nav>

      {/* User Info & Logout - COMPACT */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
        <button
          onClick={() => setCurrentPage('profile')}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${ 
            currentPage === 'profile'
              ? colorClasses.bgLight + ' ' + colorClasses.text
              : `${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`
          }`}
          style={{ minHeight: '56px' }}
        >
          {/* User Avatar */}
          <Avatar className="w-10 h-10 shadow-md flex-shrink-0">
            {currentUser?.photoUrl && (
              <AvatarImage 
                src={currentUser.photoUrl} 
                alt={currentUser?.name || 'User'} 
              />
            )}
            <AvatarFallback className={`text-white text-base ${
              userRole === 'caregiver' ? 'bg-orange-500' : 
              userRole === 'doctor' ? 'bg-purple-600' : 
              'bg-blue-600'
            }`}>
              {currentUser?.name ? 
                currentUser.name.split(' ').length >= 2
                  ? `${currentUser.name.split(' ')[0][0]}${currentUser.name.split(' ')[1][0]}`.toUpperCase()
                  : currentUser.name.substring(0, 2).toUpperCase()
                : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <p className={`text-sm font-bold leading-tight mb-0.5 truncate ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {currentUser?.name || 'My Profile'}
            </p>
            <p className={`text-xs leading-tight capitalize ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {userRole === 'myself' ? 'Patient' : userRole}
            </p>
          </div>
        </button>

        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${ 
            darkMode 
              ? 'text-red-400 hover:bg-red-950/20 hover:text-red-300' 
              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
          }`}
          style={{ minHeight: '48px' }}
        >
          <LogOut size={24} strokeWidth={2.5} />
          <span className="text-base font-bold leading-tight">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}