import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, Utensils, Radio } from '../ui/Icons';

interface BottomNavProps {
  userRole?: 'women' | 'family' | 'doctor' | 'asha';
}

export const BottomNav: React.FC<BottomNavProps> = ({ userRole = 'women' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: MessageCircle,
      label: t('bottomNav.chatbot'),
      path: '/chat',
      color: 'text-accent-green',
      bgColor: 'bg-accent-green'
    },
    {
      icon: Utensils,
      label: t('bottomNav.mealPlanner'),
      path: '/meal-planner',
      color: 'text-secondary-400',
      bgColor: 'bg-secondary-400'
    },
    {
      icon: Radio,
      label: t('bottomNav.broadcast'),
      path: '/broadcast',
      color: 'text-accent-skyblue',
      bgColor: 'bg-accent-skyblue'
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg safe-bottom">
      <div className="grid grid-cols-3 gap-1 px-2 py-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-b from-primary-pink/10 to-primary-maroon/5'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`p-2 rounded-full transition-all duration-200 ${
                isActive ? `${item.bgColor} shadow-md scale-110` : 'bg-gray-100'
              }`}>
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : item.color}`} />
              </div>
              <span className={`text-xs font-medium transition-colors ${
                isActive ? 'text-primary-maroon' : 'text-neutral-charcoal'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
