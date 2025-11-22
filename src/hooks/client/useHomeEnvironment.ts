// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { HomeEnvironmentApi } from "@/api/client/home-environment";
import { HomeEnvironmentForm } from "@/pages/app/clients/schemas/home-environment";

export function useHomeEnvironment(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId
      ? qk.clientHomeEnvironment(clientId)
      : ["client-home-environment"],
    queryFn: () => HomeEnvironmentApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateHomeEnvironment(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: HomeEnvironmentForm) => {
      if (!clientId)
        throw new Error("clientId is required to create home environment");
      // adapt ClientsApi function name to your implementation
      return HomeEnvironmentApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({
        queryKey: qk.clientHomeEnvironment(clientId),
      });
    },
  });
}

export function useUpdateHomeEnvironment(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: HomeEnvironmentForm }) => {
      if (!clientId)
        throw new Error("clientId is required to update home environment");
      return HomeEnvironmentApi.update(clientId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return qc.invalidateQueries({
        queryKey: qk.clientHomeEnvironment(clientId),
      });
    },
  });
}
