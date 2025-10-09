import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState } from '../../store/store';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { registerUser } from '../../store/slices/authSlice';
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex">
        {/* Centered Onboarding Form */}
        <div className="w-full flex items-center justify-center p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-3xl">
            {/* Header */}
            <motion.div 
              className="text-center mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center mb-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg"
                  animate={{ 
                    scale: [1, 1.15, 1],
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Heart className="h-8 w-8 text-white fill-white" />
                </motion.div>
              </div>
              <h1 
                className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 text-gray-800"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                Create Your Account
              </h1>
              <p 
                className="text-gray-600 text-sm sm:text-base md:text-lg font-light italic"
                style={{ fontFamily: 'Nunito, sans-serif' }}
              >
                Your wellness journey starts here
              </p>
            </motion.div>

            {/* Step Indicator */}
            <motion.div 
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <StepIndicator steps={steps} currentStep={currentStep} />
            </motion.div>

            {/* Form Card with Enhanced Gradient */}
            <motion.div
              className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl bg-white/80 backdrop-blur-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100/40 via-purple-100/40 to-blue-100/40 opacity-60"></div>
              
              <div className="relative z-10">
                <h2 
                  className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6 text-center"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  {steps[currentStep - 1]}
                </h2>
                
                <div className="min-h-[300px]">
                  {renderStep()}
                </div>
              </div>
            </motion.div>

            {/* Login Link */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-sm text-gray-700 font-medium" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-pink-600 hover:text-pink-700 transition-all duration-200"
                >
                  Sign In
                </Link>
              </p>
            </motion.div>

            {/* Support Info */}
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <p className="text-xs text-gray-600" style={{ fontFamily: 'Nunito, sans-serif' }}>
                Need help? Call: <span className="font-semibold text-pink-600">+91-XXXX-XXXX-XX</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Available in <span className="font-medium">हिंदी | தமிழ் | English</span>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
