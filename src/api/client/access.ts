

// src/api/.ts

import { AccessSettingsForm } from "@/pages/app/clients/schemas/access-settings";
import { apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const ClientAccessSettingsApi = {

    get: (clientId: string) =>
        apiGet<any>(
            `/client/invite-family/${clientId}`,
        ).then((r) => r.data.clientSettings),

    update: (clientId: string, body: AccessSettingsForm) =>
        apiPatch<{ status: "success" }>(
            `/client/invite-family/${clientId}`,
            body,
        ),

    post: (id: string, body: AccessSettingsForm) =>
        apiPost<{ status: "success" }>(
            `/client/invite-family/${id}`,
            body,
        ),


};
