export interface QuickAssignFailureEvent {
  id: string;
  patient: {
    id: string;
    name: string;
  };
  facility_id: string;
  status: string;
  failure_reason: string | null;
  retry_count: number;
  triggered_at: string;
  completed_at: string | null;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
