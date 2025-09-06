import { openai, MODELS } from './openai';
import { TripGuide } from '@/types/tripGuide';
import { alfiePersonality } from '../../back/prompts/alfie-personality';
import { inspireFlowPrompt } from '../../back/prompts/inspire-flow-prompt';
import { planningFlowPrompt } from '../../back/prompts/planning-flow-prompt';
import { exampleOutputs } from '../../back/prompts/example-outputs';

// Retry helper for OpenAI API calls
async function withRetry<T>(
  operation: () => Promise<T>, 
  maxRetries: number = 3
): Promise<T> {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      if (error.status === 429 && attempt < maxRetries - 1) {
        const delay = (attempt + 1) * 2000; // 2s, 4s, 6s delays
        console.log(`Rate limited, retrying in ${delay/1000} seconds... (attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        break;
      }
    }
  }
  
  throw lastError;
}

function generateTripGuideId(): string {
  return `tripguide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function formatQuestionnaireSummary(questionnaireSummary: Record<string, any>): string {
  return Object.entries(questionnaireSummary)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}: ${value.join(', ')}`;
      }
      return `${key}: ${value}`;
    })
    .join('\n');
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function generateInspireGuide(
  questionnaireSummary: Record<string, any>
): Promise<TripGuide> {
  try {
    const formattedSummary = formatQuestionnaireSummary(questionnaireSummary);
    
    const systemPrompt = `${alfiePersonality}\n\n${inspireFlowPrompt}`;
    
    const userPrompt = `Based on these questionnaire responses, generate a personalized trip inspiration guide:

${formattedSummary}

Please follow the exact output structure specified in the prompt and match the tone and style from this example:

${exampleOutputs.inspire.substring(0, 1000)}...

Generate a complete trip guide with three distinct destination recommendations that truly match their preferences.`;

    const completion = await withRetry(() =>
      openai.chat.completions.create({
        model: MODELS.TRIP_GUIDE,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })
    );

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    const guide: TripGuide = {
      id: generateTripGuideId(),
      flowType: 'inspire-me',
      title: 'Your Personalized Trip Inspiration',
      content,
      generatedAt: new Date(),
      questionnaireSummary,
      tags: await generateTags(questionnaireSummary),
      estimatedReadTime: estimateReadTime(content),
    };

    return guide;
  } catch (error) {
    console.error('Error generating inspire guide:', error);
    throw new Error(`Failed to generate inspire guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generatePlanningGuide(
  questionnaireSummary: Record<string, any>
): Promise<TripGuide> {
  try {
    const formattedSummary = formatQuestionnaireSummary(questionnaireSummary);
    
    const systemPrompt = `${alfiePersonality}\n\n${planningFlowPrompt}`;
    
    const userPrompt = `Based on these questionnaire responses, generate a detailed trip planning guide:

${formattedSummary}

Please follow the exact output structure specified in the prompt and match the tone and style from this example:

${exampleOutputs.planning.substring(0, 1000)}...

Generate a complete, structured trip guide that addresses their specific destination and preferences.`;

    const completion = await withRetry(() =>
      openai.chat.completions.create({
        model: MODELS.TRIP_GUIDE,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      })
    );

    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content generated from OpenAI');
    }

    const guide: TripGuide = {
      id: generateTripGuideId(),
      flowType: 'i-know-where',
      title: 'Your Personal Trip Guide',
      content,
      generatedAt: new Date(),
      questionnaireSummary,
      tags: await generateTags(questionnaireSummary),
      estimatedReadTime: estimateReadTime(content),
    };

    return guide;
  } catch (error) {
    console.error('Error generating planning guide:', error);
    throw new Error(`Failed to generate planning guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function generateTags(
  questionnaireSummary: Record<string, any>
): Promise<string[]> {
  try {
    const formattedSummary = formatQuestionnaireSummary(questionnaireSummary);
    
    const completion = await withRetry(() =>
      openai.chat.completions.create({
        model: MODELS.TAGGING,
        messages: [
          {
            role: 'system',
            content: `You are a travel expert who creates tags for matching travelers with expert guides. Based on questionnaire responses, generate 5-8 relevant tags that would help match this traveler with the right expert guide.

Focus on:
- Destination regions/countries
- Activity types (hiking, skiing, cultural, etc.)
- Travel style (luxury, budget, adventure, etc.)
- Group type (solo, couple, family, etc.)
- Interests and specialties

Return only a comma-separated list of tags, no explanations.`,
          },
          {
            role: 'user',
            content: `Generate tags for this traveler profile:\n\n${formattedSummary}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      })
    );

    const tagsString = completion.choices[0]?.message?.content;
    
    if (!tagsString) {
      return [];
    }

    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 8);
  } catch (error) {
    console.error('Error generating tags:', error);
    return [];
  }
}