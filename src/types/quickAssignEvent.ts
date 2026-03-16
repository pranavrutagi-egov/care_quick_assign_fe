export interface QuickAssignFailureEventEvent {
  id: string,
  patient: {
    id: string;
    name: string,
  },
  facility_id: string;
  status: string;
  failure_reason: string;
  retry_count: string;
  triggered_at: Date
}

