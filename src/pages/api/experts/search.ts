import { NextApiRequest, NextApiResponse } from 'next';
import { ImprovedExpertMatcher, ExpertMatchRequest } from '@/utils/ImprovedExpertMatcher';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const searchRequest: ExpertMatchRequest = req.body;
    
    console.log('🔍 Expert search API called with request:', JSON.stringify(searchRequest, null, 2));
    
    const matcher = new ImprovedExpertMatcher();
    
    // First, load all experts if not already loaded
    console.log('📥 Loading experts from Airtable...');
    const allExperts = await matcher.getAllExperts();
    console.log(`✅ Loaded ${allExperts.length} experts from Airtable`);
    
    // Search for matching experts
    console.log('🎯 Running expert matching algorithm...');
    const results = matcher.findExperts(searchRequest);
    console.log(`🎉 Found ${results.totalFound} matching experts`);
    
    // Format results for frontend
    const formattedResults = {
      success: true,
      totalFound: results.totalFound,
      experts: results.experts.map(result => ({
        id: result.expert.id,
        name: result.expert.fields.Name,
        bio: result.expert.fields.Bio || '',
        image: result.expert.fields.Image || '/images/default-expert.jpg',
        contactLink: result.expert.fields.Contact_Link || '',
        rating: result.expert.fields.Rating || 0,
        reviewCount: result.expert.fields.Review_Count || 0,
        score: result.score,
        matchReasons: result.reasons,
        // Extract relevant tags for display
        specialties: result.expert.fields.Activity_Tags || [],
        locations: result.expert.fields.Location_Tags || [],
        languages: result.expert.fields.Language_Tags || [],
      })),
      filterSteps: results.filterSteps,
      fallbackSuggestions: results.fallbackSuggestions
    };
    
    res.status(200).json(formattedResults);
    
  } catch (error) {
    console.error('Error searching experts:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}