import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchAppointmentById,
  updateAppointment,
  cancelAppointment,
  clearError,
  clearSuccess,
} from '../../store/slices/appointmentSlice';
import { AppointmentStatus, AppointmentType } from '../../types/appointment';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, Phone, Mail, AlertCircle, User } from '../../components/ui/Icons';

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selectedAppointment, loading, error, success } = useAppSelector(
    (state) => state.appointments
  );
  const { user } = useAppSelector((state) => state.auth);
  const isDoctor = user?.role === 'doctor';

  const [isEditing, setIsEditing] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<AppointmentStatus>(AppointmentStatus.SCHEDULED);

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedAppointment) {
      setDiagnosis(selectedAppointment.diagnosis || '');
      setPrescription(selectedAppointment.prescription || '');
      setNotes(selectedAppointment.notes || '');
      setStatus(selectedAppointment.status as AppointmentStatus);
    }
  }, [selectedAppointment]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        setIsEditing(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      if (id) {
        await dispatch(cancelAppointment(id));
        setTimeout(() => navigate('/appointments'), 1500);
      }
    }
  };

  const handleUpdate = async () => {
    if (id) {
      await dispatch(
        updateAppointment({
          id,
          data: {
            diagnosis: diagnosis || undefined,
            prescription: (prescription || undefined) as any,
            notes: notes || undefined,
            status,
          },
        })
      );
    }
  };

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (id) {
      await dispatch(
        updateAppointment({
          id,
          data: { status: newStatus },
        })
      );
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case AppointmentStatus.RESCHEDULED:
        return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.NO_SHOW:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: AppointmentType) => {
    switch (type) {
      case AppointmentType.CONSULTATION:
        return 'bg-purple-100 text-purple-800';
      case AppointmentType.CHECKUP:
        return 'bg-blue-100 text-blue-800';
      case AppointmentType.EMERGENCY:
        return 'bg-red-100 text-red-800';
      case AppointmentType.FOLLOW_UP:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!selectedAppointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Not Found</h2>
              <p className="text-gray-600 mb-6">
                The appointment you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => navigate('/appointments')} variant="default">
                Back to Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const appointment = selectedAppointment;
  const appointmentDate = new Date(appointment.appointmentDate);
  const canCancel =
    appointment.status === AppointmentStatus.SCHEDULED ||
    appointment.status === AppointmentStatus.RESCHEDULED;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <span>←</span> Back
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Appointment Details
          </h1>
          <p className="text-gray-600">
            View and manage appointment information
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                      {appointment.type.replace('_', ' ')}
                    </h2>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appointment.status as AppointmentStatus)}`}>
                        {appointment.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(appointment.type as AppointmentType)}`}>
                        {appointment.type.replace('_', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${appointment.isOnline ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                        {appointment.isOnline ? 'Online' : 'In-Person'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-pink-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium text-gray-800">
                          {appointmentDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-pink-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium text-gray-800">{appointment.appointmentTime}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {!isDoctor && appointment.doctor && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-pink-600 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Doctor</p>
                          <p className="font-medium text-gray-800">
                            {appointment.doctor.user?.firstName} {appointment.doctor.user?.lastName}
                          </p>
                          {appointment.doctor.specialization && (
                            <p className="text-sm text-gray-600">
                              {appointment.doctor.specialization}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {isDoctor && appointment.patient && (
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-pink-600 mt-1" />
                        <div>
                          <p className="text-sm text-gray-600">Patient</p>
                          <p className="font-medium text-gray-800">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.patient.email}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {appointment.reason && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-semibold text-gray-800 mb-2">Reason for Visit</h3>
                    <p className="text-gray-700">{appointment.reason}</p>
                  </div>
                )}

                {appointment.symptoms && (
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Symptoms</h3>
                    <p className="text-gray-700">
                      {(() => {
                        try {
                          const parsed = JSON.parse(appointment.symptoms);
                          return Array.isArray(parsed) ? parsed.join(', ') : appointment.symptoms;
                        } catch {
                          return appointment.symptoms;
                        }
                      })()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {isDoctor && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Medical Details</h3>
                    {!isEditing && (
                      <Button onClick={() => setIsEditing(true)} variant="outline">
                        Edit Details
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Diagnosis
                      </label>
                      {isEditing ? (
                        <textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows={3}
                          placeholder="Enter diagnosis..."
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {diagnosis || 'No diagnosis added yet'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prescription
                      </label>
                      {isEditing ? (
                        <textarea
                          value={prescription}
                          onChange={(e) => setPrescription(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows={3}
                          placeholder="Enter prescription..."
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {prescription || 'No prescription added yet'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      {isEditing ? (
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          rows={3}
                          placeholder="Enter notes..."
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {notes || 'No notes added yet'}
                        </p>
                      )}
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleUpdate} variant="default">
                          Save Changes
                        </Button>
                        <Button
                          onClick={() => {
                            setIsEditing(false);
                            setDiagnosis(appointment.diagnosis || '');
                            setPrescription(appointment.prescription || '');
                            setNotes(appointment.notes || '');
                          }}
                          variant="outline"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isDoctor && (appointment.diagnosis || appointment.prescription || appointment.notes) && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Medical Details</h3>
                  <div className="space-y-4">
                    {appointment.diagnosis && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Diagnosis</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {appointment.diagnosis}
                        </p>
                      </div>
                    )}
                    {appointment.prescription && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Prescription</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {appointment.prescription}
                        </p>
                      </div>
                    )}
                    {appointment.notes && (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {appointment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            {!isDoctor && appointment.doctor && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Doctor Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {appointment.doctor.user?.firstName?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {appointment.doctor.user?.firstName} {appointment.doctor.user?.lastName}
                        </p>
                        {appointment.doctor.specialization && (
                          <p className="text-sm text-gray-600">
                            {appointment.doctor.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                    {appointment.doctor.user?.phoneNumber && (
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{appointment.doctor.user.phoneNumber}</span>
                      </div>
                    )}
                    {appointment.doctor.user?.email && (
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{appointment.doctor.user.email}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {isDoctor && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {appointment.status === AppointmentStatus.SCHEDULED && (
                      <Button
                        onClick={() => handleStatusChange(AppointmentStatus.COMPLETED)}
                        variant="default"
                        className="w-full"
                      >
                        Mark as Completed
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        onClick={handleCancel}
                        variant="destructive"
                        className="w-full"
                      >
                        Cancel Appointment
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {!isDoctor && canCancel && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
                  <Button
                    onClick={handleCancel}
                    variant="destructive"
                    className="w-full"
                  >
                    Cancel Appointment
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
