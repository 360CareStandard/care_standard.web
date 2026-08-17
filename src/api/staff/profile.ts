// src/api/staff/profile.ts
import { apiGet, apiPost, apiPatch, apiDelete } from "@/utils/api-connect";
import { StaffListResponse, StaffResponse } from "@/types/staff";
import { GetStaffWithAssignedClientsResponse } from "@/types/staff/assigned-client";

export const StaffProfileApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      search: params?.q ?? undefined,
    };

    return apiGet<StaffListResponse>("/staff/staffRecords", safe).then(
      (r) => r.data,
    );
  },

  get: (id: string) =>
    apiGet<StaffResponse>(`/staff/staffRecord/${id}`).then((r) => r.data),

  post: (formData: FormData) =>
    apiPost<{ status: "success" }>("/staff/addStaff", formData),

  update: (id: string, formData: FormData) =>
    apiPatch<{ status: "success" }>(`/staff/staffRecord/${id}`, formData),

  remove: (id: string) =>
    apiDelete<{ status: "success" }>(`/staff/staffRecord/${id}`),

  getStaffWithClients: (id: string) =>
    apiGet<GetStaffWithAssignedClientsResponse>(`/staff/staff-with-clients/${id}`).then((r) => r.data),
};