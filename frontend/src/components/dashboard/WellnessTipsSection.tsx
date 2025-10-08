import React from 'react';
import { CheckCircle, Heart } from '../ui/Icons';

interface WellnessTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  isCompleted: boolean;
  streak?: number;
  bgGradient: string;
}

const wellnessTipsData: WellnessTip[] = [
  { 
    id: '1',
    title: 'Iron-rich Diet', 
    description: 'Include green leafy vegetables daily', 
    icon: '🥬',
    isCompleted: true,
    streak: 3,
    bgGradient: 'from-green-200 to-teal-200'
  },
  { 
    id: '2',
    title: 'Stay Hydrated', 
    description: 'Drink 8-10 glasses of water', 
    icon: '💧',
    isCompleted: true,
    streak: 5,
    bgGradient: 'from-blue-200 to-cyan-200'
  },
  { 
    id: '3',
    title: 'Regular Exercise', 
    description: '30 minutes of walking daily', 
    icon: '🚶‍♀️',
    isCompleted: false,
    bgGradient: 'from-purple-200 to-pink-200'
  },
  { 
    id: '4',
    title: 'Mental Wellness', 
    description: 'Practice meditation and yoga', 
    icon: '🧘‍♀️',
    isCompleted: false,
    bgGradient: 'from-orange-200 to-yellow-200'
  }
];

export const WellnessTipsSection: React.FC = () => {
  const completedCount = wellnessTipsData.filter(tip => tip.isCompleted).length;
  const totalCount = wellnessTipsData.length;

  const handleMarkComplete = (tipId: string) => {
    console.log('Marking tip as complete:', tipId);
    // Handle tip completion logic here
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-light text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Heart className="h-6 w-6 text-white" />
          </div>
          Today's <span className="bg-gradient-to-r from-teal-500 to-green-500 bg-clip-text text-transparent">Wellness</span> Tips
        </h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full">
          <span className="text-teal-700 font-semibold text-sm">
            {completedCount} of {totalCount} completed
          </span>
          <div className="w-8 h-2 bg-teal-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / totalCount) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 font-light text-lg text-center mb-12">Small steps for a healthier you</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wellnessTipsData.map((tip) => (
          <div 
            key={tip.id}
            className={`bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 group hover:shadow-2xl transition-all duration-500 cursor-pointer ${
              tip.isCompleted ? 'ring-2 ring-green-300' : ''
            }`}
          >
            
            {/* Image Section */}
            <div className={`h-32 bg-gradient-to-br ${tip.bgGradient} relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center">
                  <span className="text-3xl">{tip.icon}</span>
                </div>
              </div>
              {tip.isCompleted && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6">
              <h4 className="font-medium text-gray-800 text-lg mb-2">{tip.title}</h4>
              <p className="text-gray-600 text-sm mb-4 font-light">{tip.description}</p>
              
              <button 
                className={`w-full py-3 px-4 rounded-2xl font-medium transition-all duration-300 group-hover:scale-105 ${
                  tip.isCompleted 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gradient-to-r from-teal-400 to-green-400 hover:from-teal-500 hover:to-green-500 text-white shadow-lg'
                }`}
                onClick={() => handleMarkComplete(tip.id)}
              >
                {tip.isCompleted ? '✓ Completed Today!' : 'Mark Complete'}
              </button>
              
              {tip.isCompleted && tip.streak && (
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="text-xs text-orange-600 font-medium">
                    🔥 {tip.streak} day streak
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};