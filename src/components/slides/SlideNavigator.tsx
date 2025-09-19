'use client';

import React, { useState } from 'react';
import { SlideNavigationState, SlideOption } from '@/types/slide';
import { PagerDutyService } from '@/types/pagerduty';
import { slides } from '@/data/slides';
import SlideComponent from './SlideComponent';
import ServiceSelector from './ServiceSelector';

interface SlideNavigatorProps {
  initialSlide?: string;
  onSpreadsheetUpdate?: (data: { serviceName?: string; exists: boolean }) => void;
  onComplete?: (data: SlideNavigationState['data']) => void;
}

export default function SlideNavigator({
  initialSlide = 'dynatraceOnboarding',
  onSpreadsheetUpdate,
  onComplete,
}: SlideNavigatorProps) {
  const [navigationState, setNavigationState] = useState<SlideNavigationState>({
    currentSlide: initialSlide,
    history: [],
    data: {},
  });

  const [showServiceNameInput, setShowServiceNameInput] = useState(false);
  const [showServiceSelector, setShowServiceSelector] = useState(false);
  const [serviceName, setServiceName] = useState('');

  const handleOptionSelect = (option: SlideOption) => {
    const currentSlide = slides[navigationState.currentSlide];

    // Update navigation state with the selected option
    const newData = {
      ...navigationState.data,
      [`${currentSlide.id}_response`]: option.value,
    };

    setNavigationState(prev => ({
      ...prev,
      history: [...prev.history, prev.currentSlide],
      data: newData,
    }));

    // Handle different actions
    switch (option.action) {
      case 'proceed':
        if (onComplete) {
          onComplete(newData);
        }
        break;

      case 'navigate':
        if (option.nextSlide && slides[option.nextSlide]) {
          setNavigationState(prev => ({
            ...prev,
            currentSlide: option.nextSlide!,
          }));
        }
        break;

      case 'update_spreadsheet':
        setShowServiceNameInput(true);
        break;

      case 'lookup_services':
        setShowServiceSelector(true);
        break;

      default:
        break;
    }
  };

  const handleServiceNameSubmit = () => {
    if (onSpreadsheetUpdate) {
      onSpreadsheetUpdate({
        serviceName: serviceName.trim() || undefined,
        exists: false,
      });
    }
    setShowServiceNameInput(false);
    setServiceName('');
  };

  const handleServiceSelect = (service: PagerDutyService) => {
    if (onSpreadsheetUpdate) {
      onSpreadsheetUpdate({
        serviceName: service.name,
        exists: true,
      });
    }
    setShowServiceSelector(false);
  };

  const handleServiceSelectorCancel = () => {
    setShowServiceSelector(false);
    handleGoBack();
  };

  const handleGoBack = () => {
    if (navigationState.history.length > 0) {
      const previousSlide = navigationState.history[navigationState.history.length - 1];
      setNavigationState(prev => ({
        ...prev,
        currentSlide: previousSlide,
        history: prev.history.slice(0, -1),
      }));
    }
  };

  const currentSlide = slides[navigationState.currentSlide];

  if (!currentSlide) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
        <h1 className="text-4xl font-light text-gray-900 mb-6 tracking-tight">Error</h1>
        <p className="text-xl text-gray-600 font-light">
          Slide not found: {navigationState.currentSlide}
        </p>
      </div>
    );
  }

  if (showServiceSelector) {
    return (
      <ServiceSelector
        onServiceSelect={handleServiceSelect}
        onCancel={handleServiceSelectorCancel}
      />
    );
  }

  if (showServiceNameInput) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
          Service Information
        </h1>

        <div className="mb-8">
          <p className="text-xl text-gray-600 mb-6 font-light leading-relaxed">
            The technical service does not exist in PagerDuty. Please provide the technical service
            name to update the spreadsheet.
          </p>

          <div className="mb-6">
            <label htmlFor="serviceName" className="block text-base font-medium text-gray-900 mb-3">
              Technical Service Name (optional):
            </label>
            <input
              type="text"
              id="serviceName"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full p-4 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 transition-all duration-300 font-light"
              placeholder="Enter service name..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleServiceNameSubmit}
            className="flex-1 p-4 bg-gray-900 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2"
          >
            Update Spreadsheet
          </button>
          <button
            onClick={() => setShowServiceNameInput(false)}
            className="px-6 py-4 bg-gray-50 hover:bg-gray-100 backdrop-blur-sm border border-gray-200 hover:border-gray-300 text-gray-900 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 hover:scale-105"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SlideComponent slide={currentSlide} onOptionSelect={handleOptionSelect} />

      {navigationState.history.length > 0 && (
        <div className="max-w-2xl mx-auto">
          <button
            onClick={handleGoBack}
            className="px-6 py-3 bg-gray-50 hover:bg-gray-100 backdrop-blur-sm border border-gray-200 hover:border-gray-300 text-gray-900 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 hover:scale-105"
          >
            ← Go Back
          </button>
        </div>
      )}
    </div>
  );
}
