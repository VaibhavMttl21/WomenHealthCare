import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { updateDoctorAvailability, clearError, clearSuccess } from '../../store/slices/appointmentSlice';
import { TimeSlot } from '../../types/appointment';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Calendar, Clock, Plus, AlertCircle } from '../../components/ui/Icons';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00',
];

const ManageAvailabilityPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.appointments);
  
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: [],
  });

  const handleAddSlot = (day: string, time: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...prev[day], time].sort(),
    }));
  };

  const handleRemoveSlot = (day: string, time: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: prev[day].filter(t => t !== time),
    }));
  };

  const handleSave = async () => {
    const slots: TimeSlot[] = [];
    Object.entries(availability).forEach(([day, times]) => {
      times.forEach(time => {
        slots.push({
          startTime: time,
          endTime: addMinutes(time, 30),
          isAvailable: true,
        });
      });
    });

    await dispatch(updateDoctorAvailability(slots));
  };

  const addMinutes = (time: string, minutes: number): string => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  };

  const isSlotSelected = (day: string, time: string) => {
    return availability[day].includes(time);
  };

  const getAvailableTimes = (day: string) => {
    return TIME_SLOTS.filter(time => !availability[day].includes(time));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/doctor/appointments')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <span>←</span> Back to Appointments
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Manage Availability
          </h1>
          <p className="text-gray-600">
            Set your weekly schedule and available time slots
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
            onClick={handleSave}
            variant="default"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {DAYS_OF_WEEK.map(day => (
            <Card key={day}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-pink-600" />
                    <h3 className="text-xl font-bold text-gray-800">{day}</h3>
                    <span className="text-sm text-gray-600">
                      ({availability[day].length} slots)
                    </span>
                  </div>
                </div>

                {availability[day].length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Slots</h4>
                    <div className="flex flex-wrap gap-2">
                      {availability[day].map(time => (
                        <div
                          key={time}
                          className="px-3 py-1.5 bg-pink-100 text-pink-800 rounded-lg flex items-center gap-2 text-sm"
                        >
                          <Clock className="w-3 h-3" />
                          {time} - {addMinutes(time, 30)}
                          <button
                            onClick={() => handleRemoveSlot(day, time)}
                            className="ml-1 text-pink-600 hover:text-pink-800 font-bold"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Add Time Slots</h4>
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                    {getAvailableTimes(day).map(time => (
                      <button
                        key={time}
                        onClick={() => handleAddSlot(day, time)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:border-pink-500 hover:bg-pink-50 transition-colors text-sm text-gray-700"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Days</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Object.values(availability).filter(slots => slots.length > 0).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Slots</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Object.values(availability).reduce((sum, slots) => sum + slots.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Hours/Week</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {(Object.values(availability).reduce((sum, slots) => sum + slots.length, 0) * 0.5).toFixed(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManageAvailabilityPage;
