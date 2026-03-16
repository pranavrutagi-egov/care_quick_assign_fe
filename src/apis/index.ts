import {
  AssignmentConfig,
  AssignmentConfigResponse,
  AssignmentConfigSaveRequest,
} from "@/types/assignmentConfig";
import { HttpMethod } from "@/apis/types";
import { request } from "@/apis/query";
// import { QuickAssignFailureEventEvent } from "@/types/quickAssignEvent";

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
  // quick_assigned: {
  //   unassigned: (facility_id : string) => request<QuickAssignFailureEventEvent>(
  //     "/api/care_quick_assign/assignments/unassigned/",
  //     HttpMethod.GET,
  //     { facility_id },
  //   ),
  //   // retry: (facility_id: string, patient_id: string) => request<
  // }
};
