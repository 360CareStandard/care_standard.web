// src/api/clients.ts
import { api } from "@/lib/axios";
import { CareSetupForm } from "@/pages/app/clients/schemas/care-setup";
import {
  ClientCarePlanResponse,
  ClientClientCarePlan,
} from "@/types/client/care-plan";
import type { UpdateClientBody } from "@/types/client/client";

export const ClientCarePlanApi = {
  get: (id: string) =>
    api.get<ClientCarePlanResponse>(`/client/${id}/care-plan`).then((r) => {
      const payload = r?.data?.data;
      if (!payload) return undefined;
      // server returns `contact` in your response body (not contacts)
      if (payload.clientCarePlan)
        return payload.clientCarePlan as ClientClientCarePlan;
      // fallback if server returns `contacts` array for some reason
    }),

  update: (id: string, body: UpdateClientBody) =>
    api
      .patch<{ status: "success" }>(`/client/${id}/care-plan/`, body)
      .then((r) => r.data),

  post: (id: string, body: CareSetupForm) =>
    api
      .post<{ status: "success" }>(`/client/${id}/care-plan`, body)
      .then((r) => r.data), // ← FIXED
};
