import { Bell, Menu, Moon, Sun, ChevronRight } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { getAvatarUrl as getAvatarUrlUtil } from '../../utils/avatarUtils';

interface TopBarMinimalProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentUser?: any;
  userRole: 'myself' | 'caregiver' | 'doctor';
  onMenuToggle: () => void;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  currentPageTitle?: string;
  breadcrumbs?: string[];
}

export default function TopBarMinimal({
  darkMode,
  setDarkMode,
  currentUser,
  userRole,
  onMenuToggle,
  onProfileClick,
  onNotificationsClick,
  currentPageTitle = 'Dashboard',
  breadcrumbs = []
}: TopBarMinimalProps) {

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'caregiver':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400';
      case 'doctor':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400';
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case 'caregiver': return 'Caregiver';
      case 'doctor': return 'Healthcare Professional';
      default: return 'Patient';
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
    <header className={`sticky top-0 z-30 border-b backdrop-blur-md h-14 ${
      darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'
    }`}>
      <div className="flex items-center justify-between h-full px-4">
        
        {/* Left: Mobile menu + Breadcrumbs */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className={`lg:hidden p-2 rounded-lg transition-all ${
              darkMode 
                ? 'hover:bg-slate-800 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 min-w-0">
            {breadcrumbs.length > 0 ? (
              <>
                {breadcrumbs.map((crumb, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className={`text-sm ${
                      darkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {crumb}
                    </span>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className={`w-4 h-4 ${
                        darkMode ? 'text-slate-600' : 'text-slate-400'
                      }`} />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <h1 className={`text-base font-semibold truncate ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {currentPageTitle}
              </h1>
            )}
          </div>
        </div>

        {/* Right: Actions + User */}
        <div className="flex items-center gap-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-all ${
              darkMode 
                ? 'hover:bg-slate-800 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button
            onClick={onNotificationsClick}
            className={`relative p-2 rounded-lg transition-all ${
              darkMode 
                ? 'hover:bg-slate-800 text-slate-400' 
                : 'hover:bg-slate-100 text-slate-600'
            }`}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User avatar + info */}
          <button
            onClick={onProfileClick}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all ${
              darkMode 
                ? 'hover:bg-slate-800' 
                : 'hover:bg-slate-100'
            }`}
          >
            <Avatar className="w-8 h-8">
              {getAvatarUrl() && (
                <AvatarImage 
                  src={getAvatarUrl()!} 
                  alt={currentUser?.name || 'User'}
                />
              )}
              <AvatarFallback className={`text-white text-xs ${
                userRole === 'caregiver' ? 'bg-orange-500' :
                userRole === 'doctor' ? 'bg-purple-600' :
                'bg-blue-600'
              }`}>
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex flex-col items-start">
              <span className={`text-sm font-medium leading-tight ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>
                {currentUser?.name || 'User'}
              </span>
              <Badge variant="secondary" className={`text-xs px-1.5 py-0 h-4 ${getRoleBadgeColor()}`}>
                {getRoleLabel()}
              </Badge>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
