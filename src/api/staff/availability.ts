// src/api/.ts
import { api } from "@/lib/axios";
import { StaffAvailabilityForm } from "@/pages/app/staff/schemas/availability";
import { StaffAvailabilityResponse } from "@/types/staff/availability";

export const StaffAvailabilityApi = {
  list: async (id: string) => {
    return api
      .get<StaffAvailabilityResponse>(`/staff/availability/${id}`)
      .then((r) => r?.data.data?.availabilities);
  },
  update: (id: string, body: StaffAvailabilityForm) =>
    api
      .patch<{ status: "success" }>(`/staff/availability/${id}`, body)
      .then((r) => r.data),

  post: (id: string, body: StaffAvailabilityForm) =>
    api
      .post<{ status: "success" }>(`/staff/availability/${id}`, body)
      .then((r) => r.data), // ← FIXED
};
