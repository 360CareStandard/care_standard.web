import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientAccessSettingsApi } from "@/api/client/access";
import { AccessSettingsForm } from "@/pages/app/clients/schemas/access-settings";

export function useClientAccessSettings(
    clientId: string,
) {
    return useQuery({
        // unique key for a single contact
        queryKey: qk.clientFamilyAccessList(clientId),
        queryFn: () => ClientAccessSettingsApi.list(clientId),
        enabled: Boolean(clientId),
    });
}
export function useSingleClientAccess(
    clientId: string,
    accessId: string,
    enabled = false,
) {
    return useQuery({
        // unique key for a single contact
        queryKey:
            clientId && accessId
                ? qk.clientFamilyAccess(clientId, accessId)
                : ["client-access", accessId],
        queryFn: () => ClientAccessSettingsApi.get(clientId, accessId),
        enabled: Boolean(clientId && accessId && enabled),
    });
}
export function useCreateClientAccessSettings(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: AccessSettingsForm) => {
            if (!clientId)
                throw new Error("clientId is required to submit settings");
            // adapt ClientSettingsApi function name to your implementation
            return ClientAccessSettingsApi.post(clientId, body);
        },
        onSuccess: () => {
            // optionally update client query detail cache if needed
            return qc.invalidateQueries({
                queryKey: qk.clientFamilyAccessList(clientId),
            });
        },
    });
}

export function useUpdateClientAccessSettings(clientId: string, accessId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: AccessSettingsForm) => {
            if (!clientId) throw new Error("clientId is required");
            return ClientAccessSettingsApi.update(clientId, accessId, body);
        },
        onSuccess: () => {
            // ✅ invalidate the SAME query used by useVisitSchedule
            qc.invalidateQueries({
                queryKey: qk.clientFamilyAccess(clientId, accessId),
            });
            return qc.invalidateQueries({
                queryKey: qk.clientFamilyAccessList(clientId),
            });
        },
    });
}

export function useDeleteClientAccessSettings(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (accessId: string) => {
            if (!clientId)
                throw new Error("clientId is required to delete family access");
            return ClientAccessSettingsApi.delete(clientId, accessId);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.clientFamilyAccessList(clientId) });
        },
    });
}

