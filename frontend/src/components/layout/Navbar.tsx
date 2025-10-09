import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Menu, Globe, MessageCircle, Calendar, MapPin, LogOut } from '../ui/Icons';
import NotificationPanel from '../notifications/NotificationPanel';

interface NavbarProps {
  onMenuClick: () => void;
  userRole?: 'women' | 'family' | 'doctor' | 'asha';
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, userRole = 'women', onLogout }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  ];

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setShowLangMenu(false);
  };

  const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <>
      {/* Mobile Navbar */}
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg safe-top">
        <div className="flex items-center justify-between px-4 py-3 gap-2">
          {/* Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-gray-700" />
          </button>

          {/* Language Selector - Center */}
          <div className="relative flex-1 flex justify-center">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <Globe className="h-5 w-5 text-gray-700" />
              <span className="text-gray-700 font-medium text-sm">{currentLang.native}</span>
            </button>

            {/* Language Dropdown */}
            {showLangMenu && (
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg overflow-hidden min-w-[150px] animate-fadeIn z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full px-4 py-3 text-left hover:bg-primary-pink/10 transition-colors ${
                      lang.code === i18n.language ? 'bg-primary-pink/20 text-primary-maroon font-semibold' : 'text-neutral-charcoal'
                    }`}
                  >
                    <div className="font-medium">{lang.native}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right side group - Notifications & Logout */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Notifications */}
            <NotificationPanel isMobile={true} />

            {/* Logout Button - Mobile */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="h-6 w-6 text-gray-700" />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                title='Open menu'
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="h-6 w-6 text-neutral-charcoal" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#c54b4a]">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#c54b4a]">Women SelfCare</h1>
                  <p className="text-xs text-gray-500">
                    {userRole === 'women' && 'Your Health Companion'}
                    {userRole === 'family' && 'Family Health Hub'}
                    {userRole === 'doctor' && 'Healthcare Portal'}
                    {userRole === 'asha' && 'Community Care'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="flex items-center gap-6">
              {/* Quick Actions for Desktop */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate('/chat')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors">
                  <MessageCircle className="h-5 w-5 text-[#c54b4a]" />
                  <span className="text-sm font-medium text-neutral-charcoal">{t('nav.chatbot')}</span>
                </button>
                <button 
                  onClick={() => navigate('/meal-planner')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors">
                  <Calendar className="h-5 w-5 text-amber-600" />
                  <span className="text-sm font-medium text-neutral-charcoal">{t('nav.mealPlanner')}</span>
                </button>
                <button 
                  onClick={() => navigate('/broadcast')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-neutral-charcoal">{t('nav.broadcast')}</span>
                </button>
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-primary-pink transition-colors"
                >
                  <Globe className="h-5 w-5 text-primary-maroon" />
                  <span className="text-sm font-medium text-neutral-charcoal">{currentLang.native}</span>
                </button>

                {showLangMenu && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg overflow-hidden min-w-[180px] animate-fadeIn">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`w-full px-4 py-3 text-left hover:bg-primary-pink/10 transition-colors ${
                          lang.code === i18n.language ? 'bg-primary-pink/20 text-primary-maroon font-semibold' : 'text-neutral-charcoal'
                        }`}
                      >
                        <div className="font-medium">{lang.native}</div>
                        <div className="text-xs text-gray-500">{lang.name}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <NotificationPanel isMobile={false} />

              {/* Logout Button - Desktop */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
