import { useState } from 'react';
import {
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
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../ui/collapsible';
import { ScrollArea } from '../ui/scroll-area';
import RoleSwitcherModal from '../RoleSwitcherModal';
import { PillShieldLogo } from '../PillShieldLogo';

interface TabletDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  currentUser?: any;
}

export default function TabletDrawer({
  isOpen,
  onOpenChange,
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onRoleChange,
  onLogout,
  currentUser,
}: TabletDrawerProps) {
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    tracking: false,
    personal: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    onOpenChange(false);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Unified blue color scheme for all roles
  const getRoleColorClasses = () => {
    return {
      bg: 'bg-blue-600',
      text: 'text-blue-600 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-800',
      active: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600',
    };
  };

  const roleColors = getRoleColorClasses();

  const getUserInitials = () => {
    if (!currentUser?.name) return 'U';
    const names = currentUser.name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return currentUser.name[0]?.toUpperCase() || 'U';
  };

  const getAvatarUrl = () => {
    return currentUser?.photoUrl || null;
  };

  const getRoleBadge = () => {
    switch (userRole) {
      case 'caregiver': return { label: 'Caregiver', color: 'bg-orange-500' };
      case 'doctor': return { label: 'Doctor', color: 'bg-purple-600' };
      default: return { label: 'Patient', color: 'bg-blue-600' };
    }
  };

  const roleBadge = getRoleBadge();

  // Navigation items for different roles
  const getNavigationItems = () => {
    if (userRole === 'myself') {
      return {
        overview: [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'today', icon: Calendar, label: 'Today' },
          { id: 'week-view', icon: CalendarDays, label: 'Week View' },
        ],
        tracking: [
          { id: 'history', icon: Clock, label: 'History' },
          { id: 'medications-list', icon: Pill, label: 'All Medications' },
          { id: 'notifications', icon: Bell, label: 'Notifications' },
        ],
        personal: [
          { id: 'achievements', icon: Award, label: 'Achievements' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ],
      };
    } else if (userRole === 'caregiver') {
      return {
        main: [
          { id: 'caregiver-dashboard', icon: Users, label: 'Dependents' },
          { id: 'caregiver-analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ],
      };
    } else {
      return {
        main: [
          { id: 'doctor-dashboard', icon: User, label: 'Patients' },
          { id: 'doctor-analytics', icon: BarChart3, label: 'Analytics' },
          { id: 'medication-database', icon: Pill, label: 'Medication Database' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ],
      };
    }
  };

  const navItems = getNavigationItems();

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent 
          side="left" 
          className={`w-[300px] sm:w-[350px] p-0 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}
          aria-describedby={undefined}
        >
          <SheetHeader className={`p-5 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4">
              <PillShieldLogo size={40} className={roleColors.text} />
              <div>
                <SheetTitle className={darkMode ? 'text-white' : 'text-gray-900'}>
                  Prescription Clarity
                </SheetTitle>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Medication Tracking
                </p>
              </div>
            </div>

            {/* User Profile */}
            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="relative">
                <Avatar className="w-12 h-12 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900" style={{ ringColor: roleColors.bg }}>
                  {getAvatarUrl() && (
                    <AvatarImage src={getAvatarUrl()!} alt={currentUser?.name || 'User'} />
                  )}
                  <AvatarFallback className={`text-white ${roleColors.bg}`}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <Badge className={`absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0 ${roleBadge.color} text-white border-0`}>
                  {roleBadge.label[0]}
                </Badge>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser?.name || 'User'}
                </p>
                <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentUser?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Switch Role Button */}
            <Button
              onClick={() => setShowRoleSwitcher(true)}
              variant="outline"
              size="sm"
              className={`w-full mt-3 h-11 ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Switch Role
            </Button>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="p-4 space-y-2">
              {/* Patient Role - Grouped Navigation */}
              {userRole === 'myself' && (
                <>
                  {/* Overview Section */}
                  <Collapsible open={openSections.overview} onOpenChange={() => toggleSection('overview')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <span className="text-sm font-semibold">Overview</span>
                      {openSections.overview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navItems.overview?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base touch-manipulation ${
                              isActive
                                ? roleColors.active
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Tracking Section */}
                  <Collapsible open={openSections.tracking} onOpenChange={() => toggleSection('tracking')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <span className="text-sm font-semibold">Tracking</span>
                      {openSections.tracking ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navItems.tracking?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base touch-manipulation ${
                              isActive
                                ? roleColors.active
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Personal Section */}
                  <Collapsible open={openSections.personal} onOpenChange={() => toggleSection('personal')}>
                    <CollapsibleTrigger className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}>
                      <span className="text-sm font-semibold">Personal</span>
                      {openSections.personal ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1">
                      {navItems.personal?.map((item) => {
                        const Icon = item.icon;
                        const isActive = currentPage === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleNavigation(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base touch-manipulation ${
                              isActive
                                ? roleColors.active
                                : darkMode
                                ? 'text-gray-300 hover:bg-gray-800'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}

              {/* Caregiver/Doctor Roles - Simple List */}
              {(userRole === 'caregiver' || userRole === 'doctor') && (
                <>
                  {navItems.main?.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigation(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-base touch-manipulation ${
                          isActive
                            ? roleColors.active
                            : darkMode
                            ? 'text-gray-300 hover:bg-gray-800'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={2} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          </ScrollArea>

          {/* Logout Button */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <Button
              onClick={onLogout}
              variant="outline"
              className={`w-full h-12 text-base ${darkMode ? 'border-gray-700 hover:bg-red-950/20 hover:border-red-900 hover:text-red-400' : 'border-gray-300 hover:bg-red-50 hover:border-red-500 hover:text-red-600'}`}
            >
              <LogOut className="w-5 h-5 mr-2" />
              Log Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Role Switcher Modal */}
      {showRoleSwitcher && (
        <RoleSwitcherModal
          currentRole={userRole}
          onRoleChange={(role) => {
            onRoleChange(role);
            setShowRoleSwitcher(false);
          }}
          onClose={() => setShowRoleSwitcher(false)}
          darkMode={darkMode}
        />
      )}
    </>
  );
}