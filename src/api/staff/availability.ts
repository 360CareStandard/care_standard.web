// src/api/.ts
import { api } from "@/lib/axios";
import { StaffAvailabilityForm } from "@/pages/app/staff/schemas/availability";
import { StaffBookAbsenceForm } from "@/pages/app/staff/schemas/book-absence";
import { StaffAvailabilityResponse } from "@/types/staff/availability";
import { apiPost } from "@/utils/api-connect";

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
      .then((r) => r.data), // â† FIXED


  delete: (id: string) =>
    api
      .delete<{ status: "success" }>(`/staff/availability/${id}`)
      .then((r) => r.data),
  bookAbsence: (id: string, body: StaffBookAbsenceForm) =>
    apiPost<{ status: "success" }>(`/staff/absence/${id}`, body),// â† FIXED
  getAbsence: (id: string) =>
    api
      .get(`/staff/absence/${id}`)
      .then((r) => r.data), // â† FIXED

};
