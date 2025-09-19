import { PagerDutyService, PagerDutyApiResponse, PagerDutyApiError } from '@/types/pagerduty';

// Mock PagerDuty API service for demonstration
// In a real implementation, you would use the actual PagerDuty API
export class PagerDutyApiService {
  private apiToken: string;
  private baseUrl: string = 'https://api.pagerduty.com';

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  async getServices(query?: string): Promise<PagerDutyService[]> {
    try {
      // For demonstration purposes, return mock data
      // In a real implementation, you would make an actual API call
      const mockServices: PagerDutyService[] = [
        {
          id: 'P1DTXQY',
          name: 'Dynatrace Production Service',
          description: 'Production monitoring service for Dynatrace',
          status: 'active',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-20T14:45:00Z',
        },
        {
          id: 'P2DTXQZ',
          name: 'Dynatrace Staging Service',
          description: 'Staging environment monitoring service',
          status: 'active',
          created_at: '2024-01-16T09:15:00Z',
          updated_at: '2024-01-18T11:20:00Z',
        },
        {
          id: 'P3DTXQA',
          name: 'Application Performance Monitoring',
          description: 'APM service for application monitoring',
          status: 'active',
          created_at: '2024-01-10T08:00:00Z',
          updated_at: '2024-01-25T16:30:00Z',
        },
        {
          id: 'P4DTXQB',
          name: 'Infrastructure Monitoring',
          description: 'Infrastructure monitoring and alerting',
          status: 'active',
          created_at: '2024-01-12T12:45:00Z',
          updated_at: '2024-01-22T10:15:00Z',
        },
      ];

      // Filter services based on query if provided
      if (query) {
        const filteredServices = mockServices.filter(
          service =>
            service.name.toLowerCase().includes(query.toLowerCase()) ||
            (service.description && service.description.toLowerCase().includes(query.toLowerCase()))
        );
        return filteredServices;
      }

      return mockServices;
    } catch (error) {
      console.error('Error fetching PagerDuty services:', error);
      throw new Error('Failed to fetch services from PagerDuty');
    }
  }

  // Real implementation would look like this:
  /*
  async getServices(query?: string): Promise<PagerDutyService[]> {
    try {
      const params = new URLSearchParams({
        limit: '100',
        ...(query && { query }),
      });

      const response = await fetch(`${this.baseUrl}/services?${params}`, {
        headers: {
          'Authorization': `Token token=${this.apiToken}`,
          'Accept': 'application/vnd.pagerduty+json;version=2',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`PagerDuty API error: ${response.status}`);
      }

      const data: PagerDutyApiResponse = await response.json();
      return data.services;
    } catch (error) {
      console.error('Error fetching PagerDuty services:', error);
      throw error;
    }
  }
  */
}

// Factory function to create PagerDuty API service
export function createPagerDutyService(apiToken?: string): PagerDutyApiService {
  // In a real implementation, you would get the API token from environment variables
  // or user configuration
  const token = apiToken || process.env.PAGERDUTY_API_TOKEN || 'mock-token';
  return new PagerDutyApiService(token);
}
