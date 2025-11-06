// src/api/clients.ts
import { api } from "@/lib/axios";
import { ClientFormData } from "@/pages/app/clients/schemas/add-client";
import type {
  Client,
  ClientDetailResponse,
  ClientsResponse,
  UpdateClientBody,
} from "@/types/client/client";

export const ClientsApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      q: params?.q ?? undefined,
    };
    return api
      .get<ClientsResponse>("/client", { params: safe })
      .then((r) => r.data);
  },

  get: (id: string) =>
    api.get<ClientDetailResponse>(`/client/${id}`).then((r) => r.data.data),

  update: (id: string, body: UpdateClientBody) =>
    api.patch<Client>(`/client/${id}`, body).then((r) => r.data),

  post: (body: ClientFormData) =>
    api.post<Client>("/client", body).then((r) => r.data), // ← FIXED

  delete: (id: string) =>
    api.delete<{ status: "success" }>(`/clients/${id}`).then((r) => r.data),
};
