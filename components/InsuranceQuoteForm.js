'use client';

import { useState } from 'react';

export default function InsuranceQuoteForm() {
  const [formData, setFormData] = useState({
    vehicleType: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleUsage: '',
    coverageType: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    hasPreviousInsurance: '',
    previousInsuranceDetails: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!formData.vehicleBrand) newErrors.vehicleBrand = 'Vehicle brand is required';
    if (!formData.vehicleModel) newErrors.vehicleModel = 'Vehicle model is required';
    if (!formData.vehicleYear) {
      newErrors.vehicleYear = 'Vehicle year is required';
    } else {
      const year = parseInt(formData.vehicleYear);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1900 || year > currentYear + 1) {
        newErrors.vehicleYear = `Please enter a valid year between 1900 and ${currentYear + 1}`;
      }
    }
    if (!formData.vehicleUsage) newErrors.vehicleUsage = 'Vehicle usage is required';
    if (!formData.coverageType) newErrors.coverageType = 'Coverage type is required';
    
    if (!formData.clientName.trim()) newErrors.clientName = 'Name is required';
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Phone is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.clientPhone) || formData.clientPhone.replace(/\D/g, '').length < 10) {
      newErrors.clientPhone = 'Please enter a valid phone number';
    }
    if (!formData.hasPreviousInsurance) newErrors.hasPreviousInsurance = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] || key === 'previousInsuranceDetails') {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/quote', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', errorText);
        setError('Server error: ' + response.statusText);
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const errorText = await response.text();
        console.error('Non-JSON response:', errorText);
        setError('Server returned non-JSON response. Please check server logs.');
        return;
      }

      const result = await response.json();

      if (result.success && result.data?.quoteId) {
        setSuccess(`Quote generated successfully! Quote ID: ${result.data.quoteId}. Premium: $${result.data.premium}`);
        // Reset form
        setFormData({
          vehicleType: '',
          vehicleBrand: '',
          vehicleModel: '',
          vehicleYear: '',
          vehicleUsage: '',
          coverageType: '',
          clientName: '',
          clientEmail: '',
          clientPhone: '',
          hasPreviousInsurance: '',
          previousInsuranceDetails: ''
        });
      } else {
        setError('Failed to generate quote: ' + (result.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Vehicle Insurance Quote</h1>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Vehicle Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Vehicle Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type *
                  </label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select vehicle type</option>
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="truck">Truck</option>
                    <option value="suv">SUV</option>
                    <option value="van">Van</option>
                  </select>
                  {errors.vehicleType && <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Brand *
                  </label>
                  <input
                    type="text"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota, Honda, Ford"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vehicleBrand ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehicleBrand && <p className="mt-1 text-sm text-red-600">{errors.vehicleBrand}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Model *
                  </label>
                  <input
                    type="text"
                    name="vehicleModel"
                    value={formData.vehicleModel}
                    onChange={handleInputChange}
                    placeholder="e.g., Camry, Civic, F-150"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vehicleModel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.vehicleModel && <p className="mt-1 text-sm text-red-600">{errors.vehicleModel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Year *
                  </label>
                  <select
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vehicleYear ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select year</option>
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.vehicleYear && <p className="mt-1 text-sm text-red-600">{errors.vehicleYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Usage *
                  </label>
                  <select
                    name="vehicleUsage"
                    value={formData.vehicleUsage}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.vehicleUsage ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select usage</option>
                    <option value="personal">Personal</option>
                    <option value="business">Business</option>
                    <option value="commercial">Commercial</option>
                  </select>
                  {errors.vehicleUsage && <p className="mt-1 text-sm text-red-600">{errors.vehicleUsage}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Type *
                  </label>
                  <select
                    name="coverageType"
                    value={formData.coverageType}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.coverageType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select coverage</option>
                    <option value="liability">Liability Only</option>
                    <option value="collision">Collision</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="full">Full Coverage</option>
                  </select>
                  {errors.coverageType && <p className="mt-1 text-sm text-red-600">{errors.coverageType}</p>}
                </div>
              </div>
            </div>

            {/* Client Information Section */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.clientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clientName && <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.clientEmail ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clientEmail && <p className="mt-1 text-sm text-red-600">{errors.clientEmail}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="clientPhone"
                    value={formData.clientPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.clientPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.clientPhone && <p className="mt-1 text-sm text-red-600">{errors.clientPhone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Insurance? *
                  </label>
                  <select
                    name="hasPreviousInsurance"
                    value={formData.hasPreviousInsurance}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hasPreviousInsurance ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  {errors.hasPreviousInsurance && <p className="mt-1 text-sm text-red-600">{errors.hasPreviousInsurance}</p>}
                </div>

                {formData.hasPreviousInsurance === 'yes' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previous Insurance Details
                    </label>
                    <textarea
                      name="previousInsuranceDetails"
                      value={formData.previousInsuranceDetails}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Please provide details about your previous insurance coverage..."
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-3 rounded-md text-white font-medium ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? 'Processing...' : 'Get Quote'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}