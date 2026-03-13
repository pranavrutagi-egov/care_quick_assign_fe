import {
  AssignmentConfig,
  AssignmentConfigSaveRequest,
} from "@/types/assignmentConfig";
import { HttpMethod } from "@/apis/types";
import { request } from "@/apis/query";

export const apis = {
  quick_assign_config: {
    get: (facility_id: string) =>
      request<AssignmentConfig>(
        "/api/care_quick_assign/auto-assignment/config/",
        HttpMethod.GET,
        { facility_id },
      ),

    save: (data: AssignmentConfigSaveRequest) =>
      request<AssignmentConfigSaveRequest>(
        "/api/care_quick_assign/auto-assignment/config/save/",
        HttpMethod.POST,
        data,
      ),
  },
};
