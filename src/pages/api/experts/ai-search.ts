import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

interface UserAnswers {
  [key: string]: any;
}

interface ExpertRecord {
  id: string;
  fields: {
    Name: string;
    Location_Tags?: string[];
    Activity_Tags?: string[];
    Traveler_Tags?: string[];
    Expertise_Tags?: string[];
    Language_Tags?: string[];
    All_Tags?: string[];
    Bio?: string;
    Contact_Link?: string;
    Image?: string;
    Rating?: number;
    Review_Count?: number;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answers }: { answers: UserAnswers } = req.body;
    
    console.log('🤖 AI Expert Search started with answers:', answers);

    // Step 1: Get all experts and extract unique tags
    const allExperts = await getAllExpertsFromAirtable();
    const allAvailableTags = extractAllUniqueTags(allExperts);
    
    console.log(`📊 Found ${allExperts.length} experts with ${allAvailableTags.length} unique tags`);
    console.log('🏷️ Available tags:', allAvailableTags.slice(0, 20), '...');

    // Step 2: Use AI to generate relevant tags based on user answers
    const aiGeneratedTags = await generateRelevantTags(answers, allAvailableTags);
    
    console.log('🧠 AI generated tags:', aiGeneratedTags);

    // Step 3: Create Airtable formula using AI-generated tags
    const airtableFormula = createAirtableFormula(aiGeneratedTags);
    
    console.log('📝 Airtable formula:', airtableFormula);

    // Step 4: Query Airtable with the smart formula
    const matchingExperts = await queryExpertsWithFormula(airtableFormula);
    
    console.log(`🎯 Found ${matchingExperts.length} matching experts`);

    // Step 5: Format results
    const formattedResults = {
      success: true,
      totalFound: matchingExperts.length,
      generatedTags: aiGeneratedTags,
      airtableFormula: airtableFormula,
      experts: matchingExperts.map(expert => ({
        id: expert.id,
        name: expert.fields.Name,
        bio: expert.fields.Bio || '',
        image: expert.fields.Image || '/images/default-expert.jpg',
        contactLink: expert.fields.Contact_Link || '',
        rating: expert.fields.Rating || 0,
        reviewCount: expert.fields.Review_Count || 0,
        tags: {
          locations: expert.fields.Location_Tags || [],
          activities: expert.fields.Activity_Tags || [],
          travelers: expert.fields.Traveler_Tags || [],
          expertise: expert.fields.Expertise_Tags || [],
          languages: expert.fields.Language_Tags || []
        }
      })),
      metadata: {
        totalExpertsInDatabase: allExperts.length,
        totalAvailableTags: allAvailableTags.length,
        aiProcessingTime: Date.now(),
        userAnswerKeys: Object.keys(answers)
      }
    };

    res.status(200).json(formattedResults);

  } catch (error) {
    console.error('❌ AI Expert Search failed:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: 'Check server logs for more information'
    });
  }
}

// Get all experts from Airtable
async function getAllExpertsFromAirtable(): Promise<ExpertRecord[]> {
  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
  const BASE_ID = 'apptAJxE6IudBH8fW';
  const TABLE_ID = 'tblgvgDuQm20rNVPV';

  let allRecords: any[] = [];
  let offset: string | undefined = undefined;

  do {
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}${offset ? `?offset=${offset}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    allRecords = allRecords.concat(data.records);
    offset = data.offset;

  } while (offset);

  return allRecords
    .filter(record => record.fields.Name)
    .map(record => ({
      id: record.id,
      fields: record.fields
    }));
}

// Extract all unique tags from all experts
function extractAllUniqueTags(experts: ExpertRecord[]): string[] {
  const allTags = new Set<string>();
  
  experts.forEach(expert => {
    // Add tags from all tag fields
    const tagFields = [
      expert.fields.Location_Tags,
      expert.fields.Activity_Tags, 
      expert.fields.Traveler_Tags,
      expert.fields.Expertise_Tags,
      expert.fields.Language_Tags,
      expert.fields.All_Tags
    ];
    
    tagFields.forEach(tagArray => {
      if (Array.isArray(tagArray)) {
        tagArray.forEach(tag => allTags.add(tag));
      }
    });
  });

  return Array.from(allTags).sort();
}

// Use OpenAI to generate relevant tags based on user answers
async function generateRelevantTags(answers: UserAnswers, availableTags: string[]): Promise<string[]> {
  const prompt = `
You are an expert travel matching system. Your task is to analyze user travel preferences and select the most relevant tags from our expert database.

USER ANSWERS:
${JSON.stringify(answers, null, 2)}

AVAILABLE EXPERT TAGS:
${availableTags.join(', ')}

INSTRUCTIONS:
1. Analyze the user's travel preferences, destination, activities, party type, fitness level, etc.
2. Select the most relevant tags from the available tags that would match this user's needs
3. Consider semantic relationships (e.g., "Nepal" → country_nepal, region_himalaya, mountain_adventure)
4. Include activity tags, location tags, traveler type tags, expertise level tags, etc.
5. Be intelligent about synonyms and related concepts
6. Return 5-15 most relevant tags as a JSON array

EXAMPLE:
For user wanting "adventure in Nepal with hiking and families":
["country_nepal", "region_himalaya", "activity_hiking", "activity_trekking", "traveler_families", "level_moderate", "mountain_adventure"]

Respond with only a JSON array of relevant tag names:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system", 
          content: "You are a travel expert who matches user preferences to travel expert tags. Respond only with a JSON array of relevant tag names."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const content = response.choices[0]?.message?.content?.trim();
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse JSON response
    try {
      const tags = JSON.parse(content);
      if (Array.isArray(tags)) {
        // Filter to only include tags that exist in our available tags
        const validTags = tags.filter(tag => availableTags.includes(tag));
        console.log(`🧠 AI selected ${validTags.length} valid tags out of ${tags.length} suggested`);
        return validTags;
      } else {
        throw new Error('AI response is not an array');
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', content);
      // Fallback: extract tag-like strings from response
      const tagMatches = content.match(/[a-zA-Z_]+/g) || [];
      const validFallbackTags = tagMatches.filter(tag => availableTags.includes(tag));
      return validFallbackTags.slice(0, 10);
    }

  } catch (error) {
    console.error('❌ OpenAI tag generation failed:', error);
    // Fallback to basic keyword matching
    return generateFallbackTags(answers, availableTags);
  }
}

// Fallback tag generation if AI fails
function generateFallbackTags(answers: UserAnswers, availableTags: string[]): string[] {
  const fallbackTags: string[] = [];
  const answersText = JSON.stringify(answers).toLowerCase();
  
  // Simple keyword matching as fallback
  availableTags.forEach(tag => {
    const tagKeywords = tag.toLowerCase().replace(/_/g, ' ').split(' ');
    if (tagKeywords.some(keyword => answersText.includes(keyword))) {
      fallbackTags.push(tag);
    }
  });
  
  return fallbackTags.slice(0, 10);
}

// Create Airtable formula using generated tags
function createAirtableFormula(tags: string[]): string {
  if (tags.length === 0) {
    return '';
  }
  
  // Create OR conditions for each tag across all tag fields
  const tagFields = ['Location_Tags', 'Activity_Tags', 'Traveler_Tags', 'Expertise_Tags', 'Language_Tags', 'All_Tags'];
  
  const conditions = tags.map(tag => {
    const fieldConditions = tagFields.map(field => 
      `FIND("${tag}", ARRAYJOIN({${field}}, ",")) > 0`
    ).join(', ');
    
    return `OR(${fieldConditions})`;
  });
  
  return `OR(${conditions.join(', ')})`;
}

// Query Airtable with the generated formula
async function queryExpertsWithFormula(formula: string): Promise<ExpertRecord[]> {
  if (!formula) {
    return [];
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY || 'patt4GHq4ij1rNAdK.9b230d9e4002e265f7a89f6e208fd0d3145d1f495d66eb092252b8da7559da9d';
  const BASE_ID = 'apptAJxE6IudBH8fW';
  const TABLE_ID = 'tblgvgDuQm20rNVPV';

  try {
    // URL encode the formula
    const encodedFormula = encodeURIComponent(formula);
    const url = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}?filterByFormula=${encodedFormula}&maxRecords=20`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Airtable formula query failed: ${response.status}`);
      // Fallback to get all experts if formula fails
      return await getAllExpertsFromAirtable();
    }

    const data = await response.json();
    
    return data.records
      .filter((record: any) => record.fields.Name)
      .map((record: any) => ({
        id: record.id,
        fields: record.fields
      }));

  } catch (error) {
    console.error('❌ Airtable formula query error:', error);
    // Fallback to get all experts
    return await getAllExpertsFromAirtable();
  }
}