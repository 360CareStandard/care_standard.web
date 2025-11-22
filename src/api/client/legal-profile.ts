// src/api/clients.ts
import { api } from "@/lib/axios";
import {
  ClientLegalProfile,
  ClientLegalProfileResponse,
} from "@/types/client/legal-profile";

export const ClientLegalProfileApi = {
  get: (id: string) =>
    api
      .get<ClientLegalProfileResponse>(`/client/${id}/legal-profile`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientLegalProfile)
          return payload.clientLegalProfile as ClientLegalProfile;
        // fallback if server returns `contacts` array for some reason
      }),

  update: (id: string, formData: FormData) =>
    api
      .patch<{ status: "success" }>(`/client/${id}/legal-profile`, formData)
      .then((r) => r.data),

  post: (id: string, formData: FormData) =>
    api
      .post<{ status: "success" }>(`/client/${id}/legal-profile`, formData)
      .then((r) => r.data), // ← FIXED
};
