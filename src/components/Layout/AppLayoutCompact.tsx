import { ReactNode, useState } from 'react';
import SidebarCompact from './SidebarCompact';
import TopBarMinimal from './TopBarMinimal';
import BurgerMenu from './BurgerMenu';

interface AppLayoutCompactProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  currentUser?: any;
}

export default function AppLayoutCompact({
  children,
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  setDarkMode,
  onRoleChange,
  onLogout,
  currentUser,
}: AppLayoutCompactProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleProfileClick = () => {
    setCurrentPage('profile');
    setIsMobileMenuOpen(false);
  };

  const handleNotificationsClick = () => {
    setCurrentPage('notifications');
  };

  // Get page title for breadcrumbs
  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      dashboard: 'Dashboard',
      schedule: 'Today',
      week: 'Week View',
      history: 'History',
      medications: 'All Medications',
      notifications: 'Notifications',
      rewards: 'Achievements',
      settings: 'Settings',
      add: 'Add Medication',
      edit: 'Edit Medication',
      'caregiver': 'Dependents',
      'caregiver-analytics': 'Analytics',
      'doctor': 'Patients',
      'doctor-analytics': 'Analytics',
      'medication-database': 'Medication Database',
    };
    return titles[currentPage] || 'Dashboard';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Compact Sidebar - Desktop only (lg+), 64px width */}
        <div className="hidden lg:block">
          <SidebarCompact
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            userRole={userRole}
            darkMode={darkMode}
            onLogout={onLogout}
          />
        </div>

        {/* Minimal TopBar - Always visible */}
        <TopBarMinimal
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          currentUser={currentUser}
          userRole={userRole}
          onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          onProfileClick={handleProfileClick}
          onNotificationsClick={handleNotificationsClick}
          currentPageTitle={getPageTitle()}
        />

        {/* Mobile Burger Menu */}
        {isMobileMenuOpen && (
          <BurgerMenu
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setIsMobileMenuOpen(false);
            }}
            userRole={userRole}
            darkMode={darkMode}
            onClose={() => setIsMobileMenuOpen(false)}
            onRoleChange={(role) => {
              onRoleChange(role);
              setIsMobileMenuOpen(false);
            }}
            onLogout={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            currentUser={currentUser}
          />
        )}

        {/* Main Content - with proper spacing for compact sidebar */}
        <main className={`lg:ml-16 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
