import React, { useState } from 'react';
import { Mail, Lock, Phone, Eye, EyeOff, User, Users } from '../../../components/ui/Icons';
import { Button } from '../../../components/ui/Button';
import { OnboardingFormData } from '../../../utils/storageUtils';

interface BasicInfoStepProps {
  data: Partial<OnboardingFormData>;
  updateData: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ data, updateData, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const basicInfo = data.basicInfo || {
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    updateData({
      ...data,
      basicInfo: {
        ...basicInfo,
        [name]: value,
      },
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRoleChange = (role: 'patient' | 'doctor') => {
    updateData({ ...data, role });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!basicInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!basicInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!basicInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basicInfo.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!basicInfo.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(basicInfo.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = 'Invalid phone number (10 digits required)';
    }
    if (!basicInfo.password) {
      newErrors.password = 'Password is required';
    } else if (basicInfo.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (basicInfo.password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      {/* Role Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">
          I am registering as:
        </label>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => handleRoleChange('patient')}
            className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg border-2 transition-all ${
              data.role === 'patient'
                ? 'border-pink-500 bg-pink-50 ring-2 ring-pink-200'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <User className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-pink-500" />
            <span className="font-medium text-gray-800 text-sm sm:text-base">Patient</span>
            <span className="text-xs text-gray-500 mt-1 text-center">
              Seeking healthcare services
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('doctor')}
            className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-lg border-2 transition-all ${
              data.role === 'doctor'
                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                : 'border-gray-200 hover:border-purple-300'
            }`}
          >
            <Users className="h-8 w-8 sm:h-10 sm:w-10 mb-2 text-purple-500" />
            <span className="font-medium text-gray-800 text-sm sm:text-base">Doctor</span>
            <span className="text-xs text-gray-500 mt-1 text-center">
              Providing medical services
            </span>
          </button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={basicInfo.firstName}
            onChange={handleChange}
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="text-xs text-red-500">{errors.firstName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={basicInfo.lastName}
            onChange={handleChange}
            className={`w-full px-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="text-xs text-red-500">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="email"
            name="email"
            type="email"
            value={basicInfo.email}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            value={basicInfo.phoneNumber}
            onChange={handleChange}
            className={`w-full pl-10 pr-3 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+91 XXXXX XXXXX"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-xs text-red-500">{errors.phoneNumber}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={basicInfo.password}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="At least 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
          Confirm Password <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }
            }}
            className={`w-full pl-10 pr-10 py-2 sm:py-2.5 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm sm:text-base ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Re-enter your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium py-2.5 sm:py-3"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};
