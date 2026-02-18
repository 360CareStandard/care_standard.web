import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffEmploymentApi } from "@/api/staff/employment";
import { EmploymentForm } from "@/pages/app/staff/schemas/employment";

export function useStaffEmployment(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffEmployment(staffId) : ["staff-employment"],
    queryFn: () => StaffEmploymentApi.get(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateStaffEmployment(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: EmploymentForm) => {
      if (!staffId)
        throw new Error("staffId is required to create a staff work detail");
      // adapt StaffWorkApi function name to your implementation
      return StaffEmploymentApi.post(staffId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      return qc.invalidateQueries({ queryKey: qk.staffEmployment(staffId) });
    },
  });
}

export function useUpdateStaffEmployment(
  staffId: string,
  employmentId: string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: EmploymentForm }) => {
      if (!employmentId) throw new Error("employmentId is required");
      return StaffEmploymentApi.update(employmentId, body);
    },
    onSuccess: () => {
      // ✅ invalidate the SAME query used by useStaffEmployment
      return qc.invalidateQueries({ queryKey: qk.staffEmployment(staffId) });
    },
  });
}
