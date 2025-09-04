import { UserAnswers } from '@/types';
import { ExpertMatchRequest } from './ImprovedExpertMatcher';

export interface ExpertFilterResult {
  experts: any[];
  matchingCriteria: string[];
}

/**
 * Convert user answers to expert match request format
 * This bridges the old question system with the new tag-based expert matching
 */
export function convertAnswersToExpertRequest(answers: UserAnswers): ExpertMatchRequest {
  const request: ExpertMatchRequest = {};

  console.log('🔄 Converting answers to expert request:', answers);

  // Extract destination from various answer fields (FIXED WITH CORRECT KEYS)
  if (answers.destination_main) {
    request.destination = answers.destination_main;
  } else if (answers.stops) {
    request.destination = answers.stops.split(',')[0]?.trim(); // First destination
  } else if (answers.roadtrip_region) {
    request.destination = answers.roadtrip_region;
  } else if (answers.home_base) {
    // For inspire flow, use home base to suggest nearby destinations
    request.destination = answers.home_base;
  } else if (answers.specific_regions) {
    request.destination = answers.specific_regions;
  } else if (answers.regions_interest) {
    request.destination = answers.regions_interest;
  }

  // Extract activities (IMPROVED PARSING)
  if (answers.activities || answers.outdoor_activities) {
    const activitiesText = answers.activities || answers.outdoor_activities || '';
    const activityList: string[] = [];
    
    console.log('🎯 Parsing activities:', activitiesText);
    
    // Map emoji activities to text (EXTENDED)
    const activityMap: { [key: string]: string } = {
      '🥾': 'hiking',
      '🚴': 'biking', 
      '🚶': 'walking',
      '🏊': 'swimming',
      '🌊': 'water activities',
      '🎿': 'skiing',
      '🛣️': 'scenic drives',
      '🎨': 'art',
      '🏛️': 'historic sites',
      '🍷': 'wine',
      '🎶': 'music',
      '🐾': 'wildlife',
      '👨‍👩‍👧': 'family activities',
      '💆': 'wellness',
      '🧗': 'climbing',
      '🏔️': 'mountaineering',
      '📸': 'photography',
      '🎣': 'fishing',
      '🛶': 'kayaking',
      '🏄': 'surfing'
    };

    // Extract activities from emojis and text
    Object.entries(activityMap).forEach(([emoji, activity]) => {
      if (activitiesText.includes(emoji) || activitiesText.toLowerCase().includes(activity)) {
        activityList.push(activity);
      }
    });

    // Parse common text-based activities (MORE COMPREHENSIVE)
    const textToCheck = activitiesText.toLowerCase();
    const activityPatterns = [
      { pattern: /hiking|hike|walking|trek/i, activity: 'hiking' },
      { pattern: /bik|cycling|cycle/i, activity: 'biking' },
      { pattern: /photograph|photo/i, activity: 'photography' },
      { pattern: /diving|scuba|snorkel/i, activity: 'diving' },
      { pattern: /climbing|climb|rock climbing/i, activity: 'climbing' },
      { pattern: /skiing|ski|snowboard/i, activity: 'skiing' },
      { pattern: /wildlife|animal|bird/i, activity: 'wildlife' },
      { pattern: /kayak|canoe|paddl/i, activity: 'kayaking' },
      { pattern: /fish/i, activity: 'fishing' },
      { pattern: /surf/i, activity: 'surfing' },
      { pattern: /mountain/i, activity: 'mountaineering' }
    ];

    activityPatterns.forEach(({ pattern, activity }) => {
      if (pattern.test(textToCheck)) {
        activityList.push(activity);
      }
    });

    // Remove duplicates
    const uniqueActivities = [...new Set(activityList)];
    
    if (uniqueActivities.length > 0) {
      request.activities = uniqueActivities;
      console.log('✅ Extracted activities:', uniqueActivities);
    }
  }

  // Extract traveler type (FIXED MAPPING)
  if (answers.party_type) {
    const partyType = answers.party_type.toLowerCase();
    console.log('👥 Parsing party type:', partyType);
    
    if (partyType.includes('family') || partyType.includes('kids')) {
      request.traveler_type = 'families';
    } else if (partyType.includes('solo')) {
      request.traveler_type = 'solo';
    } else if (partyType.includes('couple')) {
      request.traveler_type = 'solo'; // Couples often have similar needs to solo travelers
    } else if (partyType.includes('friend')) {
      request.traveler_type = 'solo'; // Friends group similar to solo needs
    }
    
    console.log('✅ Mapped to traveler type:', request.traveler_type);
  }

  // Extract experience level (FIXED FIELD NAME AND MAPPING)
  if (answers.fitness_level) {
    const fitnessLevel = answers.fitness_level.toLowerCase();
    console.log('🏃 Parsing fitness level:', fitnessLevel);
    
    if (fitnessLevel.includes('low') || fitnessLevel.includes('easy') || fitnessLevel.includes('beginner')) {
      request.experience_level = 'beginner';
    } else if (fitnessLevel.includes('moderate') || fitnessLevel.includes('intermediate')) {
      request.experience_level = 'advanced';
    } else if (fitnessLevel.includes('high') || fitnessLevel.includes('extreme') || fitnessLevel.includes('challenging')) {
      request.experience_level = 'extreme';
    }
    
    console.log('✅ Mapped to experience level:', request.experience_level);
  }

  // Extract languages from any text fields (IMPROVED DETECTION)
  const allText = Object.values(answers).join(' ').toLowerCase();
  const languages: string[] = [];
  
  const languagePatterns = [
    { pattern: /spanish|español|castellano/i, lang: 'spanish' },
    { pattern: /german|deutsch/i, lang: 'german' },
    { pattern: /french|français/i, lang: 'french' },
    { pattern: /japanese|日本語/i, lang: 'japanese' },
    { pattern: /italian|italiano/i, lang: 'italian' },
    { pattern: /portuguese|português/i, lang: 'portuguese' }
  ];

  languagePatterns.forEach(({ pattern, lang }) => {
    if (pattern.test(allText)) {
      languages.push(lang);
    }
  });
  
  if (languages.length > 0) {
    request.languages = languages;
    console.log('✅ Detected languages:', languages);
  }

  console.log('🎯 Final expert request:', request);
  return request;
}

/**
 * Search experts using the improved system
 */
export async function searchExperts(answers: UserAnswers): Promise<ExpertFilterResult> {
  try {
    const expertRequest = convertAnswersToExpertRequest(answers);
    
    console.log('🔍 Searching experts with request:', expertRequest);
    
    const response = await fetch('/api/experts/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expertRequest),
    });

    if (!response.ok) {
      throw new Error(`Expert search failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Expert search failed');
    }

    return {
      experts: data.experts || [],
      matchingCriteria: data.filterSteps?.map((step: any) => step.step) || []
    };

  } catch (error) {
    console.error('Error searching experts:', error);
    
    // Fallback to empty result
    return {
      experts: [],
      matchingCriteria: []
    };
  }
}

/**
 * Legacy compatibility functions
 */
export function filterExperts(answers: UserAnswers, allExperts: any[]): ExpertFilterResult {
  // This is now a wrapper that calls the new search system
  console.warn('filterExperts is deprecated, use searchExperts instead');
  return {
    experts: [],
    matchingCriteria: []
  };
}

export function extractKeywords(answers: UserAnswers): string[] {
  const keywords: string[] = [];
  
  Object.values(answers).forEach(value => {
    if (typeof value === 'string' && value.trim()) {
      const words = value.toLowerCase()
        .split(/[,\s]+/)
        .filter(word => word.length > 2)
        .filter(word => !['the', 'and', 'but', 'for', 'are', 'with', 'can', 'want', 'like', 'have', 'will'].includes(word));
      
      keywords.push(...words);
    }
  });
  
  return [...new Set(keywords)];
}

export function calculateMatchScore(expert: any, answers: UserAnswers): number {
  return expert.score || 0; // The new system provides scores directly
}