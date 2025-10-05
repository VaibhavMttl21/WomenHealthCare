import React from 'react';
import { CheckCircle } from '../ui/Icons';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  const progressWidth = ((currentStep - 1) / (steps.length - 1)) * 100;
  
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress bar */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 -z-10">
          <div
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500"
            style={{ width: `${progressWidth}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = currentStep > stepNumber;
          const isCurrent = currentStep === stepNumber;

          return (
            <div
              key={stepNumber}
              className="flex flex-col items-center relative"
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                    : isCurrent
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white ring-4 ring-pink-200'
                    : 'bg-white text-gray-400 border-2 border-gray-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <span className="text-sm">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-medium transition-colors duration-300 hidden sm:block ${
                  isCurrent ? 'text-pink-600' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
