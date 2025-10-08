import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { MainLayout } from '../../components/layout/MainLayout';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { WelcomeSection } from '../../components/dashboard/WelcomeSection'; 
import { AppointmentCard } from '../../components/dashboard/AppointmentCard'; 
import { HealthBytesSection } from '../../components/dashboard/HealthBytesSection'; 
import { ProfileCompletionCard } from '../../components/dashboard/ProfileCompletionCard'; 
import { HealthEducationSection } from '../../components/dashboard/HealthEducationSection'; 
import { HealthTrackingWidgets } from '../../components/dashboard/HealthTrackingWidgets'; 
import { WellnessTipsSection } from '../../components/dashboard/WellnessTipsSection'; 
import { CommunitySessionBanner } from '../../components/dashboard/CommunitySessionBanner';

const WomenDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [profileCompletion] = useState(65);
  const dispatch = useDispatch<AppDispatch>()


  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Mock data - Replace with actual API calls
  const upcomingAppointment = {
    doctor: 'Dr. Priya Sharma',
    type: 'Regular Checkup',
    date: 'Tomorrow',
    time: '10:00 AM',
    location: 'Community Health Center'
  };

  const communitySession = {
    title: 'Join Our Community',
    topic: 'Nutrition During Pregnancy',
    instructor: 'Dr. Anjali Verma',
    date: 'Today',
    time: '4:00 PM',
    platform: 'Online Broadcast',
    participantCount: 127
  };



  return (
    <MainLayout userRole="women" onLogout={handleLogout}>

      {/* Main Content - Mobile-First Responsive Layout */}
      <div className="relative min-h-screen bg-gradient-to-br from-white via-orange-50/20 to-pink-50/30 overflow-x-hidden">
        <div className="w-full min-w-0 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 max-w-sm mx-auto sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10">
        
        {/* Welcome Section */}
        <WelcomeSection userName={user?.firstName} />

        {/* Appointment Card */}
        <AppointmentCard 
          appointment={upcomingAppointment}
          onViewDetails={() => navigate('/appointments')}
          onGetDirections={() => navigate('/map')}
        />

        {/* Health Bytes Section */}
        <HealthBytesSection />

        {/* Profile Completion Card */}
        <ProfileCompletionCard 
          completionPercentage={profileCompletion}
          onCompleteProfile={() => navigate('/profile')}
        />

        {/* Health Education Section */}
        <HealthEducationSection />

        {/* Health Tracking Widgets */}
        <HealthTrackingWidgets />

        {/* Wellness Tips Section */}
        <WellnessTipsSection />

        {/* Community Session Banner */}
        <CommunitySessionBanner 
          session={communitySession}
          onJoinSession={() => navigate('/broadcast')}
          onSetReminder={() => {
            // Add reminder logic here
            console.log('Reminder set for community session');
          }}
        />

        </div>
      </div>
    </MainLayout>
  );
};

export default WomenDashboard;
