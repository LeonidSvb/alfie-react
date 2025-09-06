import { NextRequest, NextResponse } from 'next/server';
import { generateInspireGuide, generatePlanningGuide } from '@/lib/tripGuideGenerator';
import { TripGuide } from '@/types/tripGuide';
import { QuestionnaireData } from '@/types/questionnaire';

export async function POST(request: NextRequest): Promise<NextResponse<{ success: boolean; guide?: TripGuide; error?: string }>> {
  try {
    const body = await request.json() as QuestionnaireData;

    // Validate required fields
    if (!body.flowType || !body.answers) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: flowType or answers'
        },
        { status: 400 }
      );
    }

    // Generate trip guide based on flow type
    let guide: TripGuide;
    
    if (body.flowType === 'inspire-me') {
      guide = await generateInspireGuide(body.answers);
    } else if (body.flowType === 'i-know-where') {
      guide = await generatePlanningGuide(body.answers);
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid flow type. Must be "inspire-me" or "i-know-where"'
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      guide
    });

  } catch (error) {
    console.error('Trip guide generation API error:', error);
    
    // Handle different types of OpenAI errors
    if (error instanceof Error) {
      // OpenAI quota/billing issues
      if (error.message.includes('quota') || error.message.includes('insufficient_quota')) {
        return NextResponse.json(
          {
            success: false,
            error: '🏦 OpenAI quota exceeded. Please check your billing and plan details.',
            errorType: 'quota_exceeded'
          },
          { status: 429 }
        );
      }
      
      // OpenAI API rate limiting
      if (error.message.includes('rate limit') || error.message.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            error: '⏳ Service temporarily busy. Please try again in a few moments.',
            errorType: 'rate_limited'
          },
          { status: 429 }
        );
      }
      
      // OpenAI API key issues
      if (error.message.includes('API key') || error.message.includes('unauthorized')) {
        return NextResponse.json(
          {
            success: false,
            error: '🔑 API configuration issue. Please contact support.',
            errorType: 'auth_error'
          },
          { status: 401 }
        );
      }
      
      // Network/connectivity issues
      if (error.message.includes('network') || error.message.includes('timeout')) {
        return NextResponse.json(
          {
            success: false,
            error: '🌐 Network connectivity issue. Please check your connection and try again.',
            errorType: 'network_error'
          },
          { status: 503 }
        );
      }
    }
    
    return NextResponse.json(
      {
        success: false,
        error: '❌ An unexpected error occurred during guide generation. Please try again.',
        errorType: 'unknown'
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}