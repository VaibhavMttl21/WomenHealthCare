import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { OnboardingFormData } from '../../../utils/storageUtils';
import { FileText, Briefcase, Award, MapPin } from '../../../components/ui/Icons';

interface DoctorProfileStepProps {
  data: Partial<OnboardingFormData>;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DoctorProfileStep: React.FC<DoctorProfileStepProps> = ({ 
  data, 
  updateData, 
  onNext, 
  onBack 
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    data.doctorProfile?.languages || []
  );

  const doctorProfile = data.doctorProfile || {
    licenseNumber: '',
    specialization: '',
    qualification: '',
    experience: '',
    hospitalName: '',
    clinicAddress: '',
    consultationFee: '',
    bio: '',
    languages: [],
    servesRuralAreas: true,
    telemedicineEnabled: true,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    updateData({
      ...data,
      doctorProfile: {
        ...doctorProfile,
        [name]: type === 'checkbox' ? checked : value,
      },
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleLanguageToggle = (lang: string) => {
    const newLanguages = selectedLanguages.includes(lang)
      ? selectedLanguages.filter(l => l !== lang)
      : [...selectedLanguages, lang];
    
    setSelectedLanguages(newLanguages);
    updateData({
      ...data,
      doctorProfile: {
        ...doctorProfile,
        languages: newLanguages,
      },
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!doctorProfile.licenseNumber.trim()) {
      newErrors.licenseNumber = 'Medical license number is required';
    }
    if (!doctorProfile.specialization.trim()) {
      newErrors.specialization = 'Specialization is required';
    }
    if (!doctorProfile.qualification.trim()) {
      newErrors.qualification = 'Qualification is required';
    }
    if (!doctorProfile.experience) {
      newErrors.experience = 'Years of experience is required';
    } else if (parseInt(doctorProfile.experience) < 0) {
      newErrors.experience = 'Experience cannot be negative';
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

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी (Hindi)' },
    { value: 'ta', label: 'தமிழ் (Tamil)' },
    { value: 'te', label: 'తెలుగు (Telugu)' },
    { value: 'bn', label: 'বাংলা (Bengali)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Professional Credentials */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-purple-500" />
          Professional Credentials
        </h3>

        <div className="space-y-2">
          <label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700">
            Medical License Number <span className="text-red-500">*</span>
          </label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            type="text"
            value={doctorProfile.licenseNumber}
            onChange={handleChange}
            placeholder="Enter your medical license number"
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
              errors.licenseNumber ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.licenseNumber && (
            <p className="text-xs text-red-500">{errors.licenseNumber}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="specialization" className="text-sm font-medium text-gray-700">
            Specialization <span className="text-red-500">*</span>
          </label>
          <select
            id="specialization"
            name="specialization"
            value={doctorProfile.specialization}
            onChange={handleChange}
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
              errors.specialization ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select specialization</option>
            <option value="Obstetrics & Gynecology">Obstetrics & Gynecology</option>
            <option value="General Physician">General Physician</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Family Medicine">Family Medicine</option>
            <option value="Internal Medicine">Internal Medicine</option>
            <option value="Cardiology">Cardiology</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Other">Other</option>
          </select>
          {errors.specialization && (
            <p className="text-xs text-red-500">{errors.specialization}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="qualification" className="text-sm font-medium text-gray-700">
            Qualification <span className="text-red-500">*</span>
          </label>
          <input
            id="qualification"
            name="qualification"
            type="text"
            value={doctorProfile.qualification}
            onChange={handleChange}
            placeholder="e.g., MBBS, MD, DNB"
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
              errors.qualification ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.qualification && (
            <p className="text-xs text-red-500">{errors.qualification}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="experience" className="text-sm font-medium text-gray-700">
            Years of Experience <span className="text-red-500">*</span>
          </label>
          <input
            id="experience"
            name="experience"
            type="number"
            min="0"
            value={doctorProfile.experience}
            onChange={handleChange}
            placeholder="Enter years of experience"
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base ${
              errors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.experience && (
            <p className="text-xs text-red-500">{errors.experience}</p>
          )}
        </div>
      </div>

      {/* Practice Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-purple-500" />
          Practice Information
        </h3>

        <div className="space-y-2">
          <label htmlFor="hospitalName" className="text-sm font-medium text-gray-700">
            Hospital/Clinic Name
          </label>
          <input
            id="hospitalName"
            name="hospitalName"
            type="text"
            value={doctorProfile.hospitalName}
            onChange={handleChange}
            placeholder="Name of your practice"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="clinicAddress" className="text-sm font-medium text-gray-700">
            Clinic Address
          </label>
          <input
            id="clinicAddress"
            name="clinicAddress"
            type="text"
            value={doctorProfile.clinicAddress}
            onChange={handleChange}
            placeholder="Full address of your clinic"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="consultationFee" className="text-sm font-medium text-gray-700">
            Consultation Fee (₹)
          </label>
          <input
            id="consultationFee"
            name="consultationFee"
            type="number"
            min="0"
            value={doctorProfile.consultationFee}
            onChange={handleChange}
            placeholder="Enter consultation fee"
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Professional Bio */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <Award className="h-5 w-5 mr-2 text-purple-500" />
          Professional Bio
        </h3>

        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium text-gray-700">
            About You
          </label>
          <textarea
            id="bio"
            name="bio"
            value={doctorProfile.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Tell patients about your experience and approach to care..."
            className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base resize-none"
          />
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Languages Spoken</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {languageOptions.map((lang) => (
            <label
              key={lang.value}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedLanguages.includes(lang.value)}
                onChange={() => handleLanguageToggle(lang.value)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{lang.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Service Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Service Options</h3>
        
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="servesRuralAreas"
              checked={doctorProfile.servesRuralAreas}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">I serve rural and remote areas</span>
          </label>

          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="telemedicineEnabled"
              checked={doctorProfile.telemedicineEnabled}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">I offer telemedicine consultations</span>
          </label>
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
