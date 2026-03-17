

// src/api/.ts

import { AccessSettingsForm } from "@/pages/app/clients/schemas/access-settings";
import { FamilyAccessListResponse, FamilyAccessSingleResponse } from "@/types/client/family-access";
import { apiDelete, apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const ClientAccessSettingsApi = {

    list: (clientId: string) =>
        apiGet<FamilyAccessListResponse>(
            `/client/invite-family/${clientId}`,
        ).then((r) => r.data?.familyAccess),
    get: (clientId: string, accessId: string) =>
        apiGet<FamilyAccessSingleResponse>(
            `/client/family-access/${clientId}/${accessId}`,
        ).then((r) => r.data),
    update: (clientId: string, accessId: string, body: AccessSettingsForm) =>
        apiPatch<{ status: "success" }>(
            `/client/family-access/${clientId}/${accessId}`,
            body,
        ),
    delete: (clientId: string, accessId: string) =>
        apiDelete(`client/family-access/${clientId}/${accessId}`),

    post: (id: string, body: AccessSettingsForm) =>
        apiPost<{ status: "success" }>(
            `/client/invite-family/${id}`,
            body,
        ),


};
