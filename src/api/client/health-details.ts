// src/api/clients.ts
import { api } from "@/lib/axios";
import { MedicalForm } from "@/pages/app/clients/schemas/health";

import type { UpdateClientBody } from "@/types/client/client";
import {
  ClientHealthDetails,
  ClientHealthDetailsResponse,
} from "@/types/client/health";

export const HealthDetailsApi = {
  get: (id: string) =>
    api
      .get<ClientHealthDetailsResponse>(`/client/${id}/health-details`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientHealthDetails)
          return payload.clientHealthDetails as ClientHealthDetails;
        // fallback if server returns `contacts` array for some reason
      }),

  update: (id: string, body: UpdateClientBody) =>
    api
      .patch<{ status: "success" }>(`/client/${id}/health-details`, body)
      .then((r) => r.data),

  post: (id: string, body: MedicalForm) =>
    api
      .post<{ status: "success" }>(`/client/${id}/health-details`, body)
      .then((r) => r.data), // ← FIXED
};
