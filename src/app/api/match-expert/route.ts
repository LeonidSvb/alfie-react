import { NextRequest, NextResponse } from 'next/server';
import { ExpertMatchRequest, ExpertMatchResponse } from '@/types/expert';
import { matchExpertWithQuestionnaire } from '@/lib/expertMatcher';

export async function POST(request: NextRequest) {
  try {
    const body: ExpertMatchRequest = await request.json();
    
    if (!body.questionnaireSummary || !body.flowType) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: questionnaireSummary and flowType',
        } as ExpertMatchResponse,
        { status: 400 }
      );
    }

    if (!['inspire-me', 'i-know-where'].includes(body.flowType)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid flowType. Must be "inspire-me" or "i-know-where"',
        } as ExpertMatchResponse,
        { status: 400 }
      );
    }

    const { expert, matchScore, tagsUsed } = await matchExpertWithQuestionnaire(
      body.questionnaireSummary,
      body.flowType,
      body.userTags
    );

    if (!expert) {
      return NextResponse.json(
        {
          success: false,
          error: 'No suitable expert found for your travel preferences',
          tagsUsed,
        } as ExpertMatchResponse,
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        expert,
        matchScore,
        tagsUsed,
      } as ExpertMatchResponse,
      { status: 200 }
    );

  } catch (error) {
    console.error('Error in match-expert API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error while matching expert',
      } as ExpertMatchResponse,
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      message: 'Expert matching API endpoint',
      methods: ['POST'],
      requiredFields: ['questionnaireSummary', 'flowType'],
      optionalFields: ['userTags'],
    },
    { status: 200 }
  );
}