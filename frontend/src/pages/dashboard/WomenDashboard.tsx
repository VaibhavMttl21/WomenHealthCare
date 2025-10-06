import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { MainLayout } from '../../components/layout/MainLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  Calendar, 
  Activity, 
  MapPin, 
  Video, 
  User, 
  BookOpen, 
  Shield,
  Heart,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from '../../components/ui/Icons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

const WomenDashboard: React.FC = () => {
  const { t } = useTranslation();
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

  const mythBusterCards = [
    {
      myth: 'Myth: Eating for two during pregnancy',
      fact: 'Fact: Quality matters more than quantity. You need only 300 extra calories.',
      icon: '🍎'
    },
    {
      myth: 'Myth: Exercise is dangerous during pregnancy',
      fact: 'Fact: Regular gentle exercise is beneficial for both mother and baby.',
      icon: '🏃‍♀️'
    },
    {
      myth: 'Myth: Traditional herbs cure all ailments',
      fact: 'Fact: Always consult a doctor before using any herbal remedies.',
      icon: '🌿'
    }
  ];

  const healthTips = [
    { title: 'Iron-rich Diet', description: 'Include green leafy vegetables daily', icon: '🥬' },
    { title: 'Stay Hydrated', description: 'Drink 8-10 glasses of water', icon: '💧' },
    { title: 'Regular Exercise', description: '30 minutes of walking daily', icon: '🚶‍♀️' },
    { title: 'Mental Wellness', description: 'Practice meditation and yoga', icon: '🧘‍♀️' }
  ];

  return (
    <MainLayout userRole="women">
       <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <User className="h-5 w-5" />
                </Button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Welcome Section */}
        <div className="animate-slideUp">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-charcoal mb-2">
            {t('dashboard.welcome')}, {user?.firstName || 'Priya'}! 👋
          </h1>
          <p className="text-neutral-brown text-lg">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Appointment Card */}
        <Card className="bg-gradient-to-r from-primary-pink/10 to-primary-maroon/10 border-primary-pink/30 animate-slideUp">
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-charcoal mb-1">
                  {t('dashboard.upcomingAppointment')}
                </h2>
                <p className="text-neutral-brown">{upcomingAppointment.type}</p>
              </div>
              <div className="p-3 bg-primary-maroon rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-neutral-charcoal font-semibold">{upcomingAppointment.doctor}</p>
              <p className="text-neutral-brown">
                📅 {upcomingAppointment.date} at {upcomingAppointment.time}
              </p>
              <p className="text-neutral-brown">📍 {upcomingAppointment.location}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => navigate('/appointments')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Activity className="h-5 w-5" />
                Status
              </Button>
              <Button 
                onClick={() => navigate('/map')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                <MapPin className="h-5 w-5" />
                Map
              </Button>
            </div>
          </div>
        </Card>

        {/* Multimedia Content Section */}
        <Card className="overflow-hidden animate-slideUp">
          <div className="aspect-video bg-gradient-to-r from-primary-maroon/20 to-primary-pink/20 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Video className="h-8 w-8 text-primary-maroon ml-1" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <h3 className="text-white font-semibold">Prenatal Yoga for Healthy Pregnancy</h3>
              <p className="text-white/80 text-sm">Dr. Meera Patel • 15 minutes</p>
            </div>
          </div>
        </Card>

        {/* Complete Your Profile */}
        {profileCompletion < 100 && (
          <Card className="bg-gradient-to-r from-secondary-400/20 to-accent-orange/20 border-secondary-400/30 animate-slideUp">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-neutral-charcoal mb-2">
                    Complete Your Profile
                  </h2>
                  <p className="text-neutral-brown mb-3">
                    {profileCompletion}% completed - Add more details for personalized care
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-white rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-secondary-400 to-accent-orange h-full transition-all duration-500"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>
                <User className="h-12 w-12 text-secondary-700" />
              </div>
              
              <Button 
                onClick={() => navigate('/profile')}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                Complete Now
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        )}

        {/* Mythbuster & Education Section */}
        <div className="animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-neutral-charcoal flex items-center gap-2">
              <BookOpen className="h-7 w-7 text-primary-maroon" />
              Mythbuster & Education
            </h2>
            <button className="text-primary-maroon font-medium hover:underline">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mythBusterCards.map((card, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="p-5">
                  <div className="text-4xl mb-3">{card.icon}</div>
                  <div className="mb-3">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-semibold text-neutral-charcoal">{card.myth}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-neutral-brown">{card.fact}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Health Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp">
          
          {/* Vaccination Tracker */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-charcoal flex items-center gap-2">
                  <Shield className="h-6 w-6 text-accent-skyblue" />
                  Vaccination Tracker
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent-green/10 rounded-xl">
                  <div>
                    <p className="font-semibold text-neutral-charcoal">TT-1 Vaccine</p>
                    <p className="text-sm text-neutral-brown">Completed</p>
                  </div>
                  <CheckCircle className="h-6 w-6 text-accent-green" />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-secondary-400/10 rounded-xl">
                  <div>
                    <p className="font-semibold text-neutral-charcoal">TT-2 Vaccine</p>
                    <p className="text-sm text-neutral-brown">Due in 2 weeks</p>
                  </div>
                  <AlertCircle className="h-6 w-6 text-secondary-700" />
                </div>

                <Button className="btn-outline w-full">
                  View Full Schedule
                </Button>
              </div>
            </div>
          </Card>

          {/* Daily Diet Log */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-neutral-charcoal flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary-pink" />
                  Daily Diet Log
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-neutral-charcoal">Breakfast</span>
                  <span className="text-accent-green font-semibold">✓ Logged</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-neutral-charcoal">Lunch</span>
                  <span className="text-secondary-700 font-semibold">Pending</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-neutral-charcoal">Dinner</span>
                  <span className="text-gray-400 font-semibold">Not yet</span>
                </div>

                <Button className="btn-primary w-full">
                  Log Meal
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Wellness Tips */}
        <div className="animate-slideUp">
          <h2 className="text-2xl font-bold text-neutral-charcoal mb-4">
            Today's Wellness Tips
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {healthTips.map((tip, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-4 text-center">
                  <div className="text-4xl mb-2">{tip.icon}</div>
                  <h4 className="font-semibold text-neutral-charcoal mb-1">{tip.title}</h4>
                  <p className="text-sm text-neutral-brown">{tip.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Community Activity Banner */}
        <Card className="bg-gradient-to-r from-accent-skyblue/10 to-accent-green/10 border-accent-skyblue/30 animate-slideUp">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-neutral-charcoal mb-2">
                  Join Community Health Session
                </h3>
                <p className="text-neutral-brown mb-2">
                  Live session on "Nutrition During Pregnancy" with Dr. Anjali Verma
                </p>
                <p className="text-sm text-neutral-brown">
                  📅 Today at 4:00 PM • 🌐 Online via Broadcast Room
                </p>
              </div>
              <Button className="btn-primary whitespace-nowrap">
                Join Now
              </Button>
            </div>
          </div>
        </Card>

      </div>
    </MainLayout>
  );
};

export default WomenDashboard;
