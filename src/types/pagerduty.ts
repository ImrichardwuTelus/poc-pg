export interface PagerDutyService {
  id: string;
  name: string;
  description?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface PagerDutyApiResponse {
  services: PagerDutyService[];
  limit: number;
  offset: number;
  total: number;
  more: boolean;
}

export interface PagerDutyApiError {
  error: {
    message: string;
    code: number;
  };
}
