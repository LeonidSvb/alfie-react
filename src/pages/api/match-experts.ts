import type { NextApiRequest, NextApiResponse } from 'next';

interface ExpertMatch {
  id: string;
  name: string;
  profession: string;
  email: string;
  shortBio: string;
  profileUrl: string;
  matchScore: number;
  matchedTags: string[];
}

interface MatchExpertsResponse {
  success: boolean;
  experts: ExpertMatch[];
  error?: string;
}

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = 'apptAJxE6IudBH8fW';
const AIRTABLE_TABLE_ID = 'tblgvgDuQm20rNVPV';

// All available tags from Airtable
const ALL_AVAILABLE_TAGS = [
  'activity_canyoning', 'activity_climbing', 'activity_diving', 'activity_hiking',
  'activity_mountaineering', 'activity_photography', 'activity_skiing', 'activity_trail_running',
  'activity_water_sports', 'activity_wildlife', 'cert_avalanche', 'cert_wfr',
  'country_australia', 'country_canada', 'country_indonesia', 'country_new_zealand',
  'country_norway', 'country_peru', 'country_philippines', 'country_us',
  'dest_andes', 'dest_bali', 'dest_cairns', 'dest_canyonlands', 'dest_cascades',
  'dest_death_valley', 'dest_grand_canyon', 'dest_great_barrier_reef', 'dest_lofoten',
  'dest_mt_rainier', 'dest_olympic', 'dest_patagonia', 'dest_sedona', 'dest_turks_caicos',
  'dest_yellowstone', 'dest_yosemite', 'dest_zion', 'lang_english', 'lang_french',
  'lang_german', 'lang_japanese', 'lang_spanish', 'level_advanced', 'level_beginner',
  'level_extreme', 'region_alaska', 'region_arizona', 'region_california', 'region_colorado',
  'region_utah', 'region_washington', 'role_guide', 'role_instructor', 'role_photographer',
  'spec_backcountry', 'spec_canyon', 'spec_desert', 'spec_family', 'spec_mountain',
  'spec_underwater', 'traveler_60plus', 'traveler_beginners', 'traveler_extreme',
  'traveler_families', 'traveler_solo'
];

// Convert user answers to tags using OpenAI
async function generateTagsFromAnswers(answers: Record<string, any>): Promise<string[]> {
  try {
    const prompt = `Based on these user answers about their trip, select the most relevant tags from the available list.

USER ANSWERS:
${JSON.stringify(answers, null, 2)}

AVAILABLE TAGS:
${ALL_AVAILABLE_TAGS.join(', ')}

Rules:
1. Only use tags from the available list above
2. Select 5-10 most relevant tags
3. Consider: destination, activities, traveler type, experience level
4. Return as JSON array of strings
5. Be very selective - only choose highly relevant tags

Return format: ["tag1", "tag2", "tag3"]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();
    
    if (!content) {
      throw new Error('No content from OpenAI');
    }

    // Parse JSON response
    const tags = JSON.parse(content);
    
    // Validate tags
    const validTags = tags.filter((tag: string) => ALL_AVAILABLE_TAGS.includes(tag));
    
    console.log('Generated tags:', validTags);
    return validTags;

  } catch (error) {
    console.error('Error generating tags:', error);
    return []; // Return empty array on error
  }
}

// Fetch experts from Airtable
async function fetchExperts(): Promise<any[]> {
  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    return data.records || [];

  } catch (error) {
    console.error('Error fetching experts:', error);
    return [];
  }
}

// Calculate match score between user tags and expert tags
function calculateMatchScore(userTags: string[], expertTags: string[]): { score: number; matchedTags: string[] } {
  const matchedTags = userTags.filter(tag => expertTags.includes(tag));
  const score = matchedTags.length / Math.max(userTags.length, 1) * 100;
  
  return { score: Math.round(score), matchedTags };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MatchExpertsResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, experts: [], error: 'Method not allowed' });
  }

  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({ 
        success: false, 
        experts: [], 
        error: 'Invalid answers provided' 
      });
    }

    // Step 1: Generate tags from user answers
    const userTags = await generateTagsFromAnswers(answers);
    
    if (userTags.length === 0) {
      return res.status(200).json({ 
        success: true, 
        experts: [], 
      });
    }

    // Step 2: Fetch experts from Airtable
    const expertsData = await fetchExperts();
    
    if (expertsData.length === 0) {
      return res.status(200).json({ 
        success: true, 
        experts: [], 
      });
    }

    // Step 3: Calculate matches and scores
    const expertMatches: ExpertMatch[] = [];

    for (const record of expertsData) {
      const fields = record.fields;
      const expertTags = fields.All_Tags || [];
      
      const { score, matchedTags } = calculateMatchScore(userTags, expertTags);
      
      // Only include experts with at least 20% match
      if (score >= 20 && fields.Name && fields.Email) {
        expertMatches.push({
          id: record.id,
          name: fields.Name,
          profession: fields.Profession || 'Travel Expert',
          email: fields.Email,
          shortBio: fields.Short_Bio || '',
          profileUrl: fields.Profile_URL || '',
          matchScore: score,
          matchedTags: matchedTags,
        });
      }
    }

    // Sort by match score (highest first) and limit to top 5
    const topExperts = expertMatches
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    console.log(`Found ${topExperts.length} expert matches`);

    return res.status(200).json({
      success: true,
      experts: topExperts,
    });

  } catch (error) {
    console.error('Expert matching error:', error);
    return res.status(500).json({
      success: false,
      experts: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    });
  }
}