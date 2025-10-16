// src/api/clients.ts
import { api } from "@/lib/axios";
import type {
  ClientListResponse,
  ClientResponse,
  UpdateClientBody,
} from "@/types/client";

export const ClientsApi = {
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    api.get<ClientListResponse>("/clients", { params }).then((r) => r.data),

  get: (id: string) =>
    api.get<ClientResponse>(`/clients/${id}`).then((r) => r.data),

  update: (id: string, body: UpdateClientBody) =>
    api.patch<ClientResponse>(`/clients/${id}`, body).then((r) => r.data),

  delete: (id: string) =>
    api.delete<{ status: "success" }>(`/clients/${id}`).then((r) => r.data),
};
