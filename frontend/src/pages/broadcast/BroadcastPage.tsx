import React, { useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Radio, Video, Users, Calendar } from '../../components/ui/Icons';

const BroadcastPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'recorded'>('live');

  const liveSession = {
    title: 'Nutrition During Pregnancy',
    speaker: 'Dr. Anjali Verma',
    viewers: 324,
    startedAt: '3:45 PM'
  };

  const upcomingSessions = [
    {
      title: 'Prenatal Yoga Session',
      speaker: 'Yoga Instructor Meera',
      date: 'Tomorrow',
      time: '5:00 PM'
    },
    {
      title: 'Understanding Baby Development',
      speaker: 'Dr. Priya Sharma',
      date: 'Oct 6, 2025',
      time: '4:00 PM'
    }
  ];

  const recordedSessions = [
    {
      title: 'First Trimester Care',
      speaker: 'Dr. Rajesh Kumar',
      views: 1250,
      duration: '45 min'
    },
    {
      title: 'Common Pregnancy Myths',
      speaker: 'ASHA Worker Radha',
      views: 890,
      duration: '30 min'
    }
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-neutral-charcoal">
          <Radio className="inline h-8 w-8 mr-2 text-accent-skyblue" />
          Broadcast Room
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'live'
                ? 'text-primary-maroon'
                : 'text-neutral-brown hover:text-neutral-charcoal'
            }`}
          >
            🔴 Live Now
            {activeTab === 'live' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-maroon rounded-t"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'upcoming'
                ? 'text-primary-maroon'
                : 'text-neutral-brown hover:text-neutral-charcoal'
            }`}
          >
            📅 Upcoming
            {activeTab === 'upcoming' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-maroon rounded-t"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('recorded')}
            className={`px-6 py-3 font-semibold transition-colors relative ${
              activeTab === 'recorded'
                ? 'text-primary-maroon'
                : 'text-neutral-brown hover:text-neutral-charcoal'
            }`}
          >
            🎥 Recorded
            {activeTab === 'recorded' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-maroon rounded-t"></div>
            )}
          </button>
        </div>

        {/* Live Session */}
        {activeTab === 'live' && (
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-r from-primary-maroon/20 to-accent-skyblue/20 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Video className="h-10 w-10 text-primary-maroon ml-1" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    LIVE
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {liveSession.viewers}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-neutral-charcoal mb-2">
                  {liveSession.title}
                </h2>
                <p className="text-neutral-brown mb-4">
                  Speaker: {liveSession.speaker} • Started at {liveSession.startedAt}
                </p>
                <Button className="btn-primary w-full">
                  Join Live Session
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Upcoming Sessions */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-neutral-charcoal mb-2">
                        {session.title}
                      </h3>
                      <p className="text-neutral-brown mb-1">
                        👨‍⚕️ {session.speaker}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-neutral-brown">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {session.date}
                        </span>
                        <span>🕐 {session.time}</span>
                      </div>
                    </div>
                    <Button className="btn-secondary whitespace-nowrap">
                      Set Reminder
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recorded Sessions */}
        {activeTab === 'recorded' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recordedSessions.map((session, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-r from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Video className="h-8 w-8 text-primary-maroon ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2">
                    <span className="bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {session.duration}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-charcoal mb-1">
                    {session.title}
                  </h3>
                  <p className="text-sm text-neutral-brown mb-2">
                    {session.speaker}
                  </p>
                  <p className="text-xs text-gray-500">
                    👁 {session.views} views
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default BroadcastPage;
