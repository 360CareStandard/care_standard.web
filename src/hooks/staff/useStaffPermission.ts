import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffPermissionApi } from "@/api/staff/permission";
import { StaffPermissionForm } from "@/pages/app/staff/schemas/permissions";

export function useStaffPermission(
    staffId: string,
) {
    return useQuery({
        // unique key for a single contact
        queryKey: qk.StaffPermission(staffId),
        queryFn: () => StaffPermissionApi.get(staffId),
        enabled: Boolean(staffId),
    });
}
export function useCreateStaffPermission(staffId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: StaffPermissionForm) => {
            if (!staffId)
                throw new Error("staffId is required to submit settings");
            // adapt StaffPermissionApi function name to your implementation
            return StaffPermissionApi.post(staffId, body);
        },
        onSuccess: () => {
            // optionally update client query detail cache if needed
            return qc.invalidateQueries({
                queryKey: qk.StaffPermission(staffId),
            });
        },
    });
}

export function useUpdateStaffPermission(staffId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: StaffPermissionForm) => {
            if (!staffId) throw new Error("staffId is required");
            return StaffPermissionApi.update(staffId, body);
        },
        onSuccess: () => {
            // ✅ invalidate the SAME query used by useVisitSchedule
            qc.invalidateQueries({
                queryKey: qk.StaffPermission(staffId),
            });
            return qc.invalidateQueries({
                queryKey: qk.StaffPermission(staffId),
            });
        },
    });
}


