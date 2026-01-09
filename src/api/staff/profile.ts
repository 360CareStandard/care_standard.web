// src/api/clients.ts
import { api } from "@/lib/axios";

export const StaffProfileApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      search: params?.q ?? undefined,
    };
    return api
      .get<any[]>("/staff/staffRecords", { params: safe })
      .then((r) => r.data);
  },

  update: (id: string, formData: FormData) =>
    api
      .patch<{ status: "success" }>(`/staff/staffRecord/${id}`, formData)
      .then((r) => r.data),

  post: (formData: FormData) =>
    api
      .post<{ status: "success" }>(`/staff/addStaff`, formData)
      .then((r) => r.data), // ← FIXED
};
