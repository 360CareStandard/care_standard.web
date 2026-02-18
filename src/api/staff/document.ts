// src/api/clients.ts
import { api } from "@/lib/axios";
import { StaffDocumentsResponse } from "@/types/staff/document";

export const StaffDocumentApi = {
  list: async (id: string) => {
    return api
      .get<StaffDocumentsResponse>(`/staff/documents/${id}`)
      .then((r) => r?.data.data?.documents);
  },

  delete: (id: string) =>
    api
      .delete<{ status: "success" }>(`/staff/document/${id}`)
      .then((r) => r.data),
  update: (id: string, formData: FormData) =>
    api
      .patch<{ status: "success" }>(`/staff/document/${id}`, formData)
      .then((r) => r.data),

  post: (id: string, formData: FormData) =>
    api
      .post<{ status: "success" }>(`/staff/documents/${id}`, formData)
      .then((r) => r.data), // ← FIXED
};
