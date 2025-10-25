import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchAppointments,
  fetchDoctorStatistics,
  clearError,
} from '../../store/slices/appointmentSlice';
import { AppointmentCard } from '../../components/appointments/AppointmentCard';
import { AppointmentStatus } from '../../types/appointment';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, Users, CheckCircle } from '../../components/ui/Icons';

const DoctorAppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { appointments, statistics, loading, error } = useAppSelector(
    (state) => state.appointments
  );
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'past'>('today');

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchDoctorStatistics());
  }, [dispatch]);

  const handleViewAppointment = (appointment: any) => {
    navigate(`/appointments/${appointment.id}`);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === today.getTime();
  });

  const upcomingAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return (
      appointmentDate.getTime() > today.getTime() &&
      (appointment.status === AppointmentStatus.SCHEDULED ||
        appointment.status === AppointmentStatus.RESCHEDULED)
    );
  });

  const pastAppointments = appointments.filter((appointment: any) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);
    return (
      appointmentDate.getTime() < today.getTime() ||
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.NO_SHOW
    );
  });

  const getActiveAppointments = () => {
    switch (activeTab) {
      case 'today':
        return todayAppointments;
      case 'upcoming':
        return upcomingAppointments;
      case 'past':
        return pastAppointments;
      default:
        return [];
    }
  };

  const activeAppointments = getActiveAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            Manage your appointments and view patient details
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        )}

        {loading && !statistics ? (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Total</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {statistics?.total || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Today</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {statistics?.today || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {statistics?.upcoming || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Completed</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {statistics?.completed || 0}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-6 flex justify-between items-center">
              <div className="border-b border-gray-200 flex gap-8">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === 'today'
                      ? 'text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Today
                  </div>
                  {activeTab === 'today' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === 'upcoming'
                      ? 'text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Upcoming
                  </div>
                  {activeTab === 'upcoming' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`pb-4 px-2 font-medium transition-all relative ${
                    activeTab === 'past'
                      ? 'text-pink-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Past
                  </div>
                  {activeTab === 'past' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
                  )}
                </button>
              </div>
              <Button
                onClick={() => navigate('/doctor/availability')}
                variant="outline"
              >
                Manage Availability
              </Button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : activeAppointments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No {activeTab} Appointments
                  </h3>
                  <p className="text-gray-600">
                    You don't have any {activeTab} appointments.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeAppointments.map((appointment: any) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onView={handleViewAppointment}
                    showDoctorInfo={false}
                    showPatientInfo={true}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentsPage;
