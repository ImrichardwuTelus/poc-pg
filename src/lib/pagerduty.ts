import { PagerDutyService, PagerDutyApiResponse, PagerDutyApiError } from '@/types/pagerduty';

// PagerDuty API service for real API integration
export class PagerDutyApiService {
  private apiToken: string;
  private baseUrl: string = 'https://api.pagerduty.com';

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  async getServices(query?: string): Promise<PagerDutyService[]> {
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(query && { query }),
      });

      const response = await fetch(`${this.baseUrl}/services?${params}`, {
        headers: {
          Authorization: `Token token=${this.apiToken}`,
          Accept: 'application/vnd.pagerduty+json;version=2',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`PagerDuty API error: ${response.status} - ${errorText}`);
      }

      const data: PagerDutyApiResponse = await response.json();
      return data.services || [];
    } catch (error) {
      console.error('Error fetching PagerDuty services:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch services from PagerDuty');
    }
  }
}

export function createPagerDutyService(apiToken?: string): PagerDutyApiService {
  const token = apiToken || process.env.PAGERDUTY_API_TOKEN || 'mock-token';
  return new PagerDutyApiService(token);
}
