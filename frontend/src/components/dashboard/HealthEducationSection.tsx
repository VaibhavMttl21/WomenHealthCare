import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, AlertCircle, CheckCircle } from '../ui/Icons';

interface MythFactCard {
  id: string;
  myth: string;
  fact: string;
  icon: string;
  iconGradient: string;
  iconGradientHover: string;
}

const mythBusterData: MythFactCard[] = [
  {
    id: '1',
    myth: 'Eating for two during pregnancy',
    fact: 'Quality over quantity — only 300 extra calories fuel a healthy pregnancy journey',
    icon: '🍎',
    iconGradient: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 50%, #fbbf24 100%)',
    iconGradientHover: 'linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)'
  },
  {
    id: '2',
    myth: 'Exercise is dangerous during pregnancy',
    fact: 'Gentle movement nurtures both mother & baby — embrace mindful exercise throughout your journey',
    icon: '🏃‍♀️',
    iconGradient: 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 50%, #a78bfa 100%)',
    iconGradientHover: 'linear-gradient(135deg, #c4b5fd 0%, #a78bfa 50%, #8b5cf6 100%)'
  },
  {
    id: '3',
    myth: 'Traditional herbs cure all ailments',
    fact: 'Herbal wisdom meets modern care — always consult your healthcare provider before using remedies',
    icon: '🌿',
    iconGradient: 'linear-gradient(135deg, #d1fae5 0%, #6ee7b7 50%, #34d399 100%)',
    iconGradientHover: 'linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%)'
  }
];

export const HealthEducationSection: React.FC = () => {
  const handleLearnMore = (cardId: string) => {
    console.log('Learning more about:', cardId);
    // Handle learn more navigation logic here
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header */}
      <div className="flex flex-col items-center justify-center mb-8 sm:mb-10">
        <h2 
            className="text-3xl sm:text-4xl md:text-5xl mb-4 font-light text-center leading-tight"
            style={{ fontFamily: 'Playfair Display, Lora, serif' }}
          >
            <span 
              className="font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #be1a4f 0%, #dc1c5d 50%, #c54b4a 100%)'
              }}
            >
              Health Education
            </span>
          </h2>
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-gray-700 text-center italic font-light tracking-wide"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Wisdom-backed insights to illuminate your wellness path
        </motion.p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {mythBusterData.map((card, index) => (
          <motion.div
            key={card.id}
            className="group cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => handleLearnMore(card.id)}
          >
            <motion.div
              className="relative bg-white rounded-3xl shadow-lg overflow-hidden h-full flex flex-col"
              style={{ border: '1px solid rgba(212, 175, 55, 0.4)' }}
              whileHover={{
                y: -8,
                boxShadow: '0 20px 40px rgba(168, 85, 247, 0.2)',
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient Icon Section */}
              <div 
                className="relative h-36 sm:h-40 flex items-center justify-center"
                style={{
                  background: card.iconGradient
                }}
              >
                {/* Rounded Icon Container */}
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    boxShadow: '0 12px 40px rgba(168, 85, 247, 0.3)',
                    transition: { duration: 0.3 }
                  }}
                >
                  <span className="text-4xl sm:text-5xl">{card.icon}</span>
                </motion.div>
                
                {/* Book icon badge */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-500" />
                </div>
              </div>

              {/* Content Section */}
              <div className="px-5 py-6 flex-1 flex flex-col">
                {/* Myth Box */}
                <motion.div
                  className="mb-4 p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-red-600 font-semibold text-xs uppercase tracking-widest mb-1.5"
                        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
                      >
                        Myth
                      </p>
                      <p 
                        className="text-gray-700 text-sm leading-relaxed font-light"
                        style={{ fontFamily: 'Lora, serif' }}
                      >
                        {card.myth}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Fact Box */}
                <motion.div
                  className="mb-5 p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p 
                        className="text-green-600 font-semibold text-xs uppercase tracking-widest mb-1.5"
                        style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}
                      >
                        Fact
                      </p>
                      <p 
                        className="text-gray-700 text-sm leading-relaxed font-light"
                        style={{ fontFamily: 'Lora, serif' }}
                      >
                        {card.fact}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Learn More Button */}
                <motion.button
                  className="relative overflow-hidden w-full py-3 px-6 text-white font-semibold rounded-2xl shadow-md mt-auto"
                  style={{
                    background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)',
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLearnMore(card.id);
                  }}
                >
                  <span className="relative z-10">Learn More</span>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};