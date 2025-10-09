import React from 'react';
import { Button } from '../ui/Button';
import { Calendar, MapPin, Clock } from '../ui/Icons';

interface AppointmentData {
  doctor: string;
  type: string;
  date: string;
  time: string;
  location: string;
}

interface AppointmentCardProps {
  appointment: AppointmentData;
  onViewDetails: () => void;
  onGetDirections: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onViewDetails,
  onGetDirections
}) => {
  return (
    <div className="group relative bg-gradient-to-br from-white via-pink-50/30 to-rose-50/40 backdrop-blur-md rounded-3xl sm:rounded-[2rem] p-4 sm:p-5 md:p-6 shadow-2xl border border-pink-100/60 w-full overflow-hidden transition-all duration-500 hover:shadow-pink-200/50 hover:scale-[1.01]">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-rose-200/20 to-transparent rounded-full blur-2xl"></div>
      
      <div className="relative flex flex-col lg:flex-row items-stretch gap-4 sm:gap-5 md:gap-6">
        
        {/* Left Side - Appointment Details */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with elegant badge */}
          <div className="mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-full mb-2 sm:mb-3 shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-[#ed7a78]" />
              <span className="text-[#c54b4a] font-semibold text-xs tracking-wide">UPCOMING</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-800 mb-1.5 leading-tight" style={{ fontFamily: 'Lora, serif' }}>
              Your Next <span className="font-medium" style={{ color: '#c54b4a' }}>Appointment</span>
            </h2>
            <p className="text-gray-600 text-sm font-light">{appointment.type}</p>
          </div>

          {/* Doctor Info with elegant presentation */}
          <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-pink-100/50 shadow-sm">
            <p className="text-xs text-gray-500 mb-0.5 tracking-wide uppercase">Your Healthcare Provider</p>
            <p className="text-lg sm:text-xl font-medium text-gray-800" style={{ fontFamily: 'Lora, serif' }}>{appointment.doctor}</p>
          </div>

          {/* Appointment Details - Elegant Cards */}
          <div className="space-y-2.5 sm:space-y-3 mb-4 sm:mb-5 flex-1">
            {/* Date & Time Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-gradient-to-r from-pink-50/80 to-rose-50/80 backdrop-blur-sm rounded-xl border border-pink-100/40 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-pink-200/60 to-rose-200/60 rounded-lg flex items-center justify-center shadow-inner">
                <Clock className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-[#c54b4a]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Date & Time</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{appointment.date} at {appointment.time}</p>
              </div>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl border border-amber-100/40 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-amber-200/60 to-orange-200/60 rounded-lg flex items-center justify-center shadow-inner">
                <MapPin className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-amber-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium mb-0.5">Location</p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{appointment.location}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons - Premium Style */}
          <div className="flex flex-col xs:flex-row gap-2.5 sm:gap-3">
            <Button 
              onClick={onViewDetails}
              className="flex-1 relative overflow-hidden bg-gradient-to-r from-[#ed7a78] to-[#c54b4a] hover:from-[#d96967] hover:to-[#b43939] text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 text-sm"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                View Full Details
                <span className="text-base">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
            <Button 
              onClick={onGetDirections}
              className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-pink-200/60 hover:border-[#ed7a78] hover:bg-pink-50/50 text-[#c54b4a] font-semibold py-2.5 sm:py-3 px-4 sm:px-5 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4" />
                Get Directions
              </span>
            </Button>
          </div>
        </div>

        {/* Right Side - Doctor Image with Premium Frame */}
        <div className="hidden lg:flex lg:w-[340px] xl:w-[380px] flex-shrink-0">
          <div className="relative w-full h-full min-h-[280px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80">
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-pink-100/40 via-transparent to-white/30 z-10"></div>
            
            {/* Doctor Image */}
            <img 
              src="/src/assets/doc.png" 
              alt={appointment.doctor}
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Elegant bottom overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#c54b4a]/90 via-[#c54b4a]/60 to-transparent p-4 z-20">
              <div className="backdrop-blur-sm">
                <p className="text-white text-xs font-medium mb-0.5 opacity-90">Healthcare Professional</p>
                <p className="text-white text-base font-semibold" style={{ fontFamily: 'Lora, serif' }}>Ready to assist you</p>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/40 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};