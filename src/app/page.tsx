'use client';

import { useState } from 'react';
import SlideNavigator from '@/components/slides/SlideNavigator';

export default function Home() {
  const [completionData, setCompletionData] = useState<Record<
    string,
    string | boolean | number
  > | null>(null);
  const [spreadsheetData, setSpreadsheetData] = useState<{
    serviceName?: string;
    exists: boolean;
  } | null>(null);

  const handleComplete = (data: Record<string, string | boolean | number>) => {
    setCompletionData(data);
    console.log('Slide flow completed with data:', data);
  };

  const handleSpreadsheetUpdate = (data: { serviceName?: string; exists: boolean }) => {
    setSpreadsheetData(data);
    console.log('Spreadsheet update requested:', data);
  };

  const resetFlow = () => {
    setCompletionData(null);
    setSpreadsheetData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-3 tracking-tight">
            PagerDuty Service Onboarding
          </h1>
          <p className="text-gray-600 text-lg font-light">Dynatrace Service Integration Workflow</p>
        </header>

        {completionData && (
          <div className="max-w-2xl mx-auto mb-8 p-8 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
              Flow Completed Successfully
            </h2>
            <div className="text-gray-600 mb-6 font-light">
              <p className="mb-3 text-base">
                The onboarding process has been completed with the following responses:
              </p>
              <ul className="space-y-2">
                {Object.entries(completionData).map(([key, value]) => (
                  <li key={key} className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                    <span className="font-medium text-gray-900">{key}:</span>
                    <span>{String(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={resetFlow}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Start New Flow
            </button>
          </div>
        )}

        {spreadsheetData && (
          <div className="max-w-2xl mx-auto mb-8 p-8 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
            <h2 className="text-2xl font-light text-gray-900 mb-4 tracking-tight">
              Spreadsheet Update Required
            </h2>
            <div className="text-gray-600 mb-6 font-light">
              <p className="mb-3 text-base">
                The following information should be updated in the spreadsheet:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                  <span className="font-medium text-gray-900">Service Exists:</span>
                  <span>{spreadsheetData.exists ? 'Yes' : 'No'}</span>
                </li>
                {spreadsheetData.serviceName && (
                  <li className="flex items-center space-x-2">
                    <div className="w-1 h-1 bg-gray-900 rounded-full"></div>
                    <span className="font-medium text-gray-900">Service Name:</span>
                    <span>{spreadsheetData.serviceName}</span>
                  </li>
                )}
              </ul>
            </div>
            <button
              onClick={resetFlow}
              className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Start New Flow
            </button>
          </div>
        )}

        {!completionData && !spreadsheetData && (
          <SlideNavigator
            onComplete={handleComplete}
            onSpreadsheetUpdate={handleSpreadsheetUpdate}
          />
        )}
      </div>
    </div>
  );
}
