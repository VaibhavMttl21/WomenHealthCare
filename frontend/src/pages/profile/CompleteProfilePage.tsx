import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Heart, ArrowLeft, ArrowRight, Check } from '../../components/ui/Icons';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ReproductiveInfoStep from './steps/ReproductiveInfoStep';
import HealthPreferencesStep from './steps/HealthPreferencesStep';
import NutritionInfoStep from './steps/NutritionInfoStep';
import FamilySupportStep from './steps/FamilySupportStep';
import LocationInfoStep from './steps/LocationInfoStep';

interface ProfileFormData {
  personalInfo: any;
  reproductiveInfo: any;
  healthPreferences: any;
  nutritionInfo: any;
  familySupport: any;
  locationInfo: any;
}

const CompleteProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProfileFormData>({
    personalInfo: {},
    reproductiveInfo: {},
    healthPreferences: {},
    nutritionInfo: {},
    familySupport: {},
    locationInfo: {},
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    {
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      component: PersonalInfoStep,
      icon: '👤',
    },
    {
      title: 'Reproductive Health',
      subtitle: 'Your pregnancy journey',
      component: ReproductiveInfoStep,
      icon: '🤰',
    },
    {
      title: 'Health Preferences',
      subtitle: 'Your wellness goals',
      component: HealthPreferencesStep,
      icon: '💚',
    },
    {
      title: 'Nutrition',
      subtitle: 'Your dietary needs',
      component: NutritionInfoStep,
      icon: '🥗',
    },
    {
      title: 'Family Support',
      subtitle: 'Your support system',
      component: FamilySupportStep,
      icon: '👨‍👩‍👧',
    },
    {
      title: 'Location',
      subtitle: 'Where you live',
      component: LocationInfoStep,
      icon: '📍',
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepDataChange = (stepKey: string, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [stepKey]: data,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get user ID from storage or auth state
      const userId = localStorage.getItem('userId') || 'U12345';

      const profileData = {
        personalInfo: formData.personalInfo,
        reproductiveInfo: formData.reproductiveInfo,
        healthPreferences: formData.healthPreferences,
        nutritionInfo: formData.nutritionInfo,
        familySupport: formData.familySupport,
        ...formData.locationInfo,
      };

      const response = await fetch(
        `http://localhost:3002/api/profile/${userId}/complete`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(profileData),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Show success message
        alert('Profile completed successfully!');
        navigate('/dashboard');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error submitting profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-10 w-10 text-pink-500 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              Complete Your Profile
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Help us personalize your care journey
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-pink-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mb-8 overflow-x-auto pb-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col items-center min-w-[80px] ${
                index <= currentStep ? 'opacity-100' : 'opacity-40'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                  index < currentStep
                    ? 'bg-green-500 text-white'
                    : index === currentStep
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white scale-110'
                    : 'bg-gray-200'
                }`}
              >
                {index < currentStep ? <Check className="h-6 w-6" /> : step.icon}
              </div>
              <span className="text-xs text-center font-medium hidden sm:block">
                {step.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Current Step Card */}
        <Card className="mb-8 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{steps[currentStep].icon}</span>
              <div>
                <CardTitle className="text-2xl text-gray-800">
                  {steps[currentStep].title}
                </CardTitle>
                <p className="text-gray-600 mt-1">
                  {steps[currentStep].subtitle}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <CurrentStepComponent
              data={formData[Object.keys(formData)[currentStep] as keyof ProfileFormData]}
              onChange={(data: any) =>
                handleStepDataChange(Object.keys(formData)[currentStep], data)
              }
            />
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex items-center gap-2 px-8"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Complete Profile
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 flex items-center gap-2"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
