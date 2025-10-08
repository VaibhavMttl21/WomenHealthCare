import React from 'react';
import { Button } from '../ui/Button';
import { Calendar, Activity, MapPin, User } from '../ui/Icons';

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
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full">
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 sm:gap-6 md:gap-8">
        
        {/* Left Side - Appointment Details */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <Calendar className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-800 mb-1 leading-tight">
                Upcoming Appointment
              </h2>
              <p className="text-gray-500 font-light text-sm sm:text-base">{appointment.type}</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-gray-800 font-medium text-base sm:text-lg truncate">{appointment.doctor}</p>
                <p className="text-gray-500 text-xs sm:text-sm">Healthcare Professional</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-orange-50/50 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 text-xs sm:text-sm font-semibold">📅</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm">Date & Time</p>
                  <p className="text-gray-800 font-medium text-sm sm:text-base leading-tight">{appointment.date}, {appointment.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-50/50 rounded-xl sm:rounded-2xl">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xs sm:text-sm font-semibold">📍</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-600 text-xs sm:text-sm">Location</p>
                  <p className="text-gray-800 font-medium text-sm sm:text-base leading-tight">{appointment.location}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={onViewDetails}
              className="flex-1 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
              View Details
            </Button>
            <Button 
              onClick={onGetDirections}
              className="flex-1 bg-white border-2 border-pink-200 hover:border-pink-300 text-pink-600 font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base"
            >
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              Get Directions
            </Button>
          </div>
        </div>

        {/* Right Side - Visual Element */}
        <div className="hidden xl:flex w-40 h-40 lg:w-48 lg:h-48 bg-gradient-to-br from-pink-100 to-orange-100 rounded-2xl lg:rounded-3xl items-center justify-center flex-shrink-0">
          <div className="text-6xl lg:text-8xl opacity-80">🏥</div>
        </div>
      </div>
    </div>
  );
};