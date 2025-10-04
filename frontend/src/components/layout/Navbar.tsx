import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, MessageCircle, Calendar, MapPin } from '../ui/Icons';

interface NavbarProps {
  onMenuClick: () => void;
  userRole?: 'women' | 'family' | 'doctor' | 'asha';
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, userRole = 'women' }) => {
  const { t, i18n } = useTranslation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [notifications] = useState(3);

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
      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary-maroon to-primary-pink shadow-lg safe-top">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-white" />
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Globe className="h-5 w-5 text-white" />
              <span className="text-white font-medium text-sm">{currentLang.native}</span>
            </button>

            {/* Language Dropdown */}
            {showLangMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white rounded-xl shadow-lg overflow-hidden min-w-[150px] animate-fadeIn">
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
          <button className="relative p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Bell className="h-6 w-6 text-white" />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary-400 text-neutral-charcoal text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {notifications}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Navbar */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <Menu className="h-6 w-6 text-neutral-charcoal" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-pink to-primary-maroon rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">W</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">Women SelfCare</h1>
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
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageCircle className="h-5 w-5 text-primary-maroon" />
                  <span className="text-sm font-medium text-neutral-charcoal">{t('nav.chatbot')}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="h-5 w-5 text-primary-maroon" />
                  <span className="text-sm font-medium text-neutral-charcoal">{t('nav.mealPlanner')}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <MapPin className="h-5 w-5 text-primary-maroon" />
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
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-neutral-charcoal" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
