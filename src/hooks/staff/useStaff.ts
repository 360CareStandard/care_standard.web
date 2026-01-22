// src/hooks/useClients.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffProfileApi } from "@/api/staff/profile";

export function useStaff(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.staffs(params),
    queryFn: () => StaffProfileApi.list(params),
    select: (res) => res,
    staleTime: 60_000,
  });
}
export function useStaffDetails(id?: string, enabled = true) {
  return useQuery({
    queryKey: id ? qk.staff(id) : ["staff", "nil"],
    queryFn: () => StaffProfileApi.get(id!),

    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();

  return useMutation({
    // Accept a FormData
    mutationFn: (formData: FormData) => {
      return StaffProfileApi.post(formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.staffs() });
    },
  });
}

export function useUpdateStaff(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!staffId)
        throw new Error("staffId is required to update staff profile");
      return StaffProfileApi.update(staffId, formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
    },
  });
}
