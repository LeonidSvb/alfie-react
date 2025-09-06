import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.GOHIGHLEVEL_API_KEY;
  const locationId = process.env.GOHIGHLEVEL_LOCATION_ID;
  
  if (!apiKey || !locationId) {
    return NextResponse.json({ 
      error: 'Missing GoHighLevel credentials' 
    }, { status: 400 });
  }

  try {
    // Get custom fields using v2 API endpoint
    const fieldsResponse = await fetch(`https://services.leadconnectorhq.com/locations/${locationId}/customFields`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Version': '2021-07-28'
      }
    });

    const fieldsData = fieldsResponse.ok ? await fieldsResponse.json() : null;
    console.log('Custom Fields Response:', JSON.stringify(fieldsData, null, 2));

    // Also try V1 endpoint for comparison
    const fieldsV1Response = await fetch(`https://rest.gohighlevel.com/v1/custom-fields/`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const fieldsV1Data = fieldsV1Response.ok ? await fieldsV1Response.json() : null;
    console.log('V1 Custom Fields Response:', JSON.stringify(fieldsV1Data, null, 2));

    // Get specific contact to see current structure - working example
    const workingContactId = 'C8wZPQlANXsCUWh7cbOY';
    const workingContactResponse = await fetch(`https://rest.gohighlevel.com/v1/contacts/${workingContactId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const workingContactData = workingContactResponse.ok ? await workingContactResponse.json() : null;
    console.log('Working Contact Data:', JSON.stringify(workingContactData, null, 2));

    // Also get our test contact
    const testContactId = 'p7sTlGKx3e2xzlh83YOM';
    const contactResponse = await fetch(`https://rest.gohighlevel.com/v1/contacts/${testContactId}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const contactData = contactResponse.ok ? await contactResponse.json() : null;
    console.log('Test Contact Data:', JSON.stringify(contactData, null, 2));

    return NextResponse.json({
      success: true,
      v2CustomFields: fieldsData,
      v1CustomFields: fieldsV1Data,
      workingContact: workingContactData,
      testContact: contactData,
      info: 'Comparison: working contact with custom fields vs our test contact',
      contacts: {
        working: workingContactId,
        test: testContactId
      }
    });

  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}