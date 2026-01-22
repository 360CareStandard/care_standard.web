// src/api/clients.ts
import { api } from "@/lib/axios";
import { StaffSkillResponse } from "@/types/staff/skill";

export const StaffSkillApi = {
  list: async (id: string) => {
    return api
      .get<StaffSkillResponse>(`/staff/skills/${id}`)
      .then((r) => r?.data.data?.skills);
  },

  delete: (id: string) =>
    api
      .delete<{ status: "success" }>(`/staff/skills/${id}`)
      .then((r) => r.data),
  update: (id: string, formData: FormData) =>
    api
      .patch<{ status: "success" }>(`/staff/skills/${id}`, formData)
      .then((r) => r.data),

  post: (id: string, formData: FormData) =>
    api
      .post<{ status: "success" }>(`/staff/skills/${id}`, formData)
      .then((r) => r.data), // ← FIXED
};
