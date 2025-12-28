import { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BurgerMenu from './BurgerMenu';
import TabletDrawer from './TabletDrawer';

interface AppLayoutProps {
  children: ReactNode;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  userRole: 'myself' | 'caregiver' | 'doctor';
  darkMode: boolean;
  onRoleChange: (role: 'myself' | 'caregiver' | 'doctor') => void;
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
  currentUser?: any;
}

export default function AppLayout({
  children,
  currentPage,
  setCurrentPage,
  userRole,
  darkMode,
  onRoleChange,
  onLogout,
  userName,
  userEmail,
  currentUser,
}: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabletDrawerOpen, setIsTabletDrawerOpen] = useState(false);

  const handleProfileClick = () => {
    setCurrentPage('profile');
    setIsMobileMenuOpen(false);
    setIsTabletDrawerOpen(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
        {/* Sidebar - Desktop only (lg+) */}
        <div className="hidden lg:block">
          <Sidebar
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            userRole={userRole}
            darkMode={darkMode}
            onRoleChange={onRoleChange}
            onLogout={onLogout}
            currentUser={currentUser}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar - Mobile & Tablet (<lg) */}
          <div className="lg:hidden">
            <TopBar
              currentPage={currentPage}
              userRole={userRole}
              darkMode={darkMode}
              onMenuToggle={() => {
                // Mobile (<sm): BurgerMenu
                // Tablet (sm-lg): TabletDrawer
                if (window.innerWidth < 640) {
                  setIsMobileMenuOpen(!isMobileMenuOpen);
                } else {
                  setIsTabletDrawerOpen(!isTabletDrawerOpen);
                }
              }}
              currentUser={currentUser}
              onProfileClick={handleProfileClick}
            />
          </div>

          {/* Mobile BurgerMenu - Extra small & small screens only (<640px) */}
          <div className="sm:hidden">
            <BurgerMenu
              isOpen={isMobileMenuOpen}
              onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              userRole={userRole}
              darkMode={darkMode}
              onRoleChange={onRoleChange}
              onLogout={onLogout}
              userName={userName}
              userEmail={userEmail}
              userPhotoUrl={currentUser?.photoUrl}
            />
          </div>

          {/* Tablet Drawer - Tablet only (640px-1023px) */}
          <div className="hidden sm:block lg:hidden">
            <TabletDrawer
              isOpen={isTabletDrawerOpen}
              onOpenChange={setIsTabletDrawerOpen}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              userRole={userRole}
              darkMode={darkMode}
              onRoleChange={onRoleChange}
              onLogout={onLogout}
              currentUser={currentUser}
            />
          </div>

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
