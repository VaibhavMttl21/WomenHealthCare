import React from 'react';
import { Appointment } from '../../types/appointment';
import { Card, CardContent } from '../ui/Card';
import { Calendar, Clock, User, CheckCircle, AlertCircle } from '../ui/Icons';

interface AppointmentCardProps {
  appointment: Appointment;
  onView?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  showPatientInfo?: boolean;
  showDoctorInfo?: boolean;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onView,
  onCancel,
  showPatientInfo = false,
  showDoctorInfo = true,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'RESCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <span className="text-red-600">✕</span>;
      case 'RESCHEDULED':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className={`inline-flex items-center space-x-1 ${getStatusColor(appointment.status)} px-3 py-1 rounded-full text-xs font-medium`}>
              {getStatusIcon(appointment.status)}
              <span>{appointment.status}</span>
            </div>
            <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {appointment.type}
            </span>
          </div>
          {appointment.isOnline && (
            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
              Online
            </span>
          )}
        </div>

        {showDoctorInfo && appointment.doctor && (
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                {appointment.doctor.user?.firstName?.[0]}{appointment.doctor.user?.lastName?.[0]}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  Dr. {appointment.doctor.user?.firstName} {appointment.doctor.user?.lastName}
                </p>
                {appointment.doctor.specialization && (
                  <p className="text-sm text-gray-600">{appointment.doctor.specialization}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {showPatientInfo && appointment.patient && (
          <div className="mb-3">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-semibold text-gray-800">
                  {appointment.patient.firstName} {appointment.patient.lastName}
                </p>
                {appointment.patient.age && (
                  <p className="text-sm text-gray-600">Age: {appointment.patient.age}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-pink-500" />
            <span>{formatDate(appointment.appointmentDate)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-pink-500" />
            <span>{appointment.appointmentTime}</span>
            <span className="ml-1 text-gray-400">({appointment.duration} min)</span>
          </div>
        </div>

        {appointment.reason && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Reason:</span> {appointment.reason}
            </p>
          </div>
        )}

        <div className="mt-4 flex space-x-2">
          {onView && (
            <button
              onClick={() => onView(appointment)}
              className="flex-1 bg-pink-500 text-white py-2 px-4 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium"
            >
              View Details
            </button>
          )}
          {onCancel && (appointment.status === 'SCHEDULED' || appointment.status === 'RESCHEDULED') && (
            <button
              onClick={() => onCancel(appointment)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
