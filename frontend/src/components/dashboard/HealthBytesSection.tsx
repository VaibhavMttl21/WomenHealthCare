import React from 'react';
import { motion } from 'framer-motion';
import { Video, BookOpen } from '../ui/Icons';

interface HealthContent {
  id: string;
  title: string;
  description: string;
  duration: string;
  gradient: string;
  type: 'video' | 'guide';
}

const healthContentData: HealthContent[] = [
  {
    id: '1',
    title: 'Prenatal Yoga',
    description: 'Embrace gentle movements & mindful breathing designed for your beautiful journey to motherhood',
    duration: '18 min watch',
    gradient: 'linear-gradient(135deg, #ffd1dc 0%, #ffb3c1 50%, #ffa8b5 100%)',
    type: 'video'
  },
  {
    id: '2',
    title: 'Baby Care Guide',
    description: 'Nurture with confidence — explore tender care tips, feeding wisdom & bonding rituals for your little one',
    duration: '10 min read',
    gradient: 'linear-gradient(135deg, #e9d5ff 0%, #f0abfc 50%, #f9a8d4 100%)',
    type: 'guide'
  }
];

export const HealthBytesSection: React.FC = () => {
  const handleContentClick = (contentId: string) => {
    console.log('Opening content:', contentId);
    // Handle content opening logic here
  };

  return (
    <motion.div 
      className="relative w-full overflow-hidden bg-gradient-to-br from-pink-50/40 via-purple-50/30 to-orange-50/40 backdrop-blur-sm rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-pink-100/50"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* Header with Floral Icon */}
      <div className="flex flex-col items-center justify-center mb-6 sm:mb-7">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl">🌸</span>
          </div>
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl font-light text-center leading-tight"
            style={{ fontFamily: 'Playfair Display, Lora, serif' }}
          >
            <span 
              className="font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #be1a4f 0%, #dc1c5d 50%, #c54b4a 100%)'
              }}
            >
              Health Bytes
            </span>
            <span className="text-gray-700"> for You</span>
          </h2>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center shadow-lg">
            <span className="text-xl sm:text-2xl">🌸</span>
          </div>
        </div>
        
        {/* Creative Tagline */}
        <motion.p 
          className="text-sm sm:text-base md:text-lg text-gray-700 text-center italic font-light px-4"
          style={{ fontFamily: 'Playfair Display, serif' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Curated wellness content to nurture your body, mind & soul
        </motion.p>
      </div>

      {/* Hero Section with Yoga Image and Cards */}
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-6 sm:gap-8">
        
        {/* Yoga Hero Image - No Badge */}
        <motion.div 
          className="w-full lg:w-2/5 flex-shrink-0 flex items-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl max-w-md mx-auto w-full"
            style={{
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #f9d77e 0%, #e8b55d 50%, #d4a03a 100%)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box'
            }}
          >
            <img 
              src="/src/assets/yoga4.png" 
              alt="Woman doing yoga"
              className="w-full h-72 sm:h-80 md:h-[22rem] lg:h-96 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-pink-200/30 via-transparent to-purple-100/20"></div>
          </div>
        </motion.div>

        {/* Content Cards - Golden Border & Faster Animation */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {healthContentData.map((content, index) => (
            <motion.div
              key={content.id}
              className="group relative bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer flex flex-col"
              onClick={() => handleContentClick(content.id)}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -12, 
                scale: 1.03,
                transition: { duration: 0.2, ease: "easeOut" }
              }}
              style={{
                border: '1px solid transparent',
                backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #f9d77e 0%, #e8b55d 50%, #d4a03a 100%)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box'
              }}
            >
              {/* Duration Badge */}
              <div className="absolute top-3 right-3 z-10">
                <div 
                  className="text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md"
                  style={{
                    background: 'linear-gradient(135deg, rgba(190, 26, 79, 0.9) 0%, rgba(220, 28, 93, 0.9) 100%)'
                  }}
                >
                  {content.duration}
                </div>
              </div>

              {/* Gradient Background - Taller */}
              <div 
                className="h-48 sm:h-52 md:h-56 lg:h-60 relative"
                style={{ background: content.gradient }}
              >
                {/* Icon in center with vibrant gradient */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    className="w-20 h-20 sm:w-24 sm:h-24 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl"
                    style={{
                      background: content.type === 'video' 
                        ? 'linear-gradient(135deg, #ff006e 0%, #ff4d8f 50%, #ff80b3 100%)'
                        : 'linear-gradient(135deg, #7209b7 0%, #b14be8 50%, #d980fa 100%)'
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: 5,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                  >
                    {content.type === 'video' ? (
                      <Video className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    ) : (
                      <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                    )}
                  </motion.div>
                </div>

                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col">
                <h3 
                  className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-tight"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {content.title}
                </h3>
                <p 
                  className="text-gray-600 text-sm sm:text-base leading-relaxed font-light flex-1"
                  style={{ fontFamily: 'Nunito Sans, Inter, sans-serif' }}
                >
                  {content.description}
                </p>
              </div>

              {/* Subtle inner glow on hover */}
              <motion.div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  transition: { duration: 0.3 }
                }}
                style={{
                  boxShadow: 'inset 0 0 40px rgba(212, 160, 58, 0.2)'
                }}
              ></motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
    </motion.div>
  );
};