// src/hooks/useStaffKill.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffDocumentApi } from "@/api/staff/document";

export function useStaffDocument(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffDocument(staffId) : ["staff-document"],
    queryFn: () => StaffDocumentApi.list(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateStaffDocument(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Accept a FormData
    mutationFn: (formData: FormData) => {
      if (!staffId) throw new Error("staffId is required to create document");
      return StaffDocumentApi.post(staffId, formData);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.staffDocument(staffId) });
    },
  });
}
export function useUpdateStaffDocument(staffId: string, editingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!editingId)
        throw new Error("documentId is required to update staff document");
      return StaffDocumentApi.update(editingId, formData);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.staffDocument(staffId) });
    },
  });
}

export function useDeleteStaffDocument(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) => {
      if (!staffId) throw new Error("staffId is required to delete a document");
      return StaffDocumentApi.delete(documentId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.staffDocument(staffId) });
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
    },
  });
}
