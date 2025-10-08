import React from 'react';
import { Video, BookOpen } from '../ui/Icons';

interface HealthContent {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  type: 'video' | 'audio' | 'article';
  bgGradient: string;
  icon: React.ReactNode;
}

const healthContentData: HealthContent[] = [
  {
    id: '1',
    title: 'Prenatal Yoga',
    description: 'Gentle exercises for a healthy pregnancy journey',
    instructor: 'Dr. Meera Patel',
    duration: '15 min',
    type: 'video',
    bgGradient: 'from-pink-200 to-orange-200',
    icon: <Video className="h-8 w-8 text-pink-500 ml-1" />
  },
  {
    id: '2',
    title: 'Nutrition Tips',
    description: 'Expert advice in your local language',
    instructor: 'ASHA Worker',
    duration: 'Audio',
    type: 'audio',
    bgGradient: 'from-green-200 to-teal-200',
    icon: <span className="text-3xl text-green-500">🎵</span>
  },
  {
    id: '3',
    title: 'Baby Care Guide',
    description: 'Essential tips for new mothers',
    instructor: '5 min read',
    duration: 'Read',
    type: 'article',
    bgGradient: 'from-purple-200 to-pink-200',
    icon: <BookOpen className="h-8 w-8 text-purple-500" />
  }
];

export const HealthBytesSection: React.FC = () => {
  const handleContentClick = (contentId: string) => {
    console.log('Opening content:', contentId);
    // Handle content opening logic here
  };

  return (
    <div className="w-full overflow-hidden">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 text-center mb-4 sm:mb-6 md:mb-8 px-2">
        <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">Health Bytes</span> for You
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
        {healthContentData.map((content) => (
          <div 
            key={content.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-white/50 group hover:shadow-2xl transition-all duration-500 cursor-pointer w-full"
            onClick={() => handleContentClick(content.id)}
          >
            <div className={`aspect-video bg-gradient-to-br ${content.bgGradient} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all duration-300">
                  {React.cloneElement(content.icon as React.ReactElement, {
                    className: content.type === 'audio' ? 'text-2xl sm:text-3xl text-green-500' : 'h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8'
                  })}
                </button>
              </div>
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 bg-black/20 backdrop-blur-sm text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1 rounded-full">
                {content.duration}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-pink-400/20 to-transparent opacity-60"></div>
            </div>
            <div className="p-3 sm:p-4 md:p-6">
              <h3 className="text-lg sm:text-xl font-medium text-gray-800 mb-1 sm:mb-2 leading-tight">{content.title}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base leading-relaxed">{content.description}</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  content.type === 'video' ? 'bg-gradient-to-br from-blue-400 to-cyan-400' :
                  content.type === 'audio' ? 'bg-gradient-to-br from-green-400 to-teal-400' :
                  'bg-gradient-to-br from-purple-400 to-pink-400'
                }`}>
                  <span className="text-white text-xs">
                    {content.type === 'video' ? '👩‍⚕️' : 
                     content.type === 'audio' ? '🏥' : '📚'}
                  </span>
                </div>
                <span className="text-gray-500 text-xs sm:text-sm truncate">{content.instructor}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};