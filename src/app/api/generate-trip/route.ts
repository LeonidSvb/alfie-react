import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🟢 Generate-trip GET called');
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: request.method,
    endpoint: 'generate-trip'
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API called');
    
    // SAFE JSON PARSING with error handling
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('❌ Invalid JSON in request body:', error);
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON in request body'
      }, { status: 400 });
    }
    
    const { answers, flow } = body;

    if (!answers || !flow) {
      console.error('❌ Missing required parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: answers and flow'
      }, { status: 400 });
    }

    console.log('✅ Parameters validated:', { flow, answersCount: Object.keys(answers).length });

    // Temporary fallback response
    const fallbackContent = `🏔️ **Your Adventure Awaits!**

Based on your preferences, here's a personalized trip guide:

🗺️ **Destination Recommendations:**
- Explore scenic mountain trails perfect for your fitness level
- Discover hidden gems recommended by local experts
- Experience authentic outdoor adventures

🎯 **Trip Highlights:**
- Customized activities matching your interests
- Expert-recommended routes and locations  
- Perfect balance of adventure and relaxation

✈️ **Next Steps:**
Contact our travel experts to finalize your personalized itinerary and make your outdoor dreams a reality!

*Note: Using fallback content - OpenAI API integration coming soon.*`;

    const response = {
      success: true,
      tripContent: fallbackContent
    };
    
    console.log('🟢 Sending fallback response');
    return NextResponse.json(response);

  } catch (error) {
    console.error('🔴 Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}// Force deployment Thu, Sep  4, 2025  8:52:06 PM
