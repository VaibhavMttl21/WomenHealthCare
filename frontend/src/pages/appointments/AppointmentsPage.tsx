import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Calendar, Clock, User, Heart, Plus, CheckCircle } from '../../components/ui/Icons';

const AppointmentsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Priya Sharma',
      specialty: 'Gynecologist',
      date: '2024-12-28',
      time: '10:00 AM',
      type: 'Regular Checkup',
      status: 'confirmed'
    },
    {
      id: 2,
      doctor: 'Dr. Rajesh Kumar',
      specialty: 'Radiologist',
      date: '2024-12-30',
      time: '2:00 PM',
      type: 'Ultrasound',
      status: 'confirmed'
    }
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: 'Dr. Priya Sharma',
      specialty: 'Gynecologist',
      date: '2024-12-15',
      time: '11:00 AM',
      type: 'Monthly Checkup',
      status: 'completed'
    },
    {
      id: 4,
      doctor: 'Dr. Anjali Patel',
      specialty: 'Nutritionist',
      date: '2024-12-10',
      time: '3:30 PM',
      type: 'Diet Consultation',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-pink-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">{t('appointments.myAppointments')}</h1>
          </div>
          <Button className="bg-pink-500 hover:bg-pink-600">
            <Plus className="h-4 w-4 mr-2" />
            {t('appointments.bookAppointment')}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'upcoming'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t('appointments.upcoming')}
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === 'past'
                ? 'bg-pink-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Past Appointments
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                              {appointment.doctor}
                            </h3>
                            <p className="text-sm text-gray-600">{appointment.specialty}</p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(appointment.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                {appointment.time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                          <p className="text-sm text-gray-600 mt-2">{appointment.type}</p>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              {t('appointments.reschedule')}
                            </Button>
                            <Button size="sm" className="bg-green-500 hover:bg-green-600">
                              {t('appointments.join')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      {t('appointments.noAppointments')}
                    </h3>
                    <p className="text-gray-500 mb-4">You don't have any upcoming appointments</p>
                    <Button className="bg-pink-500 hover:bg-pink-600">
                      {t('appointments.bookAppointment')}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {appointment.doctor}
                          </h3>
                          <p className="text-sm text-gray-600">{appointment.specialty}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(appointment.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="h-4 w-4 mr-1" />
                              {appointment.time}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <p className="text-sm text-gray-600 mt-2">{appointment.type}</p>
                        <Button size="sm" variant="outline" className="mt-3">
                          View Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsPage;
