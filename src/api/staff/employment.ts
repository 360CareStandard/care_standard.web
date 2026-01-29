// src/api/clients.ts
import { api } from "@/lib/axios";
import { EmploymentForm } from "@/pages/app/staff/schemas/employment";
import { StaffEmploymentResponse } from "@/types/staff/employment";

export const StaffEmploymentApi = {
  //   get: (id: string) =>
  //     api
  //       .get<StaffEmploymentResponse>(`/staff/employmentDetails/${id}`)
  //       .then((r) => {
  //         const payload = r?.data?.data;
  //         console.log(payload);

  //         if (!payload) return undefined;
  //         // server returns `works` in your response body (not workss)
  //         if (payload.employmentDetails)
  //           return payload.employmentDetails[0] as employmentDetails;
  //         // fallback if server returns `workss` array for some reason
  //       }),
  get: (id: string) =>
    api
      .get<StaffEmploymentResponse>(`/staff/employmentDetails/${id}`)
      .then((r) => {
        const details = r.data.data.employmentDetails;

        return details.length ? details[0] : null;
      }),

  update: (id: string, body: EmploymentForm) =>
    api
      .patch<{ status: "success" }>(`/staff/employmentDetail/${id}`, body)
      .then((r) => r.data),

  post: (id: string, body: EmploymentForm) =>
    api
      .post<{ status: "success" }>(`/staff/employmentDetails/${id}`, body)
      .then((r) => r.data), // ← FIXED
};
