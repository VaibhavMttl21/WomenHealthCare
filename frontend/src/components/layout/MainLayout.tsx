import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';
import { useAppSelector } from '../../hooks/useAppSelector';

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: 'women' | 'family' | 'doctor' | 'asha';
  onLogout?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userRole = 'women', onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const userName = user ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(true)} 
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="pt-14 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-0 min-h-screen overflow-x-hidden">
        {children}
      </main>

      {/* Bottom Navigation (Mobile only) */}
      <BottomNav userRole={userRole} />

      {/* Footer (Desktop only) */}
      <Footer />
    </div>
  );
};
