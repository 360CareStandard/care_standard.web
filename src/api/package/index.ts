// src/api/clients.ts
import { api } from "@/lib/axios";
import { CarePackageFormData } from "@/pages/schemas/care-package";
import { CarePackageResponse, CarePackageSingleResponse } from "@/types/care-package";
import { apiDelete, apiPatch, apiPost } from "@/utils/api-connect";

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
  get: (id: string) =>
    api
      .get<CarePackageSingleResponse>(`/care-package/${id}`)
      .then((r) => {
        const details = r.data.data;

        return details ? details : null;
      }),
  update: (packageId: string, body: CarePackageFormData) =>
    apiPatch<{ status: "success" }>(
      `/care-package/${packageId}`,
      body,
    ),

  post: (body: CarePackageFormData) =>
    apiPost<{ status: "success" }>(
      `/care-package`,
      body,
    ),
  delete: (id: string) =>
    apiDelete<{ status: "success" }>(`/care-package/${id}`)

};
