// src/api/.ts
import { ClientSettingsForm } from "@/pages/app/clients/schemas/settings";
import { GetClientSettingsResponse } from "@/types/client/settings";

import { apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const ClientSettingsApi = {

    get: (clientId: string) =>
        apiGet<GetClientSettingsResponse>(
            `/client/settings/${clientId}`,
        ).then((r) => r.data.clientSettings),

    update: (clientId: string, body: ClientSettingsForm) =>
        apiPatch<{ status: "success" }>(
            `/client/settings/${clientId}`,
            body,
        ),

    post: (id: string, body: ClientSettingsForm) =>
        apiPost<{ status: "success" }>(
            `/client/settings/${id}`,
            body,
        ),


};
