// src/api/clients.ts
import { api } from "@/lib/axios";
import { AddStaffContactForm } from "@/pages/app/staff/schemas/contact";
import type { UpdateClientBody } from "@/types/client/client";

import {
  StaffContact,
  StaffContactResponse,
  StaffContactsResponse,
} from "@/types/staff/contact";

export const StaffContactApi = {
  list: async (id: string) => {
    return api
      .get<StaffContactsResponse>(`/staff/nextOfKins/${id}`)
      .then((r) => r?.data.data?.nextOfKins);
  },

  // src/api/clients.ts (or src/api/client/contact.ts)
  get: (contactId: string) =>
    api.get<StaffContactResponse>(`/staff/nextOfKin/${contactId}`).then((r) => {
      const payload = r?.data?.data;
      if (!payload) return undefined;
      // server returns `contact` in your response body (not contacts)
      if (payload) return payload as StaffContact;
      return payload as StaffContact;
    }),

  update: (contactId: string, body: UpdateClientBody) =>
    api
      .patch<StaffContact>(`/staff/nextOfKin/${contactId}`, body)
      .then((r) => r.data),

  post: (id: string, body: AddStaffContactForm) =>
    api.post<StaffContact>(`/staff/nextOfKin/${id}`, body).then((r) => r.data), // ← FIXED

  delete: (contactId: string) =>
    api
      .delete<{ status: "success" }>(`/staff/nextOfKin/${contactId}`)
      .then((r) => r.data),
};
