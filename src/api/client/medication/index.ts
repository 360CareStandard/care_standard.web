// src/api/clients.ts
import { api } from "@/lib/axios";
import { MedicationForm } from "@/pages/app/clients/schemas/medication";
import {
  Medication,
  MedicationResponse,
  MedicationsResponse,
} from "@/types/client/medication";

export const MedicationApi = {
  list: async (
    id: string,
    params?: { status?: string; page?: number; limit?: number }
  ) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      status: params?.status ?? undefined,
    };
    return api
      .get<MedicationsResponse>(`/medication/${id}`, { params: safe })
      .then((r) => r.data.data);
  },

  // src/api/clients.ts (or src/api/client/contact.ts)
  get: (id: string) =>
    api.get<MedicationResponse>(`/medication/${id}`).then((r) => {
      const payload = r?.data.data;
      if (!payload) return undefined;
      // server returns `contact` in your response body (not contacts)
      if (payload.medications) return payload.medications as Medication;
      return payload.medications as Medication;
    }),
  update: (id: string, medicationId: string, body: MedicationForm) =>
    api
      .patch<Medication>(`/medication/${id}/${medicationId}`, body)
      .then((r) => r.data),
  stop: (
    id: string,
    medicationId: string,
    body: { stopReason: string; status?: "stopped" }
  ) =>
    api
      .patch<Medication>(`/medication/${id}/${medicationId}/stop`, body)
      .then((r) => r.data),
  resolve: (id: string, medicationId: string) =>
    api
      .patch<Medication>(`/medication/${id}/${medicationId}/resolve`, {
        status: "active",
      })
      .then((r) => r.data),

  post: (id: string, body: MedicationForm) =>
    api.post<Medication>(`/medication/${id}`, body).then((r) => r.data), // ← FIXED

  delete: (id: string, medicationId: string) =>
    api
      .delete<{ status: "success" }>(`/medication/${id}/${medicationId}`)
      .then((r) => r.data),
};
