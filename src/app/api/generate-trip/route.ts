import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'generate-trip API is working',
    method: 'GET'
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API called');
    
    const body = await request.json();
    const { answers, flow } = body;

    if (!answers || !flow) {
      console.error('❌ Missing required parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: answers and flow'
      }, { status: 400 });
    }

    console.log('✅ Parameters validated:', { flow, answersCount: Object.keys(answers).length });

    // Temporary fallback response without OpenAI
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
}