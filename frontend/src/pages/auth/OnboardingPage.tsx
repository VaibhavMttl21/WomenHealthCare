import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { registerUser } from '../../store/slices/authSlice';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Heart } from '../../components/ui/Icons';
import { StepIndicator } from '../../components/auth/StepIndicator';
import { saveFormData, getFormData, clearFormData, OnboardingFormData } from '../../utils/storageUtils';
import { 
  BasicInfoStep, 
  PatientProfileStep, 
  DoctorProfileStep, 
  MedicalInfoStep, 
  ReviewStep 
} from './steps';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useSelector((state: RootState) => state.auth) as any;

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingFormData>>({
    step: 1,
    role: 'patient',
    basicInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  });

  // Load saved form data on mount
  useEffect(() => {
    const savedData = getFormData();
    if (Object.keys(savedData).length > 0) {
      setFormData(savedData);
      setCurrentStep(savedData.step || 1);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (currentStep > 1 || (formData.basicInfo && formData.basicInfo.email)) {
      const dataToSave = { ...formData, step: currentStep };
      saveFormData(dataToSave);
    }
  }, [formData, currentStep]);

  const getSteps = () => {
    const baseSteps = ['Basic Info'];
    
    if (formData.role === 'patient') {
      return [...baseSteps, 'Profile', 'Medical Info', 'Review'];
    } else {
      return [...baseSteps, 'Professional Info', 'Review'];
    }
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.basicInfo) return;

      // Prepare complete registration data with profile
      const registrationData: any = {
        firstName: formData.basicInfo.firstName,
        lastName: formData.basicInfo.lastName,
        email: formData.basicInfo.email,
        phoneNumber: formData.basicInfo.phoneNumber,
        password: formData.basicInfo.password,
        role: formData.role || 'patient',
      };

      // Add profile data based on role
      if (formData.role === 'patient' && formData.patientProfile) {
        registrationData.profile = {
          ...formData.patientProfile,
          medicalHistory: formData.medicalInfo?.medicalHistory || [],
          allergies: formData.medicalInfo?.allergies || [],
          currentMedications: formData.medicalInfo?.currentMedications || [],
        };
      } else if (formData.role === 'doctor' && formData.doctorProfile) {
        registrationData.profile = formData.doctorProfile;
      }

      await dispatch(registerUser(registrationData)).unwrap();
      
      // Clear saved form data after successful registration
      clearFormData();
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={formData}
            updateData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        if (formData.role === 'patient') {
          return (
            <PatientProfileStep
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <DoctorProfileStep
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        }
      case 3:
        if (formData.role === 'patient') {
          return (
            <MedicalInfoStep
              data={formData}
              updateData={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          );
        } else {
          return (
            <ReviewStep
              data={formData}
              onSubmit={handleSubmit}
              onBack={handleBack}
              isLoading={isLoading}
              error={error}
            />
          );
        }
      case 4:
        return (
          <ReviewStep
            data={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isLoading={isLoading}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-6 px-4 sm:py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-pink-500 mr-2" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Rural Health Care</h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Complete your profile to get personalized healthcare support
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mb-6 sm:mb-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl text-center text-gray-800">
              {steps[currentStep - 1]}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-pink-600 hover:text-pink-500"
            >
              Sign In
            </Link>
          </p>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Need help? Call: +91-XXXX-XXXX-XX
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Available in हिंदी | தமிழ் | English
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
