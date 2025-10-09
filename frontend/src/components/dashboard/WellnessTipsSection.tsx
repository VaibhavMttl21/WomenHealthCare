import React from 'react';
import { motion } from 'framer-motion';

interface WellnessTip {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgGradient: string;
  iconBg: string;
}

const wellnessTipsData: WellnessTip[] = [
  { 
    id: '1',
    title: 'Iron-rich Diet', 
    description: 'Embrace the power of leafy greens like spinach, kale, and moringa. Pair them with vitamin C-rich foods like lemon or amla to boost iron absorption and maintain healthy hemoglobin levels naturally.', 
    icon: '🥬',
    bgGradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)',
    iconBg: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)'
  },
  { 
    id: '2',
    title: 'Stay Hydrated', 
    description: 'Water is your body\'s elixir. Aim for 8-10 glasses daily to flush out toxins, keep your skin glowing, regulate body temperature, and support optimal digestion for overall wellness.', 
    icon: '💧',
    bgGradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    iconBg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
  },
  { 
    id: '3',
    title: 'Regular Exercise', 
    description: 'Movement is medicine. Just 30 minutes of walking, dancing, or yoga daily strengthens your heart, boosts mood, enhances energy levels, and promotes hormonal balance for vibrant health.', 
    icon: '🚶‍♀️',
    bgGradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)',
    iconBg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
  },
  { 
    id: '4',
    title: 'Mental Wellness', 
    description: 'Nurture your mind with meditation, deep breathing, and gentle yoga. These practices reduce stress, improve focus, balance emotions, and cultivate inner peace for a harmonious life.', 
    icon: '🧘‍♀️',
    bgGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    iconBg: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)'
  }
];

export const WellnessTipsSection: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Section Header */}
      <div className="flex flex-col items-center justify-center mb-10 sm:mb-12">
        <motion.h2 
          className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide mb-4 text-center leading-tight pb-1"
          style={{ 
            fontFamily: 'Playfair Display, serif',
            backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #fb923c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block'
          }}
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Today's Wellness Tips
        </motion.h2>
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-gray-600 text-center italic font-light tracking-wide"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Small steps for a healthier you
        </motion.p>
      </div>
      
      {/* Wellness Tips Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-7">
        {wellnessTipsData.map((tip, index) => (
          <motion.div 
            key={tip.id}
            className="group relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 + index * 0.1, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Card Container */}
            <motion.div
              className="relative bg-white/60 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg"
              style={{ border: '1px solid rgba(212, 175, 55, 0.4)' }}
              whileHover={{
                y: -8,
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.08)',
                transition: { duration: 0.3 }
              }}
            >
              {/* Gradient Background Section */}
              <div 
                className="h-40 sm:h-44 relative flex items-center justify-center"
                style={{ background: tip.bgGradient }}
              >
                {/* Decorative circles */}
                <div className="absolute top-2 right-4 w-16 h-16 rounded-full opacity-20 bg-white/50"></div>
                <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full opacity-20 bg-white/50"></div>
                
                {/* Icon Container */}
                <motion.div 
                  className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full shadow-xl flex items-center justify-center z-10"
                  style={{ background: tip.iconBg }}
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <span className="text-4xl sm:text-5xl">{tip.icon}</span>
                  
                  {/* Soft glow */}
                  <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
                </motion.div>
              </div>

              {/* Content Section */}
              <div className="p-5 sm:p-6 text-center">
                <h4 
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 leading-snug"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {tip.title}
                </h4>
                <p 
                  className="text-gray-700 text-sm sm:text-base font-normal leading-relaxed"
                  style={{ fontFamily: 'Nunito Sans, sans-serif' }}
                >
                  {tip.description}
                </p>
              </div>

              {/* Subtle shine effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};