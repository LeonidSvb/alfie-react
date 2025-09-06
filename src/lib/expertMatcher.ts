import { openai, MODELS } from './openai';
import { Expert } from '@/types/expert';
import { queryExperts, getAllExperts } from './airtable';

export async function generateUserTags(
  questionnaireSummary: Record<string, any>,
  flowType: string
): Promise<string[]> {
  try {
    const prompt = `
Based on this travel questionnaire response, generate 5-8 relevant tags for expert matching.
Focus on the most important aspects: destinations, activities, travel style, terrain preferences, and special interests.

Flow Type: ${flowType}
Questionnaire Responses: ${JSON.stringify(questionnaireSummary, null, 2)}

Return only a JSON array of tags (lowercase, hyphenated). Examples: ["hiking", "mountains", "luxury", "family", "cultural", "beach", "adventure", "food"]

Tags should be:
- Specific and actionable
- Related to travel expertise areas
- Covering destination types, activities, and travel styles
- Maximum 8 tags, minimum 5 tags
`;

    const completion = await openai.chat.completions.create({
      model: MODELS.TAGGING,
      messages: [
        {
          role: 'system',
          content: 'You are a travel expert specializing in matching travelers with appropriate travel guides. Generate relevant tags based on questionnaire responses.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      return generateTagsFromQuestionnaire(questionnaireSummary, flowType);
    }

    try {
      const tags = JSON.parse(response);
      return Array.isArray(tags) ? tags.filter(tag => typeof tag === 'string') : generateTagsFromQuestionnaire(questionnaireSummary, flowType);
    } catch (parseError) {
      console.error('Error parsing tags JSON:', parseError);
      return extractTagsFromText(response) || generateTagsFromQuestionnaire(questionnaireSummary, flowType);
    }
  } catch (error) {
    console.error('Error generating user tags:', error);
    return generateTagsFromQuestionnaire(questionnaireSummary, flowType);
  }
}

function generateTagsFromQuestionnaire(questionnaire: Record<string, any>, flowType: string): string[] {
  const tags: string[] = [];
  
  // Analyze questionnaire responses to generate relevant tags
  const responses = Object.entries(questionnaire);
  
  for (const [key, value] of responses) {
    const valueStr = Array.isArray(value) ? value.join(' ') : String(value).toLowerCase();
    
    // Terrain preferences
    if (valueStr.includes('mountain')) tags.push('mountains');
    if (valueStr.includes('beach') || valueStr.includes('ocean') || valueStr.includes('coastal')) tags.push('beach');
    if (valueStr.includes('forest')) tags.push('forest');
    if (valueStr.includes('desert')) tags.push('desert');
    if (valueStr.includes('lake')) tags.push('lake');
    
    // Activities
    if (valueStr.includes('hik')) tags.push('hiking');
    if (valueStr.includes('bik') || valueStr.includes('cycl')) tags.push('cycling');
    if (valueStr.includes('surf')) tags.push('surfing');
    if (valueStr.includes('ski')) tags.push('skiing');
    if (valueStr.includes('climb')) tags.push('climbing');
    if (valueStr.includes('water') || valueStr.includes('kayak') || valueStr.includes('paddle')) tags.push('water-activities');
    if (valueStr.includes('wildlife')) tags.push('wildlife');
    
    // Travel style
    if (valueStr.includes('luxury') || valueStr.includes('luxe')) tags.push('luxury');
    if (valueStr.includes('budget') || valueStr.includes('simple')) tags.push('budget');
    if (valueStr.includes('family') || valueStr.includes('kid')) tags.push('family');
    if (valueStr.includes('solo')) tags.push('solo');
    if (valueStr.includes('couple')) tags.push('couple');
    
    // Cultural interests
    if (valueStr.includes('cultural') || valueStr.includes('museum') || valueStr.includes('historic')) tags.push('cultural');
    if (valueStr.includes('food') || valueStr.includes('culinary') || valueStr.includes('cooking')) tags.push('food');
    if (valueStr.includes('art')) tags.push('art');
    if (valueStr.includes('wine')) tags.push('wine');
    
    // Locations
    if (valueStr.includes('europe')) tags.push('europe');
    if (valueStr.includes('asia')) tags.push('asia');
    if (valueStr.includes('usa') || valueStr.includes('america')) tags.push('usa');
    if (valueStr.includes('utah')) tags.push('utah');
    if (valueStr.includes('canyon')) tags.push('canyon');
    
    // Experience level
    if (valueStr.includes('guide') || valueStr.includes('expert')) tags.push('guided');
    if (valueStr.includes('adventure')) tags.push('adventure');
    if (valueStr.includes('backpack')) tags.push('backpacking');
    if (valueStr.includes('camping')) tags.push('camping');
    
    // Lodging
    if (valueStr.includes('boutique') || valueStr.includes('guesthouse')) tags.push('boutique-lodging');
    if (valueStr.includes('camping') || valueStr.includes('rustic')) tags.push('camping');
    
    // Fitness level
    if (valueStr.includes('high') && key.includes('fitness')) tags.push('high-fitness');
    if (valueStr.includes('moderate') && key.includes('fitness')) tags.push('moderate-fitness');
    if (valueStr.includes('low') && key.includes('fitness')) tags.push('low-fitness');
  }
  
  // Add default tags based on flow type
  if (flowType === 'inspire-me') {
    tags.push('outdoor', 'adventure', 'inspiration');
  } else {
    tags.push('planning', 'local-expert', 'recommendations');
  }
  
  // Remove duplicates and return
  return Array.from(new Set(tags)).slice(0, 8);
}

function extractTagsFromText(text: string): string[] | null {
  const tagMatches = text.match(/["']([^"']+)["']/g);
  if (tagMatches) {
    return tagMatches.map(match => match.replace(/["']/g, ''));
  }
  return null;
}

function getDefaultTags(flowType: string): string[] {
  if (flowType === 'inspire-me') {
    return ['outdoor', 'adventure', 'hiking', 'nature', 'cultural'];
  } else {
    return ['outdoor', 'planning', 'local-expert', 'activities', 'recommendations'];
  }
}

export async function findBestExpert(userTags: string[]): Promise<{
  expert: Expert | null;
  matchScore: number;
}> {
  try {
    let experts = await queryExperts(userTags);
    
    if (experts.length === 0) {
      experts = await getAllExperts();
    }

    if (experts.length === 0) {
      return { expert: null, matchScore: 0 };
    }

    let bestMatch: { expert: Expert; score: number } | null = null;

    for (const expert of experts) {
      const score = calculateMatchScore(userTags, expert.tags);
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { expert, score };
      }
    }

    return bestMatch 
      ? { expert: bestMatch.expert, matchScore: bestMatch.score }
      : { expert: experts[0], matchScore: 0.5 };

  } catch (error) {
    console.error('Error finding best expert:', error);
    return { expert: null, matchScore: 0 };
  }
}

export function calculateMatchScore(userTags: string[], expertTags: string[]): number {
  if (userTags.length === 0 || expertTags.length === 0) {
    return 0;
  }

  const userTagsLower = userTags.map(tag => tag.toLowerCase().trim());
  const expertTagsLower = expertTags.map(tag => tag.toLowerCase().trim());

  let exactMatches = 0;
  let partialMatches = 0;

  for (const userTag of userTagsLower) {
    if (expertTagsLower.includes(userTag)) {
      exactMatches++;
    } else {
      for (const expertTag of expertTagsLower) {
        if (userTag.includes(expertTag) || expertTag.includes(userTag)) {
          partialMatches += 0.5;
          break;
        }
      }
    }
  }

  const totalMatches = exactMatches + partialMatches;
  const maxPossibleMatches = Math.max(userTags.length, expertTags.length);
  
  return totalMatches / maxPossibleMatches;
}

export async function matchExpertWithQuestionnaire(
  questionnaireSummary: Record<string, any>,
  flowType: 'inspire-me' | 'i-know-where',
  providedTags?: string[]
): Promise<{
  expert: Expert | null;
  matchScore: number;
  tagsUsed: string[];
}> {
  try {
    const userTags = providedTags || await generateUserTags(questionnaireSummary, flowType);
    const { expert, matchScore } = await findBestExpert(userTags);

    return {
      expert,
      matchScore,
      tagsUsed: userTags,
    };
  } catch (error) {
    console.error('Error in expert matching:', error);
    return {
      expert: null,
      matchScore: 0,
      tagsUsed: [],
    };
  }
}