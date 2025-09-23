import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { Calendar, MessageCircle, User, FileText, Clock, Heart } from '../../components/ui/Icons';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const quickActions = [
    {
      title: t('dashboard.bookAppointment'),
      description: t('appointments.consultation'),
      icon: Calendar,
      onClick: () => navigate('/appointments'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: t('dashboard.startChat'),
      description: t('chat.healthAssistant'),
      icon: MessageCircle,
      onClick: () => navigate('/chat'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: t('dashboard.updateProfile'),
      description: t('profile.personalInfo'),
      icon: User,
      onClick: () => navigate('/profile'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: t('dashboard.viewReports'),
      description: t('profile.medicalInfo'),
      icon: FileText,
      onClick: () => navigate('/reports'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {t('dashboard.welcomeBack')}, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-2">
              {new Date().toLocaleDateString('ta-IN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
          >
            {t('common.logout')}
          </Button>
        </div>

        {/* Health Overview Card */}
        <Card className="mb-8 bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              {t('dashboard.healthOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-pink-600">28</div>
                <div className="text-sm text-gray-600">{t('dashboard.pregnancyWeek')}</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-600">Weeks Remaining</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">5</div>
                <div className="text-sm text-gray-600">Checkups Done</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
              onClick={action.onClick}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                {t('dashboard.upcomingAppointments')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-gray-800">Dr. Priya Sharma</div>
                  <div className="text-sm text-gray-600">Regular Checkup</div>
                  <div className="text-sm text-blue-600">Tomorrow, 10:00 AM</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-gray-800">Dr. Rajesh Kumar</div>
                  <div className="text-sm text-gray-600">Ultrasound</div>
                  <div className="text-sm text-green-600">Dec 28, 2:00 PM</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/appointments')}
              >
                View All Appointments
              </Button>
            </CardContent>
          </Card>

          {/* Recent Chats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-green-500" />
                {t('dashboard.recentChats')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-gray-800">Health Assistant</div>
                  <div className="text-sm text-gray-600">Questions about nutrition during pregnancy</div>
                  <div className="text-sm text-green-600">2 hours ago</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-gray-800">Emergency Support</div>
                  <div className="text-sm text-gray-600">Sudden morning sickness concerns</div>
                  <div className="text-sm text-purple-600">Yesterday</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4"
                onClick={() => navigate('/chat')}
              >
                Start New Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
