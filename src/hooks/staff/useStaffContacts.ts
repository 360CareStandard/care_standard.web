// src/hooks//.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffContactApi } from "@/api/staff/contact";
import { AddStaffContactForm } from "@/pages/app/staff/schemas/contact";

export function useStaffContacts(staffId: string) {
  return useQuery({
    queryKey: qk.staffContacts(staffId),
    queryFn: () => StaffContactApi.list(staffId),
    staleTime: 60_000,
    enabled: Boolean(staffId),
  });
}
export function useStaffContact(
  staffId: string,
  contactId: string,
  enabled = false,
) {
  return useQuery({
    // unique key for a single contact
    queryKey:
      staffId && contactId
        ? qk.staffContact(staffId, contactId)
        : ["staff-contact-temp", contactId],
    queryFn: () => StaffContactApi.get(staffId, contactId),
    enabled: Boolean(staffId && contactId && enabled),
  });
}
/**
 * Create contact
 * Expects StaffContactApi.createContact(staffIdq, body) -> returns created contact
 */
export function useCreateStaffContact(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AddStaffContactForm) => {
      if (!staffId) throw new Error("staffId is required to create a contact");
      return StaffContactApi.post(staffId, body);
    },
    onSuccess: () => {
      // optionally update staff query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
      return qc.invalidateQueries({ queryKey: qk.staffContacts(staffId) });
    },
  });
}

/**
 * Update contact
 * Expects StaffContactApi.updateContact(staffId, contactId, body) -> returns updated contact
 */
export function useUpdateStaffContact(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      contactId,
      body,
    }: {
      contactId: string;
      body: AddStaffContactForm;
    }) => {
      if (!staffId) throw new Error("staffId is required to update a contact");
      return StaffContactApi.update(staffId, contactId, body);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.staffContacts(staffId!) });
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}

/**
 * Delete contact
 * Expects StaffContactApi.deleteContact(staffId, contactId)
 */
export function useDeleteStaffContact(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (contactId: string) => {
      if (!staffId) throw new Error("staffId is required to delete a contact");
      return StaffContactApi.delete(staffId, contactId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.staffContacts(staffId) });

      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
    },
  });
}
