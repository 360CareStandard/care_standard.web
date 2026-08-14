// src/api/clients.ts
import { api } from "@/lib/axios";
import { GpSupportForm } from "@/pages/app/clients/schemas/gp-support";
import {
  ClientGPAndSupport,
  ClientGPAndSupportResponse,
} from "@/types/client/gp-support";
import { apiPatch, apiPost } from "@/utils/api-connect";

export const GpSupportApi = {
  get: (id: string) =>
    api
      .get<ClientGPAndSupportResponse>(`/client/${id}/gp-and-support`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientGPAndSupport)
          return payload.clientGPAndSupport as ClientGPAndSupport;
        // fallback if server returns `contacts` array for some reason
      }),

  update: (id: string, body: GpSupportForm) =>
    apiPatch<{ status: "success" }>(`/client/${id}/gp-and-support`, body)
  ,
  post: (id: string, body: GpSupportForm) =>
    apiPost<{ status: "success" }>(`/client/${id}/gp-and-support`, body)

};
