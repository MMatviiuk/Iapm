import { 
  LayoutDashboard, 
  Calendar,
  CalendarDays,
  Clock, 
  Award, 
  Settings, 
  Users, 
  Stethoscope,
  LogOut,
  Pill,
  BarChart3,
  Bell,
  Home
} from 'lucide-react';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface SidebarCompactProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onLogout: () => void;
}

export default function SidebarCompact({
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onLogout,
}: SidebarCompactProps) {
  
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
          hover: 'hover:bg-orange-50 dark:hover:bg-orange-950/20',
          active: 'bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
        };
      case 'doctor':
        return {
          bg: 'bg-purple-600',
          hover: 'hover:bg-purple-50 dark:hover:bg-purple-950/20',
          active: 'bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
        };
      default:
        return {
          bg: 'bg-blue-600',
          hover: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
          active: 'bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
        };
    }
  };

  const colors = getRoleColorClasses();

  // Navigation items based on role
  const getNavItems = () => {
    if (userRole === 'myself') {
      return [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
        { id: 'schedule', icon: Calendar, label: 'Today', page: 'schedule' },
        { id: 'week', icon: CalendarDays, label: 'Week', page: 'week-view' },
        { id: 'history', icon: Clock, label: 'History', page: 'history' },
        { id: 'medications', icon: Pill, label: 'All Medications', page: 'medications' },
        { id: 'notifications', icon: Bell, label: 'Notifications', page: 'notifications' },
        { id: 'rewards', icon: Award, label: 'Achievements', page: 'rewards' },
        { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' },
      ];
    } else if (userRole === 'caregiver') {
      return [
        { id: 'caregiver-dashboard', icon: Users, label: 'Dependents', page: 'caregiver' },
        { id: 'caregiver-analytics', icon: BarChart3, label: 'Analytics', page: 'caregiver-analytics' },
        { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' },
      ];
    } else {
      return [
        { id: 'doctor-dashboard', icon: Stethoscope, label: 'Patients', page: 'doctor' },
        { id: 'doctor-analytics', icon: BarChart3, label: 'Analytics', page: 'doctor-analytics' },
        { id: 'medication-database', icon: Pill, label: 'Database', page: 'medication-database' },
        { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <TooltipProvider delayDuration={100}>
      <motion.aside
        initial={{ x: -64 }}
        animate={{ x: 0 }}
        className={`hidden lg:flex flex-col w-16 border-r backdrop-blur-sm ${
          darkMode 
            ? 'bg-slate-900/95 border-slate-800' 
            : 'bg-white/95 border-slate-200'
        } fixed left-0 top-0 h-screen z-40`}
      >
        {/* Logo at top */}
        <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-800 mb-2">
          <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center`}>
            <Pill className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCurrentPage(item.page)}
                    className={`w-full h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
                      isActive
                        ? colors.active
                        : `${colors.hover} ${darkMode ? 'text-slate-400' : 'text-slate-600'}`
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2">
                  <p className="font-medium">{item.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        {/* Logout at bottom */}
        <div className="p-2 border-t border-slate-200 dark:border-slate-800">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onLogout}
                className={`w-full h-12 flex items-center justify-center rounded-lg transition-all ${
                  darkMode
                    ? 'hover:bg-red-950/20 text-slate-400 hover:text-red-400'
                    : 'hover:bg-red-50 text-slate-600 hover:text-red-600'
                }`}
              >
                <LogOut className="w-5 h-5" strokeWidth={2} />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2">
              <p className="font-medium">Sign Out</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}