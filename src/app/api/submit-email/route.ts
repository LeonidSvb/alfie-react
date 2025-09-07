import { NextRequest, NextResponse } from 'next/server';
import { EmailSubmissionData, CRMSubmissionResponse } from '@/types/crm';
import { ghlClient, GoHighLevelContact } from '@/lib/gohighlevel';

export async function POST(request: NextRequest): Promise<NextResponse<CRMSubmissionResponse>> {
  try {
    const body = await request.json() as EmailSubmissionData;

    // Validate required fields
    if (!body.email || !body.questionnaireSummary || !body.flowType || !body.tripGuideId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: email, questionnaireSummary, flowType, or tripGuideId'
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format'
        },
        { status: 400 }
      );
    }

    // Map questionnaire data to GoHighLevel custom fields
    const questionnaire = body.questionnaireSummary;
    const flowType = body.flowType;
    
    // Extract and map fields based on flow-specific questionnaire structure
    const placeOfInterest = flowType === 'inspire-me'
      ? (Array.isArray(questionnaire.regions_interest) 
          ? questionnaire.regions_interest.join(', ') 
          : questionnaire.regions_interest || questionnaire.specific_regions || '')
      : (questionnaire.destination_main || questionnaire.stops || '');

    const travelerType = questionnaire.party_type || questionnaire.party_type_shared || '';

    const activityLevel = questionnaire.fitness_level || questionnaire.fitness_level_shared || '';

    // Map activity preferences based on flow type
    const activityPreferences = (() => {
      let activities = '';
      
      if (flowType === 'inspire-me') {
        activities = questionnaire.outdoor_activities || questionnaire.non_outdoor_interests || '';
      } else {
        activities = questionnaire.activities || '';
      }
      
      if (activities && Array.isArray(activities)) {
        return JSON.stringify(activities.flat()); // Flatten nested arrays
      } else if (activities) {
        return Array.isArray(activities) ? JSON.stringify(activities) : String(activities);
      }
      
      return '';
    })();

    // Map guided preferences based on flow type
    const guidedPreferences = (() => {
      let guided = '';
      
      if (flowType === 'inspire-me') {
        guided = questionnaire.guided_experiences || questionnaire.travel_style || '';
      } else {
        guided = questionnaire.guided_prefs || questionnaire.travel_style || '';
      }
      
      if (guided && Array.isArray(guided)) {
        return JSON.stringify(guided.flat()); // Flatten nested arrays
      } else if (guided) {
        return Array.isArray(guided) ? JSON.stringify(guided) : String(guided);
      }
      
      return '';
    })();

    // Map travel budget based on flow type
    const travelBudget = flowType === 'inspire-me'
      ? questionnaire.budget_style || ''
      : questionnaire.lodging_budget || '';

    // Map travel dates based on flow type
    const travelDates = flowType === 'inspire-me'
      ? questionnaire.season_window || questionnaire.trip_length_days || ''
      : questionnaire.season_window_shared || questionnaire.trip_length_days_shared || '';

    // Ensure all required fields have values (fallbacks to prevent empty fields)
    const ensureValue = (value: any, fallback: string = 'Not specified') => {
      if (!value || value === '' || value === '[]' || value === 'null') {
        return fallback;
      }
      return String(value);
    };

    // Create GoHighLevel contact with guaranteed field values
    const contact: GoHighLevelContact = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName,
      tags: ['tripguide-widget', body.flowType, ...body.tags],
      customFields: {
        planning_stage: ensureValue(body.flowType, 'General inquiry'),
        place_of_interest: ensureValue(placeOfInterest, 'To be determined'),
        traveler_type: ensureValue(travelerType, 'Individual traveler'),
        activity_level: ensureValue(activityLevel, 'Moderate activity'),
        activity_preferences: ensureValue(activityPreferences, 'General activities'),
        guided_preferences: ensureValue(guidedPreferences, 'Mix of guided and independent'),
        travel_budget: ensureValue(travelBudget, 'Budget to be discussed'),
        travel_dates: ensureValue(travelDates, 'Flexible timing'),
        full_survey_data: JSON.stringify(questionnaire)
      }
    };

    // Log field mapping for debugging
    console.log('GoHighLevel Field Mapping:', {
      flowType: body.flowType,
      email: body.email,
      originalData: Object.keys(questionnaire),
      mappedFields: {
        planning_stage: contact.customFields.planning_stage,
        place_of_interest: contact.customFields.place_of_interest,
        traveler_type: contact.customFields.traveler_type,
        activity_level: contact.customFields.activity_level,
        activity_preferences: contact.customFields.activity_preferences?.substring(0, 100) + '...',
        guided_preferences: contact.customFields.guided_preferences?.substring(0, 100) + '...',
        travel_budget: contact.customFields.travel_budget,
        travel_dates: contact.customFields.travel_dates
      }
    });

    const result = await ghlClient.createContact(contact);

    if (!result.success) {
      console.error('GoHighLevel contact creation failed:', result);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to save contact information. Please try again.'
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      contactId: result.id,
      message: 'Email submitted successfully and trip guide unlocked!'
    });

  } catch (error) {
    console.error('Email submission API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
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