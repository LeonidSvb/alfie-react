import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🟢 Health check called');
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: request.method 
  });
}

export async function POST(request: NextRequest) {
  console.log('🟢 Health check POST called');
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    method: request.method 
  });
}