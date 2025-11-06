// src/api/clients.ts
import { api } from "@/lib/axios";
import { CarePlanResponse } from "@/types/care-plan";

export const CarePlanApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      q: params?.q ?? undefined,
    };
    return api
      .get<CarePlanResponse>(`/care-plan`, { params: safe })
      .then((r) => r?.data.data?.carePlans);
  },
};
