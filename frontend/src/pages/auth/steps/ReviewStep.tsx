import React from 'react';
import { Button } from '../../../components/ui/Button';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { OnboardingFormData } from '../../../utils/storageUtils';
import { User, CheckCircle, Calendar, MapPin, Activity } from '../../../components/ui/Icons';

interface ReviewStepProps {
  data: Partial<OnboardingFormData>;
  onSubmit: () => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ 
  data, 
  onSubmit, 
  onBack, 
  isLoading, 
  error 
}) => {
  const { basicInfo, role, patientProfile, doctorProfile, medicalInfo } = data;

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
    );
  };

  const InfoList = ({ label, items }: { label: string; items: string[] | undefined }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="py-2">
        <p className="text-sm text-gray-600 mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 sm:p-6">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
          Review Your Information
        </h3>
        <p className="text-center text-gray-600 text-sm sm:text-base">
          Please review your details before completing registration
        </p>
      </div>

      {/* Basic Information */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-pink-500" />
          Basic Information
        </h4>
        <div className="space-y-1">
          <InfoRow label="Name" value={`${basicInfo?.firstName} ${basicInfo?.lastName}`} />
          <InfoRow label="Email" value={basicInfo?.email} />
          <InfoRow label="Phone" value={basicInfo?.phoneNumber} />
          <InfoRow label="Role" value={role === 'patient' ? 'Patient' : 'Doctor'} />
        </div>
      </div>

      {/* Patient Profile */}
      {role === 'patient' && patientProfile && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-pink-500" />
              Health Profile
            </h4>
            <div className="space-y-1">
              <InfoRow label="Date of Birth" value={patientProfile.dateOfBirth} />
              <InfoRow 
                label="Pregnancy Status" 
                value={patientProfile.pregnancyStage?.replace(/_/g, ' ')} 
              />
              {patientProfile.dueDate && (
                <InfoRow label="Due Date" value={patientProfile.dueDate} />
              )}
              <InfoRow 
                label="Preferred Language" 
                value={
                  patientProfile.preferredLanguage === 'hi' ? 'Hindi' : 
                  patientProfile.preferredLanguage === 'ta' ? 'Tamil' : 'English'
                } 
              />
            </div>
          </div>

          {(patientProfile.emergencyContact || patientProfile.address) && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-pink-500" />
                Contact & Location
              </h4>
              <div className="space-y-1">
                <InfoRow label="Emergency Contact" value={patientProfile.emergencyContact} />
                <InfoRow label="Emergency Phone" value={patientProfile.emergencyPhone} />
                <InfoRow label="Address" value={patientProfile.address} />
                <InfoRow label="Village/Town" value={patientProfile.village} />
                <InfoRow label="District" value={patientProfile.district} />
                <InfoRow label="State" value={patientProfile.state} />
                <InfoRow label="Pincode" value={patientProfile.pincode} />
              </div>
            </div>
          )}

          {medicalInfo && (medicalInfo.medicalHistory?.length || medicalInfo.allergies?.length || medicalInfo.currentMedications?.length) && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-pink-500" />
                Medical Information
              </h4>
              <div className="space-y-4">
                <InfoList label="Medical History" items={medicalInfo.medicalHistory} />
                <InfoList label="Allergies" items={medicalInfo.allergies} />
                <InfoList label="Current Medications" items={medicalInfo.currentMedications} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Doctor Profile */}
      {role === 'doctor' && doctorProfile && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-500" />
              Professional Details
            </h4>
            <div className="space-y-1">
              <InfoRow label="License Number" value={doctorProfile.licenseNumber} />
              <InfoRow label="Specialization" value={doctorProfile.specialization} />
              <InfoRow label="Qualification" value={doctorProfile.qualification} />
              <InfoRow label="Experience" value={`${doctorProfile.experience} years`} />
              <InfoRow label="Hospital/Clinic" value={doctorProfile.hospitalName} />
              <InfoRow label="Clinic Address" value={doctorProfile.clinicAddress} />
              {doctorProfile.consultationFee && (
                <InfoRow label="Consultation Fee" value={`₹${doctorProfile.consultationFee}`} />
              )}
            </div>
          </div>

          {doctorProfile.bio && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Professional Bio
              </h4>
              <p className="text-sm text-gray-700">{doctorProfile.bio}</p>
            </div>
          )}

          {doctorProfile.languages && doctorProfile.languages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Languages & Services
              </h4>
              <InfoList label="Languages Spoken" items={doctorProfile.languages} />
              <div className="mt-4 space-y-2">
                {doctorProfile.servesRuralAreas && (
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Serves rural and remote areas
                  </div>
                )}
                {doctorProfile.telemedicineEnabled && (
                  <div className="flex items-center text-sm text-gray-700">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Offers telemedicine consultations
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Terms & Conditions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          By creating an account, you agree to our Terms of Service and Privacy Policy. 
          Your information will be securely stored and only used to provide healthcare services.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="w-full sm:w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2.5 sm:py-3"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="w-full sm:w-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="sm" color="white" className="mr-2" />
              Creating Account...
            </div>
          ) : (
            'Complete Registration'
          )}
        </Button>
      </div>
    </div>
  );
};
