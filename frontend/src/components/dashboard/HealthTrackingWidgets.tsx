import React from 'react';
import { Button } from '../ui/Button';
import { Shield, Heart, CheckCircle, AlertCircle } from '../ui/Icons';

interface VaccineRecord {
  id: string;
  name: string;
  status: 'completed' | 'pending';
  date?: string;
  dueDate?: string;
}

interface MealLog {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  emoji: string;
  bgColor: string;
  status: 'logged' | 'pending' | 'upcoming';
  description: string;
}

const vaccineData: VaccineRecord[] = [
  {
    id: '1',
    name: 'TT-1 Vaccine',
    status: 'completed',
    date: 'March 15'
  },
  {
    id: '2',
    name: 'TT-2 Vaccine',
    status: 'pending',
    dueDate: '2 weeks'
  }
];

const mealData: MealLog[] = [
  {
    id: '1',
    mealType: 'breakfast',
    emoji: '☀️',
    bgColor: 'bg-yellow-200',
    status: 'logged',
    description: 'Poha & Milk logged'
  },
  {
    id: '2',
    mealType: 'lunch',
    emoji: '🌞',
    bgColor: 'bg-orange-200',
    status: 'pending',
    description: 'Time to log your meal'
  },
  {
    id: '3',
    mealType: 'dinner',
    emoji: '🌙',
    bgColor: 'bg-gray-200',
    status: 'upcoming',
    description: 'Coming up later'
  }
];

export const HealthTrackingWidgets: React.FC = () => {
  const handleViewSchedule = () => {
    console.log('Opening vaccination schedule');
    // Handle navigation to vaccination schedule
  };

  const handleSetReminder = (vaccineId: string) => {
    console.log('Setting reminder for:', vaccineId);
    // Handle reminder setting logic
  };

  const handleLogMeal = (mealId?: string) => {
    console.log('Logging meal:', mealId || 'new meal');
    // Handle meal logging logic
  };

  const handleAddMeal = () => {
    console.log('Opening meal logging interface');
    // Handle navigation to meal logging interface
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 w-full">
      
      {/* Vaccination Tracker */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Shield className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 leading-tight">Vaccination Tracker</h3>
            <p className="text-gray-600 font-light text-sm sm:text-base">Stay protected & healthy</p>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          {vaccineData.map((vaccine) => (
            <div 
              key={vaccine.id}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-l-4 ${
                vaccine.status === 'completed' 
                  ? 'bg-green-50/80 border-green-400' 
                  : 'bg-amber-50/80 border-amber-400'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                vaccine.status === 'completed' ? 'bg-green-200' : 'bg-amber-200'
              }`}>
                {vaccine.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{vaccine.name}</p>
                <p className={`text-xs sm:text-sm font-medium leading-tight ${
                  vaccine.status === 'completed' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {vaccine.status === 'completed' 
                    ? `✅ Completed on ${vaccine.date}`
                    : `⏳ Due in ${vaccine.dueDate}`
                  }
                </p>
              </div>
              {vaccine.status === 'pending' && (
                <button 
                  className="px-2 sm:px-3 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full hover:bg-amber-300 transition-colors flex-shrink-0"
                  onClick={() => handleSetReminder(vaccine.id)}
                >
                  Remind Me
                </button>
              )}
            </div>
          ))}
        </div>

        <Button 
          onClick={handleViewSchedule}
          className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-medium py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base"
        >
          View Full Schedule
        </Button>
      </div>

      {/* Daily Nutrition Log */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 leading-tight">Daily Nutrition</h3>
            <p className="text-gray-600 font-light text-sm sm:text-base">Track your wellness</p>
          </div>
        </div>
        
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
          {mealData.map((meal) => (
            <div 
              key={meal.id}
              className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl ${
                meal.status === 'logged' ? 'bg-green-50/80' :
                meal.status === 'pending' ? 'bg-amber-50/80' :
                'bg-gray-50/80'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 ${meal.bgColor} rounded-full flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 ${
                meal.status === 'upcoming' ? 'opacity-60' : ''
              }`}>
                {meal.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm sm:text-base ${
                  meal.status === 'upcoming' ? 'text-gray-600' : 'text-gray-800'
                }`}>
                  {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                </p>
                <p className={`text-xs sm:text-sm font-medium leading-tight ${
                  meal.status === 'logged' ? 'text-green-600' :
                  meal.status === 'pending' ? 'text-amber-600' :
                  'text-gray-500'
                }`}>
                  {meal.status === 'logged' ? '✅ ' : meal.status === 'pending' ? '⏳ ' : ''}
                  {meal.description}
                </p>
              </div>
              {meal.status === 'pending' && (
                <button 
                  className="px-2 sm:px-3 py-1 bg-amber-200 text-amber-800 text-xs font-medium rounded-full hover:bg-amber-300 transition-colors flex-shrink-0"
                  onClick={() => handleLogMeal(meal.id)}
                >
                  Log Now
                </button>
              )}
              {meal.status === 'logged' && (
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        <div className="p-3 sm:p-4 bg-purple-50/80 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
          <p className="text-purple-700 text-xs sm:text-sm">
            <span className="font-medium">💡 Tip:</span> Include more seasonal fruits for better nutrition!
          </p>
        </div>

        <Button 
          onClick={handleAddMeal}
          className="w-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base"
        >
          Add Meal
        </Button>
      </div>
    </div>
  );
};