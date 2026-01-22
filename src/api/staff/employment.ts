// src/api/clients.ts
import { api } from "@/lib/axios";
import { EmploymentForm } from "@/pages/app/staff/schemas/employment";
import {
  employmentDetails,
  StaffEmploymentResponse,
} from "@/types/staff/employment";

export const StaffEmploymentApi = {
  get: (id: string) =>
    api
      .get<StaffEmploymentResponse>(`/staff/employmentDetails/${id}`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `works` in your response body (not workss)
        if (payload.employmentDetails)
          return payload.employmentDetails[0] as employmentDetails;
        // fallback if server returns `workss` array for some reason
      }),

  update: (id: string, body: EmploymentForm) =>
    api
      .patch<{ status: "success" }>(`/staff/employmentDetails/${id}`, body)
      .then((r) => r.data),

  post: (id: string, body: EmploymentForm) =>
    api
      .post<{ status: "success" }>(`/staff/employmentDetails/${id}`, body)
      .then((r) => r.data), // ← FIXED
};
