// src/api/clients.ts
import { api } from "@/lib/axios";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";
import { StaffWorkDetailsResponse } from "@/types/staff/work";

export const StaffWorkApi = {
  get: (id: string) =>
    api.get<StaffWorkDetailsResponse>(`/staff/workDetails/${id}`).then((r) => {
      const details = r.data.data?.workDetails;

      return details.length ? details[0] : null;
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
