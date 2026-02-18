// src/hooks/useClientLegalProfile.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientLegalProfileApi } from "@/api/client/legal-profile";

export function useClientLegalProfile(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId ? qk.clientLegal(clientId) : ["client-legal"],
    queryFn: () => ClientLegalProfileApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateClientLegalProfile(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Accept a FormData
    mutationFn: (formData: FormData) => {
      if (!clientId)
        throw new Error("clientId is required to create legal profile");
      return ClientLegalProfileApi.post(clientId, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientLegal(clientId) });
    },
  });
}
export function useUpdateClientLegalProfile(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!clientId)
        throw new Error("clientId is required to update legal profile");
      return ClientLegalProfileApi.update(clientId, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientLegal(clientId) });
    },
  });
}
