// src/api/clients.ts
import { api } from "@/lib/axios";
import { HomeEnvironmentForm } from "@/pages/app/clients/schemas/home-environment";
import {
  ClientHomeEnvironment,
  ClientHomeEnvironmentResponse,
} from "@/types/client/home-environment";

export const HomeEnvironmentApi = {
  get: (id: string) =>
    api
      .get<ClientHomeEnvironmentResponse>(`/client/${id}/home-environment`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.clientHomeEnvironment)
          return payload.clientHomeEnvironment as ClientHomeEnvironment;
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
