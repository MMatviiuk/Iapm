import { useState } from 'react';
import SidebarNormal from './SidebarNormal';
import TopBarNormal from './TopBarNormal';
import BurgerMenu from './BurgerMenu';

interface AppLayoutNormalProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  currentUser: any;
  children: React.ReactNode;
}

export default function AppLayoutNormal({
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  setDarkMode,
  onRoleChange,
  onLogout,
  currentUser,
  children
}: AppLayoutNormalProps) {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getPageTitle = () => {
    const titles: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'schedule': 'Today\'s Schedule',
      'week-view': 'Week View',
      'history': 'History',
      'medications': 'All Medications',
      'notifications': 'Notifications',
      'rewards': 'Achievements',
      'settings': 'Settings',
      'caregiver': 'Dependents',
      'caregiver-analytics': 'Analytics',
      'doctor': 'Patients',
      'doctor-analytics': 'Analytics',
      'medication-database': 'Medication Database',
      'add': 'Add Medication',
      'edit': 'Edit Medication'
    };
    return titles[currentPage] || 'Prescription Clarity';
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleNotificationsClick = () => {
    setCurrentPage('notifications');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
        {/* Normal Sidebar - Desktop only (lg+), 280px width */}
        <div className="hidden lg:block">
          <SidebarNormal
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            userRole={userRole}
            darkMode={darkMode}
            onLogout={onLogout}
          />
        </div>

        {/* Normal TopBar - Always visible */}
        <TopBarNormal
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
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(false)}
            currentPage={currentPage}
            setCurrentPage={(page) => {
              setCurrentPage(page);
              setIsMobileMenuOpen(false);
            }}
            userRole={userRole}
            darkMode={darkMode}
            onRoleChange={(role) => {
              onRoleChange(role);
              setIsMobileMenuOpen(false);
            }}
            onLogout={() => {
              onLogout();
              setIsMobileMenuOpen(false);
            }}
            userName={currentUser?.name}
            userEmail={currentUser?.email}
            userGender={currentUser?.gender}
            userPhotoUrl={currentUser?.photoUrl}
          />
        )}

        {/* Main Content - with proper spacing for sidebar + topbar */}
        <main className="lg:ml-[280px] pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}