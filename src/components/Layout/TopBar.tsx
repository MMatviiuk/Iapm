import { Menu, Bell, User } from 'lucide-react';
import { PillShieldLogo, PillShieldLogoFilled } from '../PillShieldLogo';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { getAvatarUrl as getAvatarUrlUtil } from '../../utils/avatarUtils';

interface TopBarProps {
  currentPage: string;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onMenuToggle: () => void;
  currentUser?: any;
  onProfileClick?: () => void;
}

export default function TopBar({ 
  currentPage, 
  userRole, 
  darkMode, 
  onMenuToggle,
  currentUser,
  onProfileClick
}: TopBarProps) {
  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'main': 'Today',
      'today': 'Today',
      'history': 'History',
      'medications': 'Medications',
      'medications-list': 'All Medications',
      'medication-details': 'Medication Details',
      'week-view': 'Week View',
      'notifications': 'Notifications',
      'rewards': 'Achievements',
      'settings': 'Settings',
      'caregiver': 'Dependents',
      'caregiver-analytics': 'Analytics',
      'dependent-details': 'Dependent Details',
      'doctor': 'Patients',
      'doctor-analytics': 'Analytics',
      'patient-details': 'Patient Details',
      'medication-reference': 'Medication Database',
      'add': 'Add Medication',
      'edit': 'Edit Medication',
      'profile': 'Profile',
      'print': 'Print Schedule',
    };
    return titles[currentPage] || 'Prescription Clarity';
  };

  const getRoleColorClasses = () => {
    // Unified blue color scheme
    return 'bg-blue-600';
  };

  const getRoleBorderClasses = () => {
    switch (userRole) {
      case 'caregiver':
        return 'ring-orange-500';
      case 'doctor':
        return 'ring-purple-600';
      default:
        return 'ring-blue-600';
    }
  };

  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return currentUser.name.substring(0, 2).toUpperCase();
  };

  const getAvatarUrl = () => {
    if (!currentUser) return null;
    
    return getAvatarUrlUtil({
      name: currentUser.name || 'User',
      gender: currentUser.gender?.toLowerCase() as 'male' | 'female',
      customPhotoUrl: currentUser.photoUrl
    });
  };

  return (
    <header className={`sticky top-0 z-30 border-b backdrop-blur-md shadow-sm ${
      darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
    }`}>
      <div className="flex items-center justify-between px-3 sm:px-4 lg:px-5 py-3 sm:py-4" style={{ minHeight: '64px' }}>
        {/* Left: Menu button, Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-1 min-w-0">
          <button
            onClick={onMenuToggle}
            className={`p-2 sm:p-3 rounded-xl transition-all shadow-sm touch-manipulation ${
              darkMode 
                ? 'hover:bg-slate-800 active:bg-slate-700 bg-slate-800/50' 
                : 'hover:bg-slate-100 active:bg-slate-200 bg-slate-50'
            }`}
            style={{ minWidth: '52px', minHeight: '52px' }}
            aria-label="Menu"
          >
            <Menu className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <PillShieldLogoFilled 
              size={48}
              role={userRole === 'myself' ? 'patient' : userRole}
              className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
            />
            <h1 className={`text-lg sm:text-xl lg:text-3xl font-extrabold leading-tight truncate ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            className={`p-2 sm:p-3 rounded-xl transition-all relative shadow-sm touch-manipulation ${
              darkMode 
                ? 'hover:bg-slate-800 active:bg-slate-700 bg-slate-800/50' 
                : 'hover:bg-slate-100 active:bg-slate-200 bg-slate-50'
            }`}
            style={{ minWidth: '52px', minHeight: '52px' }}
            aria-label="Notifications"
          >
            <Bell className={`w-6 h-6 sm:w-7 sm:h-7 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} strokeWidth={2.5} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 shadow-md"></span>
          </button>

          {/* User Avatar + Name */}
          <button
            onClick={onProfileClick}
            className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 pr-3 sm:pr-4 rounded-full transition-all touch-manipulation ring-2 ring-offset-2 ${
              darkMode 
                ? 'ring-offset-slate-900 hover:bg-slate-800/50 active:bg-slate-700/50' 
                : 'ring-offset-white hover:bg-slate-100/50 active:bg-slate-200/50'
            } ${getRoleBorderClasses()} hover:ring-4 active:ring-4 shadow-md`}
            style={{ minHeight: '52px' }}
            aria-label="Profile"
          >
            <Avatar className="w-12 h-12 sm:w-14 sm:h-14 shadow-lg flex-shrink-0">
              {getAvatarUrl() && (
                <AvatarImage 
                  src={getAvatarUrl()!} 
                  alt={currentUser?.name || 'User'}
                />
              )}
              <AvatarFallback className={`text-white ${getRoleColorClasses()}`}>
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            {/* Name - always show on mobile for caregiver/doctor */}
            <span className={`${
              userRole === 'myself' ? 'hidden sm:block' : 'block'
            } text-sm lg:text-base font-medium truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[160px] ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              {currentUser?.name || 'User'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}