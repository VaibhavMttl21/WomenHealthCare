import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { ChevronRight, Heart, Phone, User } from '../ui/Icons';

interface ProfileCompletionCardProps {
  completionPercentage: number;
  onCompleteProfile: () => void;
}

interface MissingField {
  id: string;
  label: string;
  gradient: string;
  icon: React.ReactNode;
}

const missingFields: MissingField[] = [
  { 
    id: '1', 
    label: 'Medical History', 
    gradient: 'linear-gradient(135deg, #ffe5d9 0%, #ffd4d4 100%)',
    icon: <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
  },
  { 
    id: '2', 
    label: 'Emergency Contact', 
    gradient: 'linear-gradient(135deg, #ffd4d4 0%, #ffc2d4 100%)',
    icon: <Phone className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
  },
  { 
    id: '3', 
    label: 'Preferences', 
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #ffc2d4 100%)',
    icon: <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
  }
];

export const ProfileCompletionCard: React.FC<ProfileCompletionCardProps> = ({
  completionPercentage,
  onCompleteProfile
}) => {
  if (completionPercentage >= 100) {
    return null; // Don't show if profile is complete
  }

  return (
    <motion.div 
      className="relative bg-gradient-to-br from-pink-50 via-white to-rose-100 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg border border-pink-100/50 w-full overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 40px -12px rgba(236, 72, 153, 0.25)",
        transition: { duration: 0.3 }
      }}
    >
      <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 relative z-10">
        
        {/* Circular Progress with Pulse Animation */}
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 flex-shrink-0">
          {/* Glowing pulse ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-300/30 to-pink-300/30 blur-md animate-pulse"></div>
          
          <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              className="text-gray-200"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            />
            {/* Progress circle with gradient */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
            <motion.path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="3.5"
              strokeDasharray={`${completionPercentage}, 100`}
              strokeLinecap="round"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${completionPercentage}, 100` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.4))"
              }}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <motion.div 
                className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {completionPercentage}%
              </motion.div>
              <div className="text-xs text-gray-500 font-medium">Complete</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left w-full min-w-0">
          {/* Gradient Heading */}
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-2 leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #ec4899 0%, #fb7185 50%, #fb923c 100%)'
              }}
            >
              Complete Your Profile
            </span>
          </h2>
          
          {/* Subtle progress bar accent */}
          <motion.div 
            className="h-1 bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 rounded-full mb-3 mx-auto lg:mx-0"
            initial={{ width: 0 }}
            whileInView={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            style={{ maxWidth: '200px' }}
          ></motion.div>
          
          <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-6 font-light">
            Help us personalize your care experience with a few more details
          </p>
          
          {/* Missing Fields with Bounce Animation */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-7 justify-center lg:justify-start">
            {missingFields.map((field, index) => (
              <motion.span 
                key={field.id}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
                style={{
                  background: field.gradient
                }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.05,
                  y: -2,
                  boxShadow: "0 4px 12px rgba(236, 72, 153, 0.2)",
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-gray-600">
                  {field.icon}
                </div>
                {field.label}
              </motion.span>
            ))}
          </div>
          
          {/* Premium Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Button 
              onClick={onCompleteProfile}
              className="relative overflow-hidden w-full sm:w-auto text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base group"
              style={{
                background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              }}
            >
              <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                Complete Profile
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </motion.div>
              </span>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
          </motion.div>
        </div>

        {/* Simple Fixed User Avatar */}
        <div className="hidden lg:flex relative w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 flex-shrink-0">
          {/* Avatar circle with gradient border */}
          <div 
            className="relative w-full h-full rounded-full flex items-center justify-center shadow-xl"
            style={{
              background: 'linear-gradient(135deg, #fef3f2 0%, #fff5f7 100%)',
              border: '3px solid transparent',
              backgroundImage: 'linear-gradient(135deg, #fef3f2 0%, #fff5f7 100%), linear-gradient(135deg, #f9d77e 0%, #e8b55d 50%, #d4a03a 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            {/* User Icon */}
            <User 
              className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-pink-300"
            />
            
            {/* Incomplete indicator - pulsing dot */}
            <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full border-2 border-white shadow-lg">
              <div className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};