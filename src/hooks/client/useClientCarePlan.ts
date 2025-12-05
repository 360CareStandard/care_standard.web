// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientCarePlanApi } from "@/api/client/care-setup";
import { CareSetupForm } from "@/pages/app/clients/schemas/care-setup";

export function useClientCareSetup(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId ? qk.clientCare(clientId) : ["client-care"],
    queryFn: () => ClientCarePlanApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateClientCarePlan(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CareSetupForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a care-setup");
      // adapt ClientsApi function name to your implementation
      return ClientCarePlanApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientCare(clientId) });
    },
  });
}

export function useUpdateClientCarePlan(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: CareSetupForm }) => {
      if (!clientId)
        throw new Error("clientId is required to update care setup");
      return ClientCarePlanApi.update(clientId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return qc.invalidateQueries({ queryKey: qk.clientCare(clientId) });
    },
  });
}
