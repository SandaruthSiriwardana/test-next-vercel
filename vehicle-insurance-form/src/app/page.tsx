'use client';

import { useState } from 'react';

interface FormData {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email: string;
  maritalStatus: string;
  gender: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleColor: string;
  vehiclePlateNumber: string;
  chassisNumber: string;
  engineNumber: string;
  vehicleUsage: string;
  insuranceType: string;
  coverageAmount: string;
  deductible: string;
  previousInsurance: string;
  claimsHistory: string;
  additionalDrivers: string;
  paymentMethod: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

export default function VehicleInsuranceForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    idNumber: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
    email: '',
    maritalStatus: '',
    gender: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlateNumber: '',
    chassisNumber: '',
    engineNumber: '',
    vehicleUsage: '',
    insuranceType: '',
    coverageAmount: '',
    deductible: '',
    previousInsurance: '',
    claimsHistory: '',
    additionalDrivers: '',
    paymentMethod: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.vehicleBrand.trim()) newErrors.vehicleBrand = 'Vehicle brand is required';
    if (!formData.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!formData.vehicleYear) newErrors.vehicleYear = 'Vehicle year is required';
    if (!formData.vehicleColor.trim()) newErrors.vehicleColor = 'Vehicle color is required';
    if (!formData.vehiclePlateNumber.trim()) newErrors.vehiclePlateNumber = 'Plate number is required';
    if (!formData.chassisNumber.trim()) newErrors.chassisNumber = 'Chassis number is required';
    if (!formData.engineNumber.trim()) newErrors.engineNumber = 'Engine number is required';
    if (!formData.vehicleUsage) newErrors.vehicleUsage = 'Vehicle usage is required';
    if (!formData.insuranceType) newErrors.insuranceType = 'Insurance type is required';
    if (!formData.coverageAmount.trim()) newErrors.coverageAmount = 'Coverage amount is required';
    if (!formData.deductible.trim()) newErrors.deductible = 'Deductible is required';
    if (!formData.previousInsurance) newErrors.previousInsurance = 'Previous insurance info is required';
    if (!formData.claimsHistory) newErrors.claimsHistory = 'Claims history is required';
    if (!formData.additionalDrivers) newErrors.additionalDrivers = 'Additional drivers info is required';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Form submitted successfully! We will contact you soon.');
      setFormData({
        fullName: '',
        idNumber: '',
        dateOfBirth: '',
        address: '',
        phoneNumber: '',
        email: '',
        maritalStatus: '',
        gender: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        vehicleColor: '',
        vehiclePlateNumber: '',
        chassisNumber: '',
        engineNumber: '',
        vehicleUsage: '',
        insuranceType: '',
        coverageAmount: '',
        deductible: '',
        previousInsurance: '',
        claimsHistory: '',
        additionalDrivers: '',
        paymentMethod: '',
        agreeToTerms: false,
      });
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-3xl font-bold text-center">Vehicle Insurance Application</h1>
            <p className="text-center mt-2 text-blue-100">Please fill out the form below completely</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.idNumber && <p className="text-red-500 text-sm mt-1">{errors.idNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status *
                  </label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                  {errors.maritalStatus && <p className="text-red-500 text-sm mt-1">{errors.maritalStatus}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vehicle Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Brand *
                  </label>
                  <input
                    type="text"
                    name="vehicleBrand"
                    value={formData.vehicleBrand}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vehicleBrand && <p className="text-red-500 text-sm mt-1">{errors.vehicleBrand}</p>}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vehicleModel && <p className="text-red-500 text-sm mt-1">{errors.vehicleModel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Year *
                  </label>
                  <input
                    type="number"
                    name="vehicleYear"
                    value={formData.vehicleYear}
                    onChange={handleInputChange}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vehicleYear && <p className="text-red-500 text-sm mt-1">{errors.vehicleYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Color *
                  </label>
                  <input
                    type="text"
                    name="vehicleColor"
                    value={formData.vehicleColor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vehicleColor && <p className="text-red-500 text-sm mt-1">{errors.vehicleColor}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    name="vehiclePlateNumber"
                    value={formData.vehiclePlateNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.vehiclePlateNumber && <p className="text-red-500 text-sm mt-1">{errors.vehiclePlateNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chassis Number *
                  </label>
                  <input
                    type="text"
                    name="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.chassisNumber && <p className="text-red-500 text-sm mt-1">{errors.chassisNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Engine Number *
                  </label>
                  <input
                    type="text"
                    name="engineNumber"
                    value={formData.engineNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.engineNumber && <p className="text-red-500 text-sm mt-1">{errors.engineNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Usage *
                  </label>
                  <select
                    name="vehicleUsage"
                    value={formData.vehicleUsage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select usage</option>
                    <option value="personal">Personal Use</option>
                    <option value="business">Business Use</option>
                    <option value="commercial">Commercial</option>
                    <option value="rideshare">Rideshare/Taxi</option>
                  </select>
                  {errors.vehicleUsage && <p className="text-red-500 text-sm mt-1">{errors.vehicleUsage}</p>}
                </div>
              </div>
            </div>

            {/* Insurance Details */}
            <div className="border-b pb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Insurance Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Insurance Type *
                  </label>
                  <select
                    name="insuranceType"
                    value={formData.insuranceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select insurance type</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="third-party">Third Party Only</option>
                    <option value="collision">Collision</option>
                    <option value="liability">Liability</option>
                  </select>
                  {errors.insuranceType && <p className="text-red-500 text-sm mt-1">{errors.insuranceType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Coverage Amount ($) *
                  </label>
                  <input
                    type="number"
                    name="coverageAmount"
                    value={formData.coverageAmount}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.coverageAmount && <p className="text-red-500 text-sm mt-1">{errors.coverageAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deductible ($) *
                  </label>
                  <input
                    type="number"
                    name="deductible"
                    value={formData.deductible}
                    onChange={handleInputChange}
                    min="0"
                    step="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.deductible && <p className="text-red-500 text-sm mt-1">{errors.deductible}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Insurance *
                  </label>
                  <select
                    name="previousInsurance"
                    value={formData.previousInsurance}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes, I have previous insurance</option>
                    <option value="no">No, this is my first insurance</option>
                    <option value="expired">My previous insurance expired</option>
                  </select>
                  {errors.previousInsurance && <p className="text-red-500 text-sm mt-1">{errors.previousInsurance}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claims History *
                  </label>
                  <select
                    name="claimsHistory"
                    value={formData.claimsHistory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select claims history</option>
                    <option value="none">No claims in the past 3 years</option>
                    <option value="one">1 claim in the past 3 years</option>
                    <option value="two">2 claims in the past 3 years</option>
                    <option value="three-plus">3 or more claims in the past 3 years</option>
                  </select>
                  {errors.claimsHistory && <p className="text-red-500 text-sm mt-1">{errors.claimsHistory}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Drivers *
                  </label>
                  <select
                    name="additionalDrivers"
                    value={formData.additionalDrivers}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select additional drivers</option>
                    <option value="none">No additional drivers</option>
                    <option value="one">1 additional driver</option>
                    <option value="two">2 additional drivers</option>
                    <option value="three-plus">3 or more additional drivers</option>
                  </select>
                  {errors.additionalDrivers && <p className="text-red-500 text-sm mt-1">{errors.additionalDrivers}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select payment method</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="semi-annually">Semi-annually</option>
                    <option value="annually">Annually</option>
                  </select>
                  {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the terms and conditions and privacy policy. I understand that this information will be used to process my insurance application and that false information may result in denial of coverage. *
                </label>
              </div>
              {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}