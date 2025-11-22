// src/api/clients.ts
import { api } from "@/lib/axios";
import { PreferencesForm } from "@/pages/app/clients/schemas/preferences";
import {
  ClientPreferences,
  ClientPreferencesResponse,
} from "@/types/client/preferences";

export const PreferencesApi = {
  get: (id: string) =>
    api
      .get<ClientPreferencesResponse>(`/client/${id}/preferences`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientPreferences)
          return payload.clientPreferences as ClientPreferences;
        // fallback if server returns `contacts` array for some reason
      }),

  update: (id: string, body: PreferencesForm) =>
    api
      .patch<{ status: "success" }>(`/client/${id}/preferences`, body)
      .then((r) => r.data),

  post: (id: string, body: PreferencesForm) =>
    api
      .post<{ status: "success" }>(`/client/${id}/preferences`, body)
      .then((r) => r.data), // ← FIXED
};
