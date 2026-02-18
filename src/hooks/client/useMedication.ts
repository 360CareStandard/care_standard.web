// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { MedicationApi } from "@/api/client/medication";
import { MedicationForm } from "@/pages/app/clients/schemas/medication";

export function useMedications(
  clientId: string,
  params?: {
    status: string;
    page?: number;
    limit?: number;
  }
) {
  return useQuery({
    queryKey: qk.medication(clientId, undefined, params?.status),
    queryFn: () => MedicationApi.list(clientId, params),
    staleTime: 60_000,
    enabled: Boolean(clientId),
  });
}
export function useMedication(
  clientId: string,
  medicationId: string,
  enabled = false
) {
  return useQuery({
    // unique key for a single
    queryKey:
      clientId && medicationId
        ? qk.medication(clientId, medicationId)
        : ["medication", medicationId],
    queryFn: () => MedicationApi.get(clientId),
    enabled: Boolean(clientId && medicationId && enabled),
  });
}

export function useCreateMedication(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: MedicationForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a medication");
      return MedicationApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: ["medication"] });
    },
  });
}

export function useUpdateMedication(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationId,
      body,
    }: {
      medicationId: string;
      body: MedicationForm;
    }) => {
      if (!clientId)
        throw new Error("clientId is required to update a medication");
      return MedicationApi.update(clientId, medicationId, body);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["medication"] });
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}
export function useStopMedication(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      medicationId,
      body,
    }: {
      medicationId: string;
      body: { stopReason: string; status?: "stopped" };
    }) => {
      if (!clientId)
        throw new Error("clientId is required to stop a medication");
      return MedicationApi.stop(clientId, medicationId, body);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["medication"] });
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}
export function useResolveMedication(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ medicationId }: { medicationId: string }) => {
      if (!clientId)
        throw new Error("clientId is required to resolve a medication");
      return MedicationApi.resolve(clientId, medicationId);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["medication"] });
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}

export function useDeleteMedication(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (medicationId: string) => {
      if (!clientId)
        throw new Error("clientId is required to delete a medication");
      return MedicationApi.delete(clientId, medicationId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["medication"] });

      qc.invalidateQueries({ queryKey: qk.client(clientId) });
    },
  });
}
