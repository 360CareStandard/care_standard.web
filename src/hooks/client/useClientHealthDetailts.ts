// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { HealthDetailsApi } from "@/api/client/health-details";
import { MedicalForm } from "@/pages/app/clients/schemas/health";

export function useClientHealthDetails(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId ? qk.clientHealth(clientId) : ["client-health"],
    queryFn: () => HealthDetailsApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateHealthDetails(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: MedicalForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a health details");
      // adapt ClientsApi function name to your implementation
      return HealthDetailsApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.clientHealth(clientId) });
    },
  });
}

export function useUpdateHealthDetails(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: MedicalForm }) => {
      if (!clientId)
        throw new Error("clientId is required to update health details");
      return HealthDetailsApi.update(clientId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return qc.invalidateQueries({ queryKey: qk.clientHealth(clientId) });
    },
  });
}
