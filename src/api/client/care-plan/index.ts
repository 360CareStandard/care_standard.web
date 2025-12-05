// src/api/clients.ts
import { api } from "@/lib/axios";
import { AssessmentForm } from "@/pages/app/clients/schemas/care-assesment";
import {
  CarePlan,
  CarePlanResponse,
  CarePlansResponse,
} from "@/types/client/care-plan";

export const CarePlanApi = {
  list: async (
    id: string,
    params?: { q?: string; page?: number; limit?: number }
  ) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      q: params?.q ?? undefined,
    };
    return api
      .get<CarePlansResponse>(`/care-plan/${id}`, { params: safe })
      .then((r) => r.data.data.carePlans);
  },

  // src/api/clients.ts (or src/api/client/contact.ts)
  get: (id: string) =>
    api.get<CarePlanResponse>(`/care-plan/${id}`).then((r) => {
      const payload = r?.data.data;
      if (!payload) return undefined;
      // server returns `contact` in your response body (not contacts)
      if (payload.carePlans) return payload.carePlans as CarePlan;
      return payload.carePlans as CarePlan;
    }),
  update: (id: string, carePlanId: string, body: AssessmentForm) =>
    api
      .patch<CarePlan>(`/care-plan/${id}/${carePlanId}`, body)
      .then((r) => r.data),

  post: (id: string, body: AssessmentForm) =>
    api.post<CarePlan>(`/care-plan/${id}`, body).then((r) => r.data), // ← FIXED

  delete: (id: string, carePlanId: string) =>
    api
      .delete<{ status: "success" }>(`/care-plan/${id}/${carePlanId}`)
      .then((r) => r.data),
};
