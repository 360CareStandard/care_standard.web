// src/api/clients.ts
import { api } from "@/lib/axios";
import { AddContactForm } from "@/pages/app/clients/schemas/contact";
import type { UpdateClientBody } from "@/types/client/client";
import {
  ClientContact,
  ClientContactResponse,
  ClientContactsResponse,
} from "@/types/client/contact";

export const ClientContactApi = {
  list: async (id: string) => {
    return api
      .get<ClientContactsResponse>(`/client/${id}/contacts`)
      .then((r) => r?.data.data?.contacts);
  },

  // src/api/clients.ts (or src/api/client/contact.ts)
  get: (id: string, contactId: string) =>
    api
      .get<ClientContactResponse>(`/client/${id}/contacts/${contactId}`)
      .then((r) => {
        const payload = r?.data?.data;
        if (!payload) return undefined;
        // server returns `contact` in your response body (not contacts)
        if (payload.contact) return payload.contact as ClientContact;
        return payload.contact as ClientContact;
      }),

  update: (id: string, contactId: string, body: UpdateClientBody) =>
    api
      .patch<ClientContact>(`/client/${id}/contacts/${contactId}`, body)
      .then((r) => r.data),

  post: (id: string, body: AddContactForm) =>
    api.post<ClientContact>(`/client/${id}/contacts`, body).then((r) => r.data), // ← FIXED

  delete: (id: string, contactId: string) =>
    api
      .delete<{ status: "success" }>(`/client/${id}/contacts/${contactId}`)
      .then((r) => r.data),
};
