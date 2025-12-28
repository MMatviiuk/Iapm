import { Search, Bell, Settings, User, Moon, Sun, Menu } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../ui/dropdown-menu';
import { getAvatarUrl } from '../../utils/avatarUtils';

interface TopBarNormalProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  currentUser: any;
  userRole: 'myself' | 'caregiver' | 'doctor';
  onMenuToggle?: () => void;
  onProfileClick?: () => void;
  onNotificationsClick?: () => void;
  currentPageTitle: string;
}

export default function TopBarNormal({
  darkMode,
  setDarkMode,
  currentUser,
  userRole,
  onMenuToggle,
  onProfileClick,
  onNotificationsClick,
  currentPageTitle
}: TopBarNormalProps) {

  const userName = currentUser?.name || 'User';
  const userPhoto = currentUser?.photoUrl || getAvatarUrl({ 
    name: userName, 
    gender: currentUser?.gender 
  });

  const getRoleLabel = () => {
    if (userRole === 'caregiver') return 'Caregiver';
    if (userRole === 'doctor') return 'Doctor';
    return 'Patient';
  };

  const getRoleBadgeColor = () => {
    if (userRole === 'caregiver') {
      return darkMode ? 'bg-orange-500/10 text-orange-400' : 'bg-orange-50 text-orange-600';
    } else if (userRole === 'doctor') {
      return darkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600';
    } else {
      return darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600';
    }
  };

  return (
    <header className={`h-16 border-b flex items-center justify-between px-6 ${
      darkMode 
        ? 'bg-slate-900/95 border-slate-800 backdrop-blur-sm' 
        : 'bg-white/95 border-slate-200 backdrop-blur-sm'
    } fixed top-0 right-0 left-0 lg:left-[280px] z-30`}>
      
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-4">
        {/* Mobile hamburger menu */}
        <button
          onClick={onMenuToggle}
          className={`lg:hidden p-2 rounded-lg ${
            darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
          }`}
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title */}
        <div>
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {currentPageTitle}
          </h2>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search (desktop only) */}
        <button className={`hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border ${
          darkMode 
            ? 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800' 
            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
        }`}>
          <Search className="w-4 h-4" />
          <span className="text-sm">Search...</span>
          <kbd className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
            darkMode ? 'bg-slate-700' : 'bg-white'
          }`}>
            ⌘K
          </kbd>
        </button>

        {/* Dark mode toggle */}
        <Button
          onClick={() => setDarkMode(!darkMode)}
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </Button>

        {/* Notifications */}
        <Button
          onClick={onNotificationsClick}
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
              darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
            }`}>
              <Avatar className="w-8 h-8">
                <AvatarImage src={userPhoto} alt={userName} />
                <AvatarFallback className="bg-blue-500 text-white text-sm">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {userName}
                </p>
                <p className={`text-xs ${getRoleBadgeColor()}`}>
                  {getRoleLabel()}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            {/* Profile - only for Patient role */}
            {userRole === 'myself' && (
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => {}}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}