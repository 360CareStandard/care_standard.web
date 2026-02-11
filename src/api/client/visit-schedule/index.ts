// src/api/.ts
import { VisitScheduleForm } from "@/pages/app/clients/schemas/visit-schedule";
import { StaffAvailabilityResponse } from "@/types/staff/availability";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const VisitScheduleApi = {
  list: async (id: string) => {
    return apiGet<StaffAvailabilityResponse>(
      `visit-schedule/clients/${id}/schedules`,
    ).then((r) => r?.data?.availabilities);
  },
  get: (clientId: string, scheduleId: string) =>
    apiGet<any>(
      `/visit-schedule/clients/${clientId}/schedules/${scheduleId}`,
    ).then((r) => r.data),

  update: (clientId: string, scheduleId: string, body: VisitScheduleForm) =>
    apiPatch<{ status: "success" }>(
      `/visit-schedule/clients/${clientId}/schedules/${scheduleId}`,
      body,
    ),
  post: (id: string, body: VisitScheduleForm) =>
    apiPost<{ status: "success" }>(
      `/visit-schedule/clients/${id}/schedules`,
      body,
    ),
  delete: (clientId: string, scheduleId: string) =>
    apiDelete(`/visit-schedule/clients/${clientId}/schedules/${scheduleId}`),
};
