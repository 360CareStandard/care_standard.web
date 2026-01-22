import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffWorkApi } from "@/api/staff/work";
import { StaffWorkForm } from "@/pages/app/staff/schemas/work";

export function useStaffWork(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffWork(staffId) : ["staff-work"],
    queryFn: () => StaffWorkApi.get(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateStaffWork(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: StaffWorkForm) => {
      if (!staffId)
        throw new Error("staffId is required to create a staff work detail");
      // adapt StaffWorkApi function name to your implementation
      return StaffWorkApi.post(staffId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      return qc.invalidateQueries({ queryKey: qk.staffWork(staffId) });
    },
  });
}

export function useUpdateStaffWork(staffId: string, workId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: StaffWorkForm }) => {
      if (!workId) throw new Error("workId is required");
      return StaffWorkApi.update(workId, body);
    },
    onSuccess: () => {
      // ✅ invalidate the SAME query used by useStaffWork
      return qc.invalidateQueries({ queryKey: qk.staffWork(staffId) });
    },
  });
}
