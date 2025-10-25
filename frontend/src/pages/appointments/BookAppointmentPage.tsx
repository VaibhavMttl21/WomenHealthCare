import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  fetchDoctors,
  fetchDoctorAvailability,
  createAppointment,
  clearError,
  clearAvailability,
} from '../../store/slices/appointmentSlice';
import { Doctor, TimeSlot, AppointmentType } from '../../types/appointment';
import { DoctorCard } from '../../components/appointments/DoctorCard';
import { TimeSlotPicker } from '../../components/appointments/TimeSlotPicker';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, CheckCircle } from '../../components/ui/Icons';

const BookAppointmentPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { doctors, availability, loading, error, success } = useAppSelector(
    (state) => state.appointments
  );
  const { user } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    AppointmentType.CONSULTATION
  );
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/appointments');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      dispatch(fetchDoctorAvailability({ doctorId: selectedDoctor.id, date: selectedDate }));
    }
  }, [selectedDoctor, selectedDate, dispatch]);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
    dispatch(clearAvailability());
    setSelectedDate('');
    setSelectedSlot(null);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleNext = () => {
    if (step === 2 && selectedDate && selectedSlot) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step === 3) {
      setStep(2);
    } else if (step === 2) {
      setStep(1);
      setSelectedDoctor(null);
      dispatch(clearAvailability());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !selectedDoctor || !selectedDate || !selectedSlot) {
      return;
    }

    await dispatch(
      createAppointment({
        patientId: user.id,
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        appointmentTime: selectedSlot.startTime,
        duration: selectedSlot.duration,
        type: appointmentType,
        reason,
        symptoms: symptoms ? symptoms.split(',').map((s) => s.trim()) : [],
        isOnline,
      })
    );
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
            <p className="text-gray-600 mb-4">{success}</p>
            <p className="text-sm text-gray-500">Redirecting to appointments...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => (step > 1 ? handleBack() : navigate('/appointments'))}
              className="mr-4 p-2 hover:bg-white rounded-full transition-colors"
              aria-label="Go back"
            >
              <span className="text-2xl">←</span>
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Book Appointment</h1>
              <p className="text-gray-600 mt-1">
                {step === 1 && 'Select a doctor'}
                {step === 2 && 'Choose date and time'}
                {step === 3 && 'Confirm appointment details'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= s ? 'bg-pink-500 text-white' : 'bg-gray-200 text-gray-500'
                } font-semibold`}
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={`w-24 h-1 ${step > s ? 'bg-pink-500' : 'bg-gray-200'}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            <p>{error}</p>
            <button
              onClick={() => dispatch(clearError())}
              className="text-sm underline mt-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step Content */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Doctors</h2>
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : doctors.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No doctors available at the moment.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor: Doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    onSelect={handleDoctorSelect}
                    selected={selectedDoctor?.id === doctor.id}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Selected Doctor</h2>
                <DoctorCard doctor={selectedDoctor} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                  Select Date
                </h3>
                <label htmlFor="appointment-date" className="sr-only">Select appointment date</label>
                <input
                  id="appointment-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </CardContent>
            </Card>

            {selectedDate && (
              <Card>
                <CardContent className="p-6">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner />
                    </div>
                  ) : availability?.slots ? (
                    <TimeSlotPicker
                      slots={availability.slots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleSlotSelect}
                    />
                  ) : null}
                </CardContent>
              </Card>
            )}

            {selectedSlot && (
              <div className="flex justify-end">
                <Button onClick={handleNext} className="bg-pink-500 hover:bg-pink-600">
                  Next
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Appointment Details
                </h2>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="appointment-type" className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      id="appointment-type"
                      value={appointmentType}
                      onChange={(e) => setAppointmentType(e.target.value as AppointmentType)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      required
                    >
                      <option value={AppointmentType.CONSULTATION}>Consultation</option>
                      <option value={AppointmentType.CHECKUP}>Checkup</option>
                      <option value={AppointmentType.FOLLOW_UP}>Follow Up</option>
                      <option value={AppointmentType.EMERGENCY}>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Brief description of your concern..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="e.g., fever, headache, nausea"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={(e) => setIsOnline(e.target.checked)}
                        className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Online Consultation
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Review & Confirm</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">
                      Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{selectedSlot?.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{appointmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode:</span>
                    <span className="font-medium">{isOnline ? 'Online' : 'In-person'}</span>
                  </div>
                  {selectedDoctor?.profile?.consultationFee && (
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">Fee:</span>
                      <span className="font-semibold text-pink-600">
                        ₹{selectedDoctor.profile.consultationFee}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                onClick={handleBack}
                className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointmentPage;
