'use client';

import React from 'react';

interface TimelineProgressProps {
  currentSlideId: string;
  completedSlides: string[];
  userResponses: Record<string, string | boolean | number>;
}

export default function TimelineProgress({
  currentSlideId,
  completedSlides,
  userResponses,
}: TimelineProgressProps) {
  // Fixed total steps - always show maximum possible steps
  const getTotalSteps = () => {
    return 3; // Always show 3 steps maximum
  };

  // Determine current step number
  const getCurrentStep = () => {
    if (currentSlideId === 'dynatraceOnboarding') return 1;
    if (currentSlideId === 'technicalServiceCheck') return 2;
    if (currentSlideId === 'serviceSelection' || currentSlideId === 'spreadsheetUpdate') return 3;
    return 1;
  };

  const totalSteps = getTotalSteps();
  const currentStep = getCurrentStep();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Progress</h3>
        <span className="text-sm text-gray-600">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div className="mt-3 flex items-center space-x-2">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>

              {/* Connector line */}
              {index < totalSteps - 1 && (
                <div
                  className={`flex-1 h-1 rounded ${
                    stepNumber < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
