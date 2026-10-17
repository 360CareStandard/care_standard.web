// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import type { AddContactForm } from "@/pages/app/clients/schemas/contact";
import { ClientContactApi } from "@/api/client/contact";

export function useClientContacts(clientId: string) {
  return useQuery({
    queryKey: qk.clientContacts(clientId),
    queryFn: () => ClientContactApi.list(clientId),
    staleTime: 60_000,
    enabled: Boolean(clientId),
  });
}
export function useClientContact(
  clientId: string,
  contactId: string,
  enabled = false,
) {
  return useQuery({
    // unique key for a single contact
    queryKey:
      clientId && contactId
        ? qk.clientContact(clientId, contactId)
        : ["client-contact-temp", contactId],
    queryFn: () => ClientContactApi.get(clientId, contactId),
    enabled: Boolean(clientId && contactId && enabled),
  });
}

export function useClientContactInvitation(clientId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: { email: string }) => {
      if (!clientId) throw new Error("clientId is required to send invite");
      return ClientContactApi.sendInvitation(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientContacts(clientId) });
    },
  });
}
/**
 * Create contact
 * Expects ClientsApi.createContact(clientId, body) -> returns created contact
 */
export function useCreateClientContact(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AddContactForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a contact");
      // adapt ClientsApi function name to your implementation
      return ClientContactApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientContacts(clientId) });
    },
  });
}

/**
 * Update contact
 * Expects ClientsApi.updateContact(clientId, contactId, body) -> returns updated contact
 */
export function useUpdateClientContact(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      body,
    }: {
      contactId: string;
      body: AddContactForm;
    }) => {
      if (!clientId)
        throw new Error("clientId is required to update a contact");
      return ClientContactApi.update(clientId, contactId, body);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.clientContacts(clientId!) });
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}

/**
 * Delete contact
 * Expects ClientsApi.deleteContact(clientId, contactId)
 */
export function useDeleteClientContact(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => {
      if (!clientId)
        throw new Error("clientId is required to delete a contact");
      return ClientContactApi.delete(clientId, contactId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.clientContacts(clientId) });

      qc.invalidateQueries({ queryKey: qk.client(clientId) });
    },
  });
}
