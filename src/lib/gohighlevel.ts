// GoHighLevel API client for contact management

export interface GoHighLevelContact {
  email: string;
  firstName?: string;
  lastName?: string;
  customFields?: Record<string, any>;
  tags?: string[];
}

export interface GoHighLevelResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export class GoHighLevelClient {
  private apiKey: string;
  private locationId: string;
  private baseUrl: string = 'https://rest.gohighlevel.com/v1';

  constructor(apiKey: string, locationId: string) {
    this.apiKey = apiKey;
    this.locationId = locationId;
  }

  async createContact(contactData: GoHighLevelContact): Promise<GoHighLevelResponse> {
    if (!this.apiKey || !this.locationId) {
      console.error('GoHighLevel: Missing API key or location ID');
      return { 
        success: false, 
        error: 'GoHighLevel configuration missing. Contact will be logged instead.' 
      };
    }

    try {
      // Use V1 API format: customField (singular) as object with field keys (not IDs)
      const customField: Record<string, string> = {};
      if (contactData.customFields) {
        for (const [fieldName, fieldValue] of Object.entries(contactData.customFields)) {
          if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
            // Convert arrays to strings if needed
            const processedValue = Array.isArray(fieldValue) 
              ? fieldValue.join(', ')  // Join arrays with comma
              : typeof fieldValue === 'object' 
                ? JSON.stringify(fieldValue)
                : String(fieldValue);

            // Use field names directly (not IDs for V1)
            customField[fieldName] = processedValue;
          }
        }
      }

      // Use V1 API endpoint with proper object format for custom fields  
      const payload = {
        email: contactData.email,
        firstName: contactData.firstName || '',
        lastName: contactData.lastName || '',
        locationId: this.locationId,
        customField: customField,  // V1 format: singular object with field names
        tags: contactData.tags || []
      };

      console.log('GoHighLevel V1: Creating contact with customField object format', JSON.stringify(payload, null, 2));

      const response = await fetch(`${this.baseUrl}/contacts/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`GoHighLevel API error (${response.status}):`, errorText);
        
        // Log the contact data for manual processing
        console.log('Contact data for manual processing:', JSON.stringify(contactData, null, 2));
        
        return {
          success: false,
          error: `API request failed: ${response.status} ${response.statusText}`
        };
      }

      const result = await response.json();
      console.log('GoHighLevel V1: Contact created successfully with customField format!', result);
      
      return {
        success: true,
        id: result.contact?.id || result.id || 'unknown'
      };

    } catch (error) {
      console.error('GoHighLevel: Network or parsing error', error);
      
      // Log the contact data for manual processing
      console.log('Contact data for manual processing:', JSON.stringify(contactData, null, 2));
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }
}

export const ghlClient = new GoHighLevelClient(
  process.env.GOHIGHLEVEL_API_KEY || '',
  process.env.GOHIGHLEVEL_LOCATION_ID || ''
);
