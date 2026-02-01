import { NextResponse } from 'next/server';

// Simulate external API call - in production this would call your NSDS API
async function callExternalQuoteAPI(formData) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate different responses based on input
  const vehicleType = formData.get('vehicleType');
  const coverageType = formData.get('coverageType');
  
  // Mock response - in production this would be the actual API response
  const mockResponse = {
    success: true,
    data: {
      quoteId: `QUOTE-${Date.now()}`,
      premium: Math.floor(Math.random() * 500) + 100,
      currency: 'USD',
      coverage: coverageType,
      vehicleType: vehicleType,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }
  };
  
  return mockResponse;
}

export async function POST(request) {
  try {
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Validate required fields
    const requiredFields = [
      'vehicleType',
      'vehicleBrand', 
      'vehicleModel',
      'vehicleYear',
      'vehicleUsage',
      'coverageType',
      'clientName',
      'clientEmail',
      'clientPhone',
      'hasPreviousInsurance'
    ];
    
    const missingFields = requiredFields.filter(field => !formData.get(field));
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Validate email format
    const email = formData.get('clientEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid email format' 
        },
        { status: 400 }
      );
    }
    
    // Validate phone number (basic validation)
    const phone = formData.get('clientPhone');
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.length < 10) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid phone number format' 
        },
        { status: 400 }
      );
    }
    
    // Validate vehicle year
    const vehicleYear = parseInt(formData.get('vehicleYear'));
    const currentYear = new Date().getFullYear();
    const minYear = currentYear - 50; // Cars older than 50 years might need special handling
    
    if (isNaN(vehicleYear) || vehicleYear < minYear || vehicleYear > currentYear + 1) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Vehicle year must be between ${minYear} and ${currentYear + 1}` 
        },
        { status: 400 }
      );
    }
    
    // Log the form data for debugging
    console.log('Form data received:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    // Call external API
    const apiResponse = await callExternalQuoteAPI(formData);
    
    // Return the response from the external API
    return NextResponse.json({
      success: true,
      data: apiResponse.data
    });
    
  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error while processing quote request' 
      },
      { status: 500 }
    );
  }
}