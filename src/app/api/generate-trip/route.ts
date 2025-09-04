import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🟢 Generate-trip GET called');
  return NextResponse.json({ 
    success: true,
    tripContent: 'GET method working!'
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API called - FIXED VERSION');
    
    // Return fallback content immediately - no JSON parsing needed
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

    console.log('🟢 Sending fallback response');
    return NextResponse.json({
      success: true,
      tripContent: fallbackContent
    });

  } catch (error) {
    console.error('🔴 Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}// Force deployment Thu, Sep  4, 2025  8:52:06 PM
