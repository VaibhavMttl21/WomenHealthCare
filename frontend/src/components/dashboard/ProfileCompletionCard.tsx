import React from 'react';
import { Button } from '../ui/Button';
import { ChevronRight } from '../ui/Icons';

interface ProfileCompletionCardProps {
  completionPercentage: number;
  onCompleteProfile: () => void;
}

interface MissingField {
  id: string;
  label: string;
  color: 'orange' | 'pink' | 'purple';
}

const missingFields: MissingField[] = [
  { id: '1', label: 'Medical History', color: 'orange' },
  { id: '2', label: 'Emergency Contact', color: 'pink' },
  { id: '3', label: 'Preferences', color: 'purple' }
];

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  completionPercentage,
  onCompleteProfile
}) => {
  if (completionPercentage >= 100) {
    return null; // Don't show if profile is complete
  }

  const getColorClasses = (color: 'orange' | 'pink' | 'purple') => {
    const colorMap = {
      orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-700',
        dot: 'bg-orange-400'
      },
      pink: {
        bg: 'bg-pink-100',
        text: 'text-pink-700',
        dot: 'bg-pink-400'
      },
      purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-700',
        dot: 'bg-purple-400'
      }
    };
    return colorMap[color];
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full">
      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8">
        
        {/* Circular Progress */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0">
          <svg className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="text-pink-400"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${completionPercentage}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800">{completionPercentage}%</div>
              <div className="text-xs text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left w-full min-w-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 mb-3 sm:mb-4 px-2">
            Complete Your <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent font-medium">Profile</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 font-light px-2">
            Help us personalize your care experience with a few more details
          </p>
          
          {/* Missing Fields */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center lg:justify-start px-2">
            {missingFields.map((field) => {
              const colors = getColorClasses(field.color);
              return (
                <span 
                  key={field.id}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 ${colors.bg} rounded-full text-xs sm:text-sm ${colors.text}`}
                >
                  <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 ${colors.dot} rounded-full`}></div>
                  {field.label}
                </span>
              );
            })}
          </div>
          
          <div className="px-2">
            <Button 
              onClick={onCompleteProfile}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-400 to-orange-400 hover:from-pink-500 hover:to-orange-500 text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              Complete Profile
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        {/* Visual Element */}
        <div className="hidden lg:flex w-20 h-20 xl:w-24 xl:h-24 bg-gradient-to-br from-pink-200 to-orange-200 rounded-full items-center justify-center flex-shrink-0">
          <span className="text-3xl xl:text-4xl opacity-80">👤</span>
        </div>
      </div>
    </div>
  );
};