import {
  AssignmentConfig,
  AssignmentConfigResponse,
  AssignmentConfigSaveRequest,
} from "@/types/assignmentConfig";
import { HttpMethod } from "@/apis/types";
import { request } from "@/apis/query";
import {
  PaginatedResponse,
  QuickAssignFailureEvent,
} from "@/types/quickAssignEvent";

export const apis = {
  quick_assign_config: {
    get: (facility_id: string) =>
      request<AssignmentConfigResponse>(
        "/api/care_quick_assign/auto-assignment/config/",
        HttpMethod.GET,
        { facility_id },
      ),

    save: (data: AssignmentConfigSaveRequest) =>
      request<AssignmentConfig>(
        "/api/care_quick_assign/auto-assignment/config/save/",
        HttpMethod.POST,
        data,
      ),
  },
  quick_assignments: {
    unassigned: (facility_id: string, page: number = 1) =>
      request<PaginatedResponse<QuickAssignFailureEvent>>(
        "/api/care_quick_assign/assignments/unassigned/",
        HttpMethod.GET,
        { facility_id, page },
      ),
    retry: (facility_id: string, patient_id: string) =>
      request<{ message: string }>(
        `/api/care_quick_assign/assignments/unassigned/${patient_id}/retry/`,
        HttpMethod.POST,
        { facility_id },
      ),
  },
};
