// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { PreferencesApi } from "@/api/client/preferences";
import { PreferencesForm } from "@/pages/app/clients/schemas/preferences";

export function usePreferences(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId
      ? qk.clientPreferences(clientId)
      : ["client-home-environment"],
    queryFn: () => PreferencesApi.get(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreatePreferences(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: PreferencesForm) => {
      if (!clientId)
        throw new Error("clientId is required to create client preferences");
      // adapt ClientsApi function name to your implementation
      return PreferencesApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({
        queryKey: qk.clientPreferences(clientId),
      });
    },
  });
}

export function useUpdatePreferences(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: PreferencesForm }) => {
      if (!clientId)
        throw new Error("clientId is required to update client preferences");
      return PreferencesApi.update(clientId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return qc.invalidateQueries({
        queryKey: qk.clientPreferences(clientId),
      });
    },
  });
}
