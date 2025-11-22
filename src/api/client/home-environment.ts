// src/api/clients.ts
import { api } from "@/lib/axios";
import { HomeEnvironmentForm } from "@/pages/app/clients/schemas/home-environment";
import {
  ClientGPAndSupport,
  ClientGPAndSupportResponse,
} from "@/types/client/gp-support";

export const HomeEnvironmentApi = {
  get: (id: string) =>
    api
      .get<ClientGPAndSupportResponse>(`/client/${id}/home-environment`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientGPAndSupport)
          return payload.clientGPAndSupport as ClientGPAndSupport;
        // fallback if server returns `contacts` array for some reason
      }),

  update: (id: string, body: HomeEnvironmentForm) =>
    api
      .patch<{ status: "success" }>(`/client/${id}/home-environment`, body)
      .then((r) => r.data),

  post: (id: string, body: HomeEnvironmentForm) =>
    api
      .post<{ status: "success" }>(`/client/${id}/home-environment`, body)
      .then((r) => r.data), // ← FIXED
};
