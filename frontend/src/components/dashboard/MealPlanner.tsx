import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Heart, CheckCircle } from '../ui/Icons';

interface MealLog {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  emoji: string;
  bgColor: string;
  status: 'logged' | 'pending' | 'upcoming';
  description: string;
}

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

export const MealPlanner: React.FC = () => {
  const handleLogMeal = (mealId?: string) => {
    console.log('Logging meal:', mealId || 'new meal');
    // Handle meal logging logic
  };

  const handleAddMeal = () => {
    console.log('Opening meal logging interface');
    // Handle navigation to meal logging interface
  };

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
    >
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-10">
        <h2 
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-3"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            backgroundImage: 'linear-gradient(135deg, #be1a4f 0%, #dc1c5d 50%, #c54b4a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          AI Meal Planner
        </h2>
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-gray-700 text-center italic font-light tracking-wide max-w-2xl px-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Smart, personalized meal suggestions designed for your daily wellness goals
        </motion.p>
      </div>

      {/* Daily Nutrition Card */}
      <motion.div 
        className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-gray-200 w-full max-w-7xl mx-auto group overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        viewport={{ once: true }}
        whileHover={{
          y: -6,
          boxShadow: '0 20px 40px rgba(107, 142, 35, 0.15)',
          transition: { duration: 0.3 }
        }}
      >
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Content Section */}
          <div className="flex-1 w-full">
            {/* Card Header */}
            <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
              <motion.div 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #fca5a5 100%)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 8px 30px rgba(239, 68, 68, 0.4)',
                  transition: { duration: 0.3 }
                }}
              >
                <Heart className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-white relative z-10" />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-300/30 to-transparent blur-xl"></div>
              </motion.div>
              <div className="min-w-0 flex-1">
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl font-light leading-tight"
                  style={{ 
                    fontFamily: 'Playfair Display, serif',
                    backgroundImage: 'linear-gradient(135deg, #4a5d23 0%, #6b8e23 50%, #8fbc40 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Daily Nutrition
                </h3>
                <p 
                  className="text-gray-600 font-light text-sm sm:text-base"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  Track your wellness journey
                </p>
              </div>
            </div>
        
            {/* Meal Cards */}
            <div className="space-y-3 sm:space-y-4 mb-5 sm:mb-6">
              {mealData.map((meal, index) => (
                <motion.div 
                  key={meal.id}
                  className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                    meal.status === 'logged' ? 'bg-gradient-to-r from-green-50 to-emerald-50/80' :
                    meal.status === 'pending' ? 'bg-gradient-to-r from-purple-50 to-lavender-50/80' :
                    'bg-gradient-to-r from-gray-50 to-slate-50/80'
                  }`}
                  style={{
                    background: meal.status === 'logged' 
                      ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                      : meal.status === 'pending'
                      ? 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)'
                      : 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)'
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.02,
                    boxShadow: meal.status === 'logged' ? '0 4px 15px rgba(107, 142, 35, 0.15)' :
                               meal.status === 'pending' ? '0 4px 15px rgba(107, 142, 35, 0.12)' :
                               '0 4px 15px rgba(148, 163, 184, 0.1)',
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${meal.bgColor} rounded-full flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 shadow-md ${
                    meal.status === 'upcoming' ? 'opacity-60' : ''
                  }`}>
                    {meal.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p 
                      className={`font-medium text-sm sm:text-base ${
                        meal.status === 'upcoming' ? 'text-gray-600' : 'text-gray-800'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1)}
                    </p>
                    <p 
                      className={`text-xs sm:text-sm font-medium leading-tight ${
                        meal.status === 'logged' ? 'text-green-600' :
                        meal.status === 'pending' ? 'text-purple-600' :
                        'text-gray-500'
                      }`}
                      style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                    >
                      {meal.status === 'logged' ? '✅ ' : meal.status === 'pending' ? '⏳ ' : ''}
                      {meal.description}
                    </p>
                  </div>
                  {meal.status === 'pending' && (
                    <motion.button 
                      className="px-3 sm:px-4 py-1.5 sm:py-2 text-white text-xs sm:text-sm font-semibold rounded-full shadow-sm flex-shrink-0"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        background: 'linear-gradient(135deg, #6b46c1 0%, #7c3aed 50%, #a78bfa 100%)'
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: '0 4px 12px rgba(107, 70, 193, 0.4)',
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleLogMeal(meal.id)}
                    >
                      Log Now
                    </motion.button>
                  )}
                  {meal.status === 'logged' && (
                    <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-green-500 flex-shrink-0" />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Tip Box */}
            <motion.div 
              className="p-4 sm:p-5 rounded-2xl mb-5 sm:mb-6"
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
            >
              <p 
                className="text-green-700 text-xs sm:text-sm leading-relaxed"
                style={{ fontFamily: 'Nunito Sans, sans-serif' }}
              >
                <span className="font-semibold">🌿 Wellness Tip:</span> Include more seasonal fruits & vegetables for optimal nutrition!
              </p>
            </motion.div>

            {/* Add Meal Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <Button 
                onClick={handleAddMeal}
                className="relative overflow-hidden w-full text-white font-semibold py-3.5 sm:py-4 rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base group"
                style={{
                  background: 'linear-gradient(135deg, #4a5d23 0%, #6b8e23 50%, #8fbc40 100%)',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <motion.span 
                  className="relative z-10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  Add Meal
                </motion.span>
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </motion.div>
          </div>

          {/* Right Image Section */}
          <motion.div 
            className="relative w-full sm:w-64 md:w-72 lg:w-80 xl:w-96 h-64 sm:h-72 md:h-80 lg:h-96 xl:h-[420px] flex-shrink-0"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Decorative background circles */}
            <div className="absolute top-10 right-10 w-64 h-64 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #6b8e23 0%, transparent 70%)'
              }}
            ></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full opacity-10"
              style={{
                background: 'radial-gradient(circle, #4a5d23 0%, transparent 70%)'
              }}
            ></div>

            {/* Heart Food Image */}
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl">
              <img 
                src="/src/assets/heart-food.webp" 
                alt="Healthy food in heart shape"
                className="w-full h-full object-cover"
              />
              
              {/* Overlay gradient */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: 'linear-gradient(135deg, #4a5d23 0%, #6b8e23 100%)'
                }}
              ></div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};