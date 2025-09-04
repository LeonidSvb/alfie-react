import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🟢 Generate-trip GET called');
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: request.method,
    endpoint: 'generate-trip'
  });
}

export async function POST(request: NextRequest) {
  console.log('🟢 Generate-trip POST called');
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: request.method,
    endpoint: 'generate-trip'
  });
}