// src/hooks/useClientContacts.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { CarePlanApi } from "@/api/client/care-plan";
import { AssessmentForm } from "@/pages/app/clients/schemas/care-assesment";

export function useCarePlans(clientId: string) {
  return useQuery({
    queryKey: qk.carePlan(clientId),
    queryFn: () => CarePlanApi.list(clientId),
    staleTime: 60_000,
    enabled: Boolean(clientId),
  });
}
export function useCarePlan(
  clientId: string,
  carePlanId: string,
  enabled = false
) {
  return useQuery({
    // unique key for a single contact
    queryKey:
      clientId && carePlanId
        ? qk.clientContact(clientId, carePlanId)
        : ["care-plan", carePlanId],
    queryFn: () => CarePlanApi.get(clientId),
    enabled: Boolean(clientId && carePlanId && enabled),
  });
}

export function useCreateCarePlan(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AssessmentForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a contact");
      // adapt ClientsApi function name to your implementation
      return CarePlanApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      return qc.invalidateQueries({ queryKey: qk.carePlan(clientId) });
    },
  });
}

export function useUpdateCarePlan(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      carePlanId,
      body,
    }: {
      carePlanId: string;
      body: AssessmentForm;
    }) => {
      if (!clientId)
        throw new Error("clientId is required to update a care plan");
      return CarePlanApi.update(clientId, carePlanId, body);
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.carePlan(clientId!) });
      qc.invalidateQueries({ queryKey: qk.client(clientId) });
      // also update specific contact query if you have one
      return data;
    },
  });
}

export function useDeleteCarePlan(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (carePlanId: string) => {
      if (!clientId)
        throw new Error("clientId is required to delete a care plan");
      return CarePlanApi.delete(clientId, carePlanId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.carePlan(clientId) });

      qc.invalidateQueries({ queryKey: qk.client(clientId) });
    },
  });
}
