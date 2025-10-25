import React from 'react';
import { TimeSlot } from '../../types/appointment';
import { Clock } from '../ui/Icons';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  slots,
  selectedSlot,
  onSelectSlot,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-pink-500" />
        Select Time Slot
      </h3>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {slots.map((slot, index) => (
          <button
            key={index}
            onClick={() => slot.isAvailable && onSelectSlot(slot)}
            disabled={!slot.isAvailable}
            className={`
              py-3 px-4 rounded-lg font-medium text-sm transition-all
              ${
                slot.isAvailable
                  ? selectedSlot?.startTime === slot.startTime
                    ? 'bg-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-500 hover:bg-pink-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            {slot.startTime}
          </button>
        ))}
      </div>

      {slots.filter((s) => s.isAvailable).length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No available slots for this date. Please select another date.
        </p>
      )}
    </div>
  );
};
