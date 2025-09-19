'use client';

import React, { useState, useEffect } from 'react';
import { PagerDutyService } from '@/types/pagerduty';
import { createPagerDutyService } from '@/lib/pagerduty';

interface ServiceSelectorProps {
  onServiceSelect: (service: PagerDutyService) => void;
  onCancel: () => void;
}

export default function ServiceSelector({ onServiceSelect, onCancel }: ServiceSelectorProps) {
  const [services, setServices] = useState<PagerDutyService[]>([]);
  const [filteredServices, setFilteredServices] = useState<PagerDutyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<PagerDutyService | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        const pagerDutyService = createPagerDutyService();
        const fetchedServices = await pagerDutyService.getServices();
        setServices(fetchedServices);
        setFilteredServices(fetchedServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const filtered = services.filter(
        service =>
          service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (service.description &&
            service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  const handleServiceSelect = (service: PagerDutyService) => {
    setSelectedService(service);
  };

  const handleConfirmSelection = () => {
    if (selectedService) {
      onServiceSelect(selectedService);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
          Loading PagerDuty Services
        </h1>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <p className="text-center text-gray-600 font-light text-lg">
          Fetching services from PagerDuty...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
        <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">Error</h1>
        <div className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 mb-8">
          <p className="text-gray-700 font-light">{error}</p>
        </div>
        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl shadow-gray-900/10">
      <h1 className="text-4xl font-light text-gray-900 mb-8 tracking-tight">
        Select Technical Service
      </h1>

      <p className="text-xl text-gray-600 mb-8 font-light leading-relaxed">
        Please select the existing technical service from PagerDuty that you want to use for
        Dynatrace integration.
      </p>

      {/* Search Input */}
      <div className="mb-8">
        <label htmlFor="search" className="block text-base font-medium text-gray-900 mb-3">
          Search Services:
        </label>
        <input
          type="text"
          id="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full p-4 bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-300 transition-all duration-300 font-light"
          placeholder="Search by service name or description..."
        />
      </div>

      {/* Services List */}
      <div className="mb-8 max-h-96 overflow-y-auto">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12 text-gray-500 font-light text-lg">
            {searchQuery ? 'No services found matching your search.' : 'No services available.'}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredServices.map(service => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className={`p-6 backdrop-blur-sm border rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                  selectedService?.id === service.id
                    ? 'border-gray-400 bg-gray-100 shadow-lg'
                    : 'border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-2 text-lg">{service.name}</h3>
                    {service.description && (
                      <p className="text-gray-600 mb-3 font-light">{service.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500 font-light">
                      <span>ID: {service.id}</span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.status === 'active'
                            ? 'bg-gray-200 text-gray-900'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>
                  {selectedService?.id === service.id && (
                    <div className="ml-4">
                      <div className="w-6 h-6 bg-gray-900 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleConfirmSelection}
          disabled={!selectedService}
          className={`flex-1 p-4 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            selectedService
              ? 'bg-gray-900 text-white hover:scale-105 hover:shadow-lg focus:ring-gray-900/20'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Select Service
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-4 bg-gray-50 hover:bg-gray-100 backdrop-blur-sm border border-gray-200 hover:border-gray-300 text-gray-900 rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:ring-offset-2 hover:scale-105"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
