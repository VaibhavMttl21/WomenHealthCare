import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, User, Phone, LogOut, Settings, Shield } from '../ui/Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: 'women' | 'family' | 'doctor' | 'asha';
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  userName = 'User',
  userRole = 'women',
  onLogout
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      icon: User,
      label: t('menu.editProfile'),
      path: '/profile',
      color: 'text-primary-pink'
    },
    {
      icon: Phone,
      label: t('menu.emergencyContacts'),
      path: '/emergency',
      color: 'text-accent-orange'
    },
    {
      icon: Shield,
      label: t('menu.privacy'),
      path: '/privacy',
      color: 'text-accent-green'
    },
    {
      icon: Settings,
      label: t('menu.settings'),
      path: '/settings',
      color: 'text-neutral-charcoal'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback logout logic
      navigate('/login');
    }
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div 
          className="p-6"
          style={{
            background: 'linear-gradient(135deg, #be1a4f 0%, #dc1c5d 50%, #c54b4a 100%)'
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-xl">{t('menu.title')}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">{userName}</h3>
              <p className="text-white/80 text-sm capitalize">
                {userRole === 'women' && t('role.women')}
                {userRole === 'family' && t('role.family')}
                {userRole === 'doctor' && t('role.doctor')}
                {userRole === 'asha' && t('role.asha')}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={index}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-pink/10 text-primary-maroon font-semibold'
                        : 'hover:bg-gray-100 text-neutral-charcoal'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-primary-maroon' : item.color}`} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">{t('menu.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
