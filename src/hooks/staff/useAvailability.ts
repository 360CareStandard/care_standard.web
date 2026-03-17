import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffAvailabilityForm } from "@/pages/app/staff/schemas/availability";
import { StaffBookAbsenceForm } from "@/pages/app/staff/schemas/book-absence";
import { StaffAvailabilityApi } from "@/api/staff/availability";

export function useStaffAvailability(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffAvailability(staffId) : ["staff-availability"],
    queryFn: () => StaffAvailabilityApi.list(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}
export function useStaffAbsence(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffAbsence(staffId) : ["staff-availability"],
    queryFn: () => StaffAvailabilityApi.getAbsence(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}


export function useCreateStaffAvailability(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: StaffAvailabilityForm) => {
      if (!staffId)
        throw new Error("staffId is required to create a staff availability");
      // adapt StaffWorkApi function name to your implementation
      return StaffAvailabilityApi.post(staffId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      return qc.invalidateQueries({ queryKey: qk.staffAvailability(staffId) });
    },
  });
}

export function useUpdateStaffAvailability(
  staffId: string,
  availabilityId: string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: StaffAvailabilityForm }) => {
      if (!availabilityId) throw new Error("availabilityId is required");
      return StaffAvailabilityApi.update(availabilityId, body);
    },
    onSuccess: () => {
      // ✅ invalidate the SAME query used by useStaffEmployment
      return qc.invalidateQueries({ queryKey: qk.staffAvailability(staffId) });
    },
  });

}
export function useDeleteStaffAvailability(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (availabilityId: string) => {
      if (!staffId) throw new Error("AvailabilityId is required to delete an availability");
      return StaffAvailabilityApi.delete(availabilityId);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.staffAvailability(staffId) });
    },
  });
}

export function useCreateStaffBookAbsence(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: StaffBookAbsenceForm) => {
      if (!staffId)
        throw new Error("staffId is required to book a staff absence");
      // adapt StaffWorkApi function name to your implementation
      return StaffAvailabilityApi.bookAbsence(staffId, body);
    },
    onSuccess: () => {
      // optionally update client query detail cache if needed
      return qc.invalidateQueries({ queryKey: qk.staffAvailability(staffId) });
    },
  });
}
