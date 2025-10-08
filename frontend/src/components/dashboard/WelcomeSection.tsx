import React from 'react';

interface WelcomeSectionProps {
  userName?: string;
}

export const WelcomeSection: React.FC<WelcomeSectionProps> = ({ userName = 'Priya' }) => {
  const currentDate = new Date().toLocaleDateString('en-IN', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="relative bg-gradient-to-br from-white via-amber-50/15 to-orange-50/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl md:rounded-[2rem] shadow-lg sm:shadow-2xl border border-amber-100/40 sm:border-2 max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto overflow-hidden animate-fadeIn">
      
      {/* Premium Gold Accent Border */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl md:rounded-[2rem] bg-gradient-to-r from-amber-200/8 via-transparent to-amber-200/8"></div>

      {/* Main Content Container - Flex Layout */}
      <div className="relative z-10 flex flex-col sm:flex-row h-full min-h-[120px] sm:min-h-[180px] md:min-h-[220px] lg:min-h-[260px]">
        
        {/* Left Content - Mobile: full width, Desktop: 60% width */}
        <div className="flex-1 flex flex-col justify-center items-center text-center p-3 sm:p-6 md:p-8 lg:p-10 pr-2 sm:pr-3">
          
          {/* Mobile Circular Image - Positioned above text */}
          <div className="sm:hidden mb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-100/40 shadow-md">
              <img 
                src="/src/images/welcomeimg.webp" 
                alt="Welcome illustration" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Premium Typography - Namaste at Top */}
          <h1 className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium mb-1 sm:mb-2 md:mb-3 tracking-wide leading-tight drop-shadow-sm"
              style={{ color: '#c54b4a' }}>
            Namaste, <span className="font-serif font-semibold" style={{ color: '#c54b4a' }}>{userName}</span>
          </h1>

          {/* Refined Date with Elegant Styling */}
          <p className="font-light italic mb-2 sm:mb-3 md:mb-4 leading-relaxed tracking-wide text-xs sm:text-sm md:text-base lg:text-lg"
             style={{ color: '#c54b4a', opacity: 0.8 }}>
            {currentDate}
          </p>

          {/* Enhanced Tagline with Handwritten Feel */}
          <div className="max-w-[260px] sm:max-w-sm md:max-w-md lg:max-w-lg">
            <p className="font-serif font-medium text-sm sm:text-base md:text-lg lg:text-xl italic leading-relaxed tracking-wide drop-shadow-sm"
               style={{ color: '#c54b4a', opacity: 0.9 }}>
              "Empowering Your Pregnancy Journey with Care"
            </p>
            
            {/* Decorative Flourish */}
            <div className="flex justify-center items-center mt-2 sm:mt-3 md:mt-4">
              <div className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-transparent"
                   style={{ backgroundImage: `linear-gradient(to right, transparent, #c54b4a, transparent)`, opacity: 0.6 }}></div>
              <div className="mx-2 text-sm sm:text-base md:text-lg" style={{ color: '#c54b4a', opacity: 0.7 }}>✿</div>
              <div className="w-8 sm:w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-transparent"
                   style={{ backgroundImage: `linear-gradient(to right, transparent, #c54b4a, transparent)`, opacity: 0.6 }}></div>
            </div>
          </div>
        </div>

        {/* Right Side Image - Desktop: 40% width, full height */}
        <div className="hidden sm:block sm:w-2/5 relative">
          <div className="absolute inset-0 rounded-r-2xl sm:rounded-r-3xl md:rounded-r-[2rem] overflow-hidden">
            <img 
              src="/src/images/welcomeimg.webp" 
              alt="Welcome illustration" 
              className="w-full h-full object-cover shadow-inner"
            />
            {/* Elegant overlay gradient for premium look */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/10"></div>
          </div>
        </div>

      </div>
    </div>
  );
};