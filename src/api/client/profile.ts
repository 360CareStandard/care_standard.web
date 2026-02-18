// src/api/clients.ts
import type {
  ClientDetailResponse,
  ClientsResponse,
} from "@/types/client/client";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const ClientsApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      q: params?.q ?? undefined,
    };
    return apiGet<ClientsResponse>("/client", { params: safe }).then(
      (r) => r.data,
    );
  },

  get: (id: string) =>
    apiGet<ClientDetailResponse>(`/client/${id}`).then((r) => r.data),
  update: (id: string, formData: FormData) =>
    apiPatch<{ status: "success" }>(`/client/${id}`, formData),

  post: (formData: FormData) =>
    apiPost<{ status: "success" }>("/client", formData),

  delete: (id: string) => apiDelete<{ status: "success" }>(`/clients/${id}`),
};
