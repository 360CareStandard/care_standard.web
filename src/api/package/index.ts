// src/api/clients.ts
import { api } from "@/lib/axios";
import { CarePackageResponse } from "@/types/care-package";

export const CarePackageApi = {
  list: async (params?: { q?: string; page?: number; limit?: number }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      q: params?.q ?? undefined,
    };
    return api
      .get<CarePackageResponse>(`/care-package`, { params: safe })
      .then((r) => r?.data.data?.carePackages);
  },
};
