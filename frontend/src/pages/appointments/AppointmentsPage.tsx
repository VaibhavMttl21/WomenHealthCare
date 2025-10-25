import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchAppointments,
  cancelAppointment,
  clearError,
  clearSuccess,
} from '../../store/slices/appointmentSlice';
import { AppointmentCard } from '../../components/appointments/AppointmentCard';
import { AppointmentStatus } from '../../types/appointment';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, AlertCircle } from '../../components/ui/Icons';

const AppointmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { appointments, loading, error, success } = useAppSelector(
    (state) => state.appointments
  );
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleViewAppointment = (appointment: any) => {
    navigate(`/appointments/${appointment.id}`);
  };

  const handleCancelAppointment = async (appointment: any) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await dispatch(cancelAppointment(appointment.id));
      dispatch(fetchAppointments());
    }
  };

  const handleBookNew = () => {
    navigate('/appointments/book');
  };

  const now = new Date();
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate);
    const isPast =
      appointmentDate < now ||
      appointment.status === AppointmentStatus.COMPLETED ||
      appointment.status === AppointmentStatus.CANCELLED ||
      appointment.status === AppointmentStatus.NO_SHOW;

    return activeTab === 'past' ? isPast : !isPast;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-600">
            View and manage your healthcare appointments
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg">✓</span>
            </div>
            <div>
              <p className="text-green-800 font-medium">{success}</p>
            </div>
            <button
              onClick={() => dispatch(clearSuccess())}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
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

        <div className="mb-6 flex gap-4">
          <Button
            onClick={handleBookNew}
            variant="default"
          >
            + Book New Appointment
          </Button>
        </div>

        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-8">
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
                <Clock className="w-5 h-5" />
                Past
              </div>
              {activeTab === 'past' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
              )}
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!loading && (
          <>
            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {activeTab === 'upcoming' ? (
                    <Calendar className="w-10 h-10 text-gray-400" />
                  ) : (
                    <Clock className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {activeTab === 'upcoming'
                    ? 'No Upcoming Appointments'
                    : 'No Past Appointments'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'upcoming'
                    ? "You don't have any upcoming appointments scheduled."
                    : "You don't have any past appointment records."}
                </p>
                {activeTab === 'upcoming' && (
                  <Button onClick={handleBookNew} variant="default">
                    Book Your First Appointment
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onView={handleViewAppointment}
                    onCancel={
                      appointment.status === AppointmentStatus.SCHEDULED ||
                      appointment.status === AppointmentStatus.RESCHEDULED
                        ? handleCancelAppointment
                        : undefined
                    }
                    showDoctorInfo={true}
                    showPatientInfo={false}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && appointments.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {appointments.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      appointments.filter((a) => {
                        const appointmentDate = new Date(a.appointmentDate);
                        return (
                          appointmentDate >= now &&
                          a.status === AppointmentStatus.SCHEDULED
                        );
                      }).length
                    }
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {
                      appointments.filter(
                        (a) => a.status === AppointmentStatus.COMPLETED
                      ).length
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
