// src/api/.ts
import { VisitScheduleForm, VisitScheduleNoteForm } from "@/pages/app/clients/schemas/visit-schedule";
import { VisitScheduleNotesResponse } from "@/types/client/visit-notes";
import {
  VisitScheduleResponse,
  VisitSchedulesResponse,
} from "@/types/client/visit-schedule";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const VisitScheduleApi = {
  list: async (id: string) => {
    return apiGet<VisitSchedulesResponse>(
      `visit-schedule/clients/${id}/schedules`,
    ).then((r) => r?.data);
  },
  get: (clientId: string, scheduleId: string) =>
    apiGet<VisitScheduleResponse>(
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
  createNote: (scheduleId: string, body: VisitScheduleNoteForm) =>
    apiPost(`/visit-schedule/schedules/${scheduleId}/notes`, body),
  getNote: (scheduleId: string) =>
    apiGet<VisitScheduleNotesResponse>(`/visit-schedule/schedules/${scheduleId}/notes`).then((r) => r.data)
};
