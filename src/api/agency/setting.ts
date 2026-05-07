
import { AgencyDocumentResponse, AgencyLogoResponse } from "@/types/agency/setting";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const AgencySettingApi = {

    getLogo: () =>
        apiGet<AgencyLogoResponse>(`/agency/settings/logo`).then(
            (r) => r.data,
        ),

    updateLogo: (formData: FormData) =>
        apiPatch<{ status: "success" }>(`/agency/settings/logo`, formData)
    ,
    postLogo: (formData: FormData) =>
        apiPost<{ status: "success" }>("/agency/settings/logo", formData),

    postDocument: (formData: FormData) =>
        apiPost<{ status: "success" }>("/agency/settings/documents", formData),
    getDocuments: () =>
        apiGet<AgencyDocumentResponse>(`/agency/settings/documents`).then(
            (r) => r.data,
        ),
    deleteDocument: (id: string) =>
        apiDelete<{ status: "success" }>(`/agency/settings/documents/${id}`)


};
