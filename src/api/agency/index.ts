
import { apiGet, apiPost, apiPatch, apiDelete } from "@/utils/api-connect";
import { AgenciesNewResponse, AgenciesNewSingleResponse } from "@/types/agency";
import { CreateAgencyFormData } from "@/pages/schemas/add-agency";

export const AgencyApi = {
    list: async (params?: { q?: string; page?: number; limit?: number }) => {
        const safe = {
            page: Number(params?.page ?? 1),
            limit: Number(params?.limit ?? 10),
            search: params?.q ?? undefined,
        };

        return apiGet<AgenciesNewResponse>("/admin/agencies", safe).then(
            (r) => r.data,
        );
    },

    post: (body: CreateAgencyFormData) =>
        apiPost<{ status: "success" }>(
            `/admin/agencies`,
            body,
        ),
    update: (agencyId: string, body: CreateAgencyFormData) =>
        apiPatch<{ status: "success" }>(
            `/admin/agencies/${agencyId}`,
            body,
        ),

    get: (agencyId: string) =>
        apiGet<AgenciesNewSingleResponse>(`/admin/agencies/${agencyId}`).then((r) => r.data),



    suspend: (agencyId: string) =>
        apiPatch<{ status: "success" }>(`/admin/agencies/${agencyId}/suspend`),

    activate: (agencyId: string) =>
        apiPatch<{ status: "success" }>(`/admin/agencies/${agencyId}/activate`),
    remove: (agencyId: string) =>
        apiDelete<{ status: "success" }>(`/admin/agencies/${agencyId}`),


};