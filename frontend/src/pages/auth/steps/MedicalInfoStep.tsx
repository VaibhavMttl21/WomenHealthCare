import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { OnboardingFormData } from '../../../utils/storageUtils';
import { Activity, AlertCircle } from '../../../components/ui/Icons';

interface MedicalInfoStepProps {
  data: Partial<OnboardingFormData>;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const MedicalInfoStep: React.FC<MedicalInfoStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const medicalInfo = data.medicalInfo || {
    medicalHistory: [],
    allergies: [],
    currentMedications: [],
  };

  const [medicalHistoryInput, setMedicalHistoryInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');
  const [medicationInput, setMedicationInput] = useState('');

  const addItem = (type: 'medicalHistory' | 'allergies' | 'currentMedications', value: string) => {
    if (!value.trim()) return;
    
    const updatedInfo = {
      ...medicalInfo,
      [type]: [...medicalInfo[type], value.trim()],
    };
    
    updateData({
      ...data,
      medicalInfo: updatedInfo,
    });
  };

  const removeItem = (type: 'medicalHistory' | 'allergies' | 'currentMedications', index: number) => {
    const updatedInfo = {
      ...medicalInfo,
      [type]: medicalInfo[type].filter((_, i) => i !== index),
    };
    
    updateData({
      ...data,
      medicalInfo: updatedInfo,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-800">
              <strong>Optional but Important:</strong> Providing medical information helps us give you better personalized care and recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Medical History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Activity className="h-5 w-5 mr-2 text-pink-500" />
          Medical History
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Existing Medical Conditions
          </label>
          <p className="text-xs text-gray-500">
            e.g., Diabetes, Hypertension, Thyroid, PCOS, etc.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={medicalHistoryInput}
              onChange={(e) => setMedicalHistoryInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem('medicalHistory', medicalHistoryInput);
                  setMedicalHistoryInput('');
                }
              }}
              placeholder="Type condition and press Enter"
              className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
            <Button
              type="button"
              onClick={() => {
                addItem('medicalHistory', medicalHistoryInput);
                setMedicalHistoryInput('');
              }}
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white"
            >
              Add
            </Button>
          </div>

          {medicalInfo.medicalHistory.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {medicalInfo.medicalHistory.map((condition, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pink-100 text-pink-800"
                >
                  {condition}
                  <button
                    type="button"
                    onClick={() => removeItem('medicalHistory', index)}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
          Allergies
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Known Allergies
          </label>
          <p className="text-xs text-gray-500">
            e.g., Penicillin, Sulfa drugs, Peanuts, etc.
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={allergyInput}
              onChange={(e) => setAllergyInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem('allergies', allergyInput);
                  setAllergyInput('');
                }
              }}
              placeholder="Type allergy and press Enter"
              className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
            <Button
              type="button"
              onClick={() => {
                addItem('allergies', allergyInput);
                setAllergyInput('');
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
            >
              Add
            </Button>
          </div>

          {medicalInfo.allergies.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {medicalInfo.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                >
                  {allergy}
                  <button
                    type="button"
                    onClick={() => removeItem('allergies', index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {medicalInfo.allergies.length === 0 && (
            <p className="text-sm text-gray-500 italic mt-2">
              No known allergies
            </p>
          )}
        </div>
      </div>

      {/* Current Medications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Current Medications
        </h3>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Medications You're Currently Taking
          </label>
          <p className="text-xs text-gray-500">
            Include supplements and vitamins
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={medicationInput}
              onChange={(e) => setMedicationInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addItem('currentMedications', medicationInput);
                  setMedicationInput('');
                }
              }}
              placeholder="Type medication and press Enter"
              className="flex-1 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base"
            />
            <Button
              type="button"
              onClick={() => {
                addItem('currentMedications', medicationInput);
                setMedicationInput('');
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white"
            >
              Add
            </Button>
          </div>

          {medicalInfo.currentMedications.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {medicalInfo.currentMedications.map((medication, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                >
                  {medication}
                  <button
                    type="button"
                    onClick={() => removeItem('currentMedications', index)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          
          {medicalInfo.currentMedications.length === 0 && (
            <p className="text-sm text-gray-500 italic mt-2">
              No current medications
            </p>
          )}
        </div>
      </div>

      {/* Privacy Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>Your Privacy:</strong> All medical information is encrypted and stored securely. Only you and your healthcare providers can access this information.
        </p>
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
