export interface AssignmentConfig {
  id: string;
  facility_id: string;
  enabled: boolean;
  max_patients_per_staff: number;
  max_patients_in_total: number;
  skill_weight: number;
  workload_weight: number;
  max_retry_attempts: number;
  window_size: number;
}

export interface AssignmentConfigResponse {
  data: AssignmentConfig | null;
  configured: boolean;
}

export interface AssignmentConfigSaveRequest extends Omit<
  AssignmentConfig,
  "id"
> {}
