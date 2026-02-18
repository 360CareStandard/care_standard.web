// src/hooks/useStaffKill.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffSkillApi } from "@/api/staff/skill";

export function useStaffSkill(staffId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: staffId ? qk.staffSkill(staffId) : ["staff-skill"],
    queryFn: () => StaffSkillApi.list(staffId),
    enabled: Boolean(staffId && enabled),
    // staleTime: 60_000,
  });
}

export function useCreateStaffSkill(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    // Accept a FormData
    mutationFn: (formData: FormData) => {
      if (!staffId) throw new Error("staffId is required to create skill");
      return StaffSkillApi.post(staffId, formData);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.staffSkill(staffId) });
    },
  });
}
export function useUpdateStaffSkill(staffId: string, editingId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => {
      if (!editingId)
        throw new Error("skillId is required to update staff skill");
      return StaffSkillApi.update(editingId, formData);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.staffSkill(staffId) });
    },
  });
}

export function useDeleteStaffSkill(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (skillId: string) => {
      if (!staffId) throw new Error("staffId is required to delete a skill");
      return StaffSkillApi.delete(skillId);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.staffSkill(staffId) });
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
    },
  });
}
