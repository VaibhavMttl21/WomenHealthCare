import React from 'react';
import { Button } from '../ui/Button';

interface CommunitySession {
  title: string;
  topic: string;
  instructor: string;
  date: string;
  time: string;
  platform: string;
  participantCount: number;
}

interface CommunitySessionBannerProps {
  session: CommunitySession;
  onJoinSession: () => void;
  onSetReminder: () => void;
}

export const CommunitySessionBanner: React.FC<CommunitySessionBannerProps> = ({
  session,
  onJoinSession,
  onSetReminder
}) => {
  const participantAvatars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl border border-white/50 w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8">
        
        {/* Community Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
          <span className="text-2xl sm:text-3xl md:text-4xl text-white">👥</span>
        </div>

        {/* Content */}
        <div className="flex-1 text-center lg:text-left w-full min-w-0">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-red-100 rounded-full mb-3 sm:mb-4">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-700 font-medium text-xs sm:text-sm">LIVE SESSION TODAY</span>
          </div>
          
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight px-1">
            {session.title.split(' ').slice(0, 2).join(' ')} <span className="bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent font-medium">{session.title.split(' ').slice(2).join(' ')}</span>
          </h3>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-3 sm:mb-4 font-light leading-relaxed px-1">
            Live session on <span className="font-medium">"{session.topic}"</span> with {session.instructor}
          </p>
          
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 md:mb-8 px-1">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-orange-600 text-xs sm:text-sm">📅</span>
              </div>
              <span className="leading-tight">{session.date} at {session.time}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xs sm:text-sm">🌐</span>
              </div>
              <span className="leading-tight">{session.platform}</span>
            </div>
          </div>

          <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-1">
            <Button 
              onClick={onJoinSession}
              className="bg-gradient-to-r from-teal-400 to-cyan-400 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl shadow-lg transition-all duration-300 text-sm sm:text-base"
            >
              🎥 Join Live Session
            </Button>
            <Button 
              onClick={onSetReminder}
              className="bg-white border-2 border-teal-200 hover:border-teal-300 text-teal-600 font-medium py-3 sm:py-4 px-4 sm:px-6 md:px-8 rounded-xl sm:rounded-2xl transition-all duration-300 text-sm sm:text-base"
            >
              Set Reminder
            </Button>
          </div>
        </div>

        {/* Participant Count */}
        <div className="text-center lg:text-right flex-shrink-0">
          <div className="text-2xl sm:text-3xl md:text-4xl font-light text-teal-600 mb-1 sm:mb-2">{session.participantCount}</div>
          <div className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">women joined</div>
          <div className="flex -space-x-1 sm:-space-x-2 justify-center">
            {participantAvatars.map(i => (
              <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                <span className="text-white text-xs">👩</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};