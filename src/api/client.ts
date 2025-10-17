// src/api/clients.ts
import { api } from "@/lib/axios";
import { ClientFormData } from "@/pages/app/clients/schemas/add-client";
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

  post: (body: ClientFormData) =>
    api.post<ClientResponse>("/client", body).then((r) => r.data), // ← FIXED

  delete: (id: string) =>
    api.delete<{ status: "success" }>(`/clients/${id}`).then((r) => r.data),
};
