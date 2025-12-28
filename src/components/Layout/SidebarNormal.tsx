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
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarNormalProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onLogout: () => void;
}

export default function SidebarNormal({
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onLogout
}: SidebarNormalProps) {

  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Role-specific colors
  const getRoleColors = () => {
    if (userRole === 'caregiver') {
      return {
        bg: darkMode ? 'bg-orange-500/10' : 'bg-orange-50',
        text: darkMode ? 'text-orange-400' : 'text-orange-600',
        border: darkMode ? 'border-orange-700' : 'border-orange-300',
        hover: darkMode ? 'hover:bg-orange-500/20' : 'hover:bg-orange-100'
      };
    } else if (userRole === 'doctor') {
      return {
        bg: darkMode ? 'bg-purple-500/10' : 'bg-purple-50',
        text: darkMode ? 'text-purple-400' : 'text-purple-600',
        border: darkMode ? 'border-purple-700' : 'border-purple-300',
        hover: darkMode ? 'hover:bg-purple-500/20' : 'hover:bg-purple-100'
      };
    } else {
      return {
        bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50',
        text: darkMode ? 'text-blue-400' : 'text-blue-600',
        border: darkMode ? 'border-blue-700' : 'border-blue-300',
        hover: darkMode ? 'hover:bg-blue-500/20' : 'hover:bg-blue-100'
      };
    }
  };

  const colors = getRoleColors();

  const getPatientNavItems = () => [
    {
      id: 'overview',
      label: 'Overview',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', page: 'dashboard' },
        { id: 'today', icon: Calendar, label: 'Today', page: 'schedule' },
        { id: 'week', icon: CalendarDays, label: 'Week View', page: 'week-view' }
      ]
    },
    {
      id: 'tracking',
      label: 'Tracking',
      items: [
        { id: 'history', icon: Clock, label: 'History', page: 'history' },
        { id: 'medications', icon: Pill, label: 'All Medications', page: 'medications' },
        { id: 'notifications', icon: Bell, label: 'Notifications', page: 'notifications' }
      ]
    },
    {
      id: 'personal',
      label: 'Personal',
      items: [
        { id: 'achievements', icon: Award, label: 'Achievements', page: 'rewards' },
        { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' }
      ]
    }
  ];

  const getCaregiverNavItems = () => [
    { id: 'dependents', icon: Users, label: 'Dependents', page: 'caregiver' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', page: 'caregiver-analytics' },
    { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' }
  ];

  const getDoctorNavItems = () => [
    { id: 'patients', icon: Stethoscope, label: 'Patients', page: 'doctor' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', page: 'doctor-analytics' },
    { id: 'database', icon: Pill, label: 'Medication Database', page: 'medication-database' },
    { id: 'settings', icon: Settings, label: 'Settings', page: 'settings' }
  ];

  const getNavItems = () => {
    if (userRole === 'myself') {
      return { sections: getPatientNavItems(), type: 'grouped' };
    } else if (userRole === 'caregiver') {
      return { items: getCaregiverNavItems(), type: 'simple' };
    } else {
      return { items: getDoctorNavItems(), type: 'simple' };
    }
  };

  const nav = getNavItems();

  const renderNavItem = (item: any, isActive: boolean) => {
    const Icon = item.icon;
    
    return (
      <button
        key={item.id}
        onClick={() => setCurrentPage(item.page)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
          isActive
            ? `${colors.bg} ${colors.text} font-medium`
            : darkMode
              ? 'text-slate-400 hover:text-white hover:bg-slate-800'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-sm">{item.label}</span>
      </button>
    );
  };

  const renderGroupedNav = () => {
    if (nav.type !== 'grouped') return null;

    return nav.sections.map((section: any) => {
      const isExpanded = expandedSections.includes(section.id);
      
      return (
        <div key={section.id} className="mb-2">
          <button
            onClick={() => toggleSection(section.id)}
            className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
              darkMode 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs font-semibold uppercase tracking-wider">
              {section.label}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-1 space-y-1"
              >
                {section.items.map((item: any) => 
                  renderNavItem(item, currentPage === item.page)
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  const renderSimpleNav = () => {
    if (nav.type !== 'simple') return null;

    return (
      <div className="space-y-1">
        {nav.items.map((item: any) => 
          renderNavItem(item, currentPage === item.page)
        )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`hidden lg:flex flex-col w-[280px] border-r ${
        darkMode 
          ? 'bg-slate-900 border-slate-800' 
          : 'bg-white border-slate-200'
      } fixed left-0 top-0 h-screen z-40`}
    >
      {/* Logo */}
      <div className={`p-6 border-b ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-blue-500/10' : 'bg-blue-50'
          }`}>
            <Pill className={`w-6 h-6 ${
              darkMode ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          <div>
            <h1 className={`font-bold text-lg ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}>
              Prescription
            </h1>
            <p className={`text-xs ${
              darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              Clarity
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {nav.type === 'grouped' ? renderGroupedNav() : renderSimpleNav()}
      </div>

      {/* Logout */}
      <div className={`p-4 border-t ${
        darkMode ? 'border-slate-800' : 'border-slate-200'
      }`}>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
            darkMode
              ? 'text-red-400 hover:bg-red-500/10'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </motion.aside>
  );
}
