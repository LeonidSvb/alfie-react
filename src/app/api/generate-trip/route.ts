import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { inspireFlowPrompt } from '@/data/prompts/inspire-flow-prompt';
import { planningFlowPrompt } from '@/data/prompts/planning-flow-prompt';
import { UserAnswers } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TripGenerationRequest {
  answers: UserAnswers;
  flow: 'inspire' | 'planning';
}

export async function GET() {
  return NextResponse.json({ 
    status: 'generate-trip API is working',
    method: 'GET'
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 API called');
    
    const body: TripGenerationRequest = await request.json();
    const { answers, flow } = body;

    if (!answers || !flow) {
      console.error('❌ Missing required parameters');
      return NextResponse.json({
        success: false,
        error: 'Missing required parameters: answers and flow'
      }, { status: 400 });
    }

    console.log('✅ Parameters validated:', { flow, answersCount: Object.keys(answers).length });

    // Select the appropriate prompt based on flow
    const systemPrompt = flow === 'inspire' ? inspireFlowPrompt : planningFlowPrompt;

    // Format user answers into a readable string
    const formattedAnswers = Object.entries(answers)
      .filter(([, value]) => value && typeof value === 'string' && value.trim() !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const userMessage = `Here are the user's answers:\n\n${formattedAnswers}`;

    // Call OpenAI API
    console.log('🔑 Calling OpenAI API with key:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const tripContent = completion.choices[0]?.message?.content;

    if (!tripContent) {
      throw new Error('No content generated from OpenAI');
    }

    console.log('✅ OpenAI response received, length:', tripContent.length);
    
    const response = {
      success: true,
      tripContent
    };
    
    console.log('🟢 Sending successful response');
    return NextResponse.json(response);

  } catch (error) {
    console.error('🔴 Error generating trip:', error);
    console.error('🔴 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // Fallback response for testing
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

*Note: Using fallback content - OpenAI API may not be configured.*`;

    const fallbackResponse = {
      success: true,
      tripContent: fallbackContent
    };
    
    console.log('🟡 Sending fallback response');
    return NextResponse.json(fallbackResponse);
  }
}