import React from 'react';
import { Doctor } from '../../types/appointment';
import { Card, CardContent } from '../ui/Card';
import { MapPin, Phone, Award, Calendar } from '../ui/Icons';

interface DoctorCardProps {
  doctor: Doctor;
  onSelect?: (doctor: Doctor) => void;
  selected?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onSelect, selected }) => {
  const { firstName, lastName, phoneNumber, profile } = doctor;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${
        selected ? 'ring-2 ring-pink-500 shadow-lg' : ''
      }`}
      onClick={() => onSelect && onSelect(doctor)}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
              {firstName[0]}{lastName[0]}
            </div>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">
              Dr. {firstName} {lastName}
            </h3>

            {profile && (
              <>
                <p className="text-sm text-pink-600 font-medium flex items-center mt-1">
                  <Award className="h-4 w-4 mr-1" />
                  {profile.specialization}
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  {profile.qualification}
                </p>

                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {profile.experience} years exp.
                  </span>

                  {profile.rating && profile.rating > 0 && (
                    <span className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      {profile.rating.toFixed(1)} ({profile.totalRatings})
                    </span>
                  )}
                </div>

                {profile.hospitalName && (
                  <p className="text-sm text-gray-600 mt-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.hospitalName}
                  </p>
                )}

                {phoneNumber && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {phoneNumber}
                  </p>
                )}

                {profile.consultationFee && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-sm font-medium text-gray-700">
                      Consultation Fee:{' '}
                      <span className="text-pink-600">₹{profile.consultationFee}</span>
                    </span>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  {profile.telemedicineEnabled && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Online Available
                    </span>
                  )}
                  {profile.servesRuralAreas && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Rural Service
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
