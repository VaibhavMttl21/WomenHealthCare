import React from 'react';
import { BookOpen, AlertCircle, CheckCircle } from '../ui/Icons';

interface MythFactCard {
  id: string;
  myth: string;
  fact: string;
  icon: string;
  bgGradient: string;
}

const mythBusterData: MythFactCard[] = [
  {
    id: '1',
    myth: 'Eating for two during pregnancy',
    fact: 'Quality matters more than quantity. You need only 300 extra calories.',
    icon: '🍎',
    bgGradient: 'from-green-200 to-teal-200'
  },
  {
    id: '2',
    myth: 'Exercise is dangerous during pregnancy',
    fact: 'Regular gentle exercise is beneficial for both mother and baby.',
    icon: '🏃‍♀️',
    bgGradient: 'from-blue-200 to-purple-200'
  },
  {
    id: '3',
    myth: 'Traditional herbs cure all ailments',
    fact: 'Always consult a doctor before using any herbal remedies.',
    icon: '🌿',
    bgGradient: 'from-emerald-200 to-green-200'
  }
];

export const HealthEducationSection: React.FC = () => {
  const handleLearnMore = (cardId: string) => {
    console.log('Learning more about:', cardId);
    // Handle learn more navigation logic here
  };

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-800 mb-4">
          <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Health</span> Education
        </h2>
        <p className="text-gray-600 font-light text-lg">Evidence-based insights for your wellness journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mythBusterData.map((card) => (
          <div 
            key={card.id}
            className="bg-white/70 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl border border-white/50 group hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => handleLearnMore(card.id)}
          >
            
            {/* Image Section */}
            <div className={`h-40 relative bg-gradient-to-br ${card.bgGradient}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white/80">
                  <span className="text-4xl">{card.icon}</span>
                </div>
              </div>
              <div className="absolute top-4 left-4">
                <div className="w-8 h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-start gap-3 p-3 bg-red-50/80 rounded-2xl mb-3">
                  <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-red-700 font-medium text-xs uppercase tracking-wide mb-1">Myth</p>
                    <p className="text-gray-700 text-sm">{card.myth}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50/80 rounded-2xl">
                  <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-green-700 font-medium text-xs uppercase tracking-wide mb-1">Fact</p>
                    <p className="text-gray-700 text-sm">{card.fact}</p>
                  </div>
                </div>
              </div>

              <button 
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white font-medium rounded-2xl transition-all duration-300 group-hover:scale-105"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLearnMore(card.id);
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};