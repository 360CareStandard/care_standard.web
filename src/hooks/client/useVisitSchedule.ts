import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { VisitScheduleApi } from "@/api/client/visit-schedule";
import { VisitScheduleForm } from "@/pages/app/clients/schemas/visit-schedule";

export function useVisitScheduleList(clientId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: clientId
      ? qk.clientVisitSchedules(clientId)
      : ["staff-availability"],
    queryFn: () => VisitScheduleApi.list(clientId),
    enabled: Boolean(clientId && enabled),
    // staleTime: 60_000,
  });
}

export function useSingleVisitSchedule(
  clientId: string,
  scheduleId: string,
  enabled = false,
) {
  return useQuery({
    // unique key for a single contact
    queryKey:
      clientId && scheduleId
        ? qk.clientVisitSchedule(clientId, scheduleId)
        : ["client-visit-schedule-temp", scheduleId],
    queryFn: () => VisitScheduleApi.get(clientId, scheduleId),
    enabled: Boolean(clientId && scheduleId && enabled),
  });
}
export function useCreateVisitSchedule(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: VisitScheduleForm) => {
      if (!clientId)
        throw new Error("clientId is required to create a visit schedule");
      // adapt VisitScheduleApi function name to your implementation
      return VisitScheduleApi.post(clientId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      return qc.invalidateQueries({
        queryKey: qk.clientVisitSchedules(clientId),
      });
    },
  });
}

export function useUpdateVisitSchedule(clientId: string, scheduleId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: VisitScheduleForm }) => {
      if (!scheduleId) throw new Error("scheduleId is required");
      return VisitScheduleApi.update(clientId, scheduleId, body);
    },
    onSuccess: () => {
      // ✅ invalidate the SAME query used by useVisitSchedule
      qc.invalidateQueries({
        queryKey: qk.clientVisitSchedule(clientId, scheduleId),
      });
      return qc.invalidateQueries({
        queryKey: qk.clientVisitSchedules(clientId),
      });
    },
  });
}

export function useDeleteVisitSchedule(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (scheduleId: string) => {
      if (!clientId)
        throw new Error("clientId is required to delete a schedule");
      return VisitScheduleApi.delete(clientId, scheduleId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.clientVisitSchedules(clientId) });
    },
  });
}
