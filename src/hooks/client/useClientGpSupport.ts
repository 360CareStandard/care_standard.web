// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { GpSupportApi } from "@/api/client/gp-support";
import { GpSupportForm } from "@/pages/app/clients/schemas/gp-support";

export function useClientGpSupport(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId ? qk.clientGpSupport(clientId) : ["client-gp-support"],
    queryFn: () => GpSupportApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateGpSupport(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: GpSupportForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a GP support");
      // adapt ClientsApi function name to your implementation
      return GpSupportApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientGpSupport(clientId) });
    },
  });
}

export function useUpdateGpSupport(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: GpSupportForm }) => {
      if (!clientId)
        throw new Error("clientId is required to update  GP support");
      return GpSupportApi.update(clientId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return qc.invalidateQueries({ queryKey: qk.clientGpSupport(clientId) });
    },
  });
}
