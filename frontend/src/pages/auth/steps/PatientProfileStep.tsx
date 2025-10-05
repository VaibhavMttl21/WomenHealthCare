import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { OnboardingFormData } from '../../../utils/storageUtils';
import { Calendar, MapPin, Phone, Heart } from '../../../components/ui/Icons';

interface PatientProfileStepProps {
  data: Partial<OnboardingFormData>;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const PatientProfileStep: React.FC<PatientProfileStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const patientProfile = data.patientProfile || {
    dateOfBirth: '',
    pregnancyStage: 'NOT_PREGNANT',
    dueDate: '',
    lastPeriodDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    address: '',
    village: '',
    district: '',
    state: '',
    pincode: '',
    preferredLanguage: 'en',
    hasSmartphone: true,
    internetAccess: 'good',
    educationLevel: '',
    occupation: '',
    familyIncome: '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateData({
      ...data,
      patientProfile: {
        ...patientProfile,
        [name]: type === 'checkbox' ? checked : value,
      },
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation for required fields
    if (!patientProfile.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Heart className="h-5 w-5 mr-2 text-pink-500" />
          Personal Information
        </h3>

        {/* Date of Birth */}
        <div className="space-y-2">
          <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={patientProfile.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
                errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Pregnancy Stage */}
        <div className="space-y-2">
          <label htmlFor="pregnancyStage" className="text-sm font-medium text-gray-700">
            Pregnancy Status
          </label>
          <select
            id="pregnancyStage"
            name="pregnancyStage"
            value={patientProfile.pregnancyStage}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="NOT_PREGNANT">Not Pregnant</option>
            <option value="FIRST_TRIMESTER">First Trimester (1-12 weeks)</option>
            <option value="SECOND_TRIMESTER">Second Trimester (13-26 weeks)</option>
            <option value="THIRD_TRIMESTER">Third Trimester (27+ weeks)</option>
            <option value="POSTPARTUM">Postpartum</option>
          </select>
        </div>

        {/* Conditional: Due Date - only show if pregnant */}
        {patientProfile.pregnancyStage !== 'NOT_PREGNANT' && patientProfile.pregnancyStage !== 'POSTPARTUM' && (
          <div className="space-y-2">
            <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
              Expected Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={patientProfile.dueDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        )}

        {/* Preferred Language */}
        <div className="space-y-2">
          <label htmlFor="preferredLanguage" className="text-sm font-medium text-gray-700">
            Preferred Language
          </label>
          <select
            id="preferredLanguage"
            name="preferredLanguage"
            value={patientProfile.preferredLanguage}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
          </select>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Phone className="h-5 w-5 mr-2 text-pink-500" />
          Emergency Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="emergencyContact" className="text-sm font-medium text-gray-700">
              Emergency Contact Name
            </label>
            <input
              id="emergencyContact"
              name="emergencyContact"
              type="text"
              value={patientProfile.emergencyContact}
              onChange={handleChange}
              placeholder="Full name"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="emergencyPhone" className="text-sm font-medium text-gray-700">
              Emergency Contact Phone
            </label>
            <input
              id="emergencyPhone"
              name="emergencyPhone"
              type="tel"
              value={patientProfile.emergencyPhone}
              onChange={handleChange}
              placeholder="+91 XXXXX XXXXX"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <MapPin className="h-5 w-5 mr-2 text-pink-500" />
          Location Details
        </h3>

        <div className="space-y-2">
          <label htmlFor="address" className="text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={patientProfile.address}
            onChange={handleChange}
            placeholder="House/Street address"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="village" className="text-sm font-medium text-gray-700">
              Village/Town
            </label>
            <input
              id="village"
              name="village"
              type="text"
              value={patientProfile.village}
              onChange={handleChange}
              placeholder="Enter village or town"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="district" className="text-sm font-medium text-gray-700">
              District
            </label>
            <input
              id="district"
              name="district"
              type="text"
              value={patientProfile.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="state" className="text-sm font-medium text-gray-700">
              State
            </label>
            <input
              id="state"
              name="state"
              type="text"
              value={patientProfile.state}
              onChange={handleChange}
              placeholder="Enter state"
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="pincode" className="text-sm font-medium text-gray-700">
              Pincode
            </label>
            <input
              id="pincode"
              name="pincode"
              type="text"
              value={patientProfile.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              maxLength={6}
              className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {/* Access Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Digital Access
        </h3>

        <div className="space-y-2">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="hasSmartphone"
              checked={patientProfile.hasSmartphone}
              onChange={handleChange}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-sm text-gray-700">I have access to a smartphone</span>
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="internetAccess" className="text-sm font-medium text-gray-700">
            Internet Connectivity
          </label>
          <select
            id="internetAccess"
            name="internetAccess"
            value={patientProfile.internetAccess}
            onChange={handleChange}
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
          >
            <option value="good">Good - Consistent internet</option>
            <option value="poor">Poor - Intermittent internet</option>
            <option value="none">No internet access</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          onClick={onBack}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 sm:py-3"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
