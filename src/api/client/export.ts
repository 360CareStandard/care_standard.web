// src/api/.ts

import { ClientExportForm } from "@/pages/app/clients/schemas/export";
import { apiPost } from "@/utils/api-connect";

export const ClientExportApi = {
    post: (id: string, body: ClientExportForm) =>
        apiPost<{ status: "success" }>(
            `/client/export/${id}`,
            body,
        ),
};
