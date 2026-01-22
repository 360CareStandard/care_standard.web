// src/api/clients.ts
import { api } from "@/lib/axios";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { StaffWorkDetailsResponse, workDetails } from "@/types/staff/work";

export const StaffWorkApi = {
  get: (id: string) =>
    api.get<StaffWorkDetailsResponse>(`/staff/workDetails/${id}`).then((r) => {
      const payload = r?.data?.data;
      if (!payload) return undefined;
      // server returns `works` in your response body (not workss)
      if (payload.workDetails) return payload.workDetails[0] as workDetails;
      // fallback if server returns `workss` array for some reason
    }),

  update: (id: string, body: StaffWorkForm) =>
    api
      .patch<{ status: "success" }>(`/staff/workDetails/${id}`, body)
      .then((r) => r.data),

  post: (id: string, body: StaffWorkForm) =>
    api
      .post<{ status: "success" }>(`/staff/workDetails/${id}`, body)
      .then((r) => r.data), // ← FIXED
};
