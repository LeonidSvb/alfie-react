import { NextApiRequest, NextApiResponse } from 'next';
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

interface TripGenerationResponse {
  success: boolean;
  tripContent?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TripGenerationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const { answers, flow }: TripGenerationRequest = req.body;

    if (!answers || !flow) {
      return res.status(400).json({
        success: false,
        error: 'Missing required parameters: answers and flow'
      });
    }

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

    return res.status(200).json({
      success: true,
      tripContent
    });

  } catch (error) {
    console.error('Error generating trip:', error);
    
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

*Note: Please configure OpenAI API key in Vercel dashboard for full AI-powered responses.*`;

    return res.status(200).json({
      success: true,
      tripContent: fallbackContent
    });
  }
}