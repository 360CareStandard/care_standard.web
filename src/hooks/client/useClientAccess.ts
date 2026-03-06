import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientAccessSettingsApi } from "@/api/client/access";
import { AccessSettingsForm } from "@/pages/app/clients/schemas/access-settings";

export function useClientAccessSettings(
    clientId: string,
) {
    return useQuery({
        // unique key for a single contact
        queryKey: qk.clientAccess(clientId),
        queryFn: () => ClientAccessSettingsApi.get(clientId),
        enabled: Boolean(clientId),
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
                queryKey: qk.clientAccess(clientId),
            });
        },
    });
}

export function useUpdateClientAccessSettings(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ body }: { body: AccessSettingsForm }) => {
            if (!clientId) throw new Error("clientId is required");
            return ClientAccessSettingsApi.update(clientId, body);
        },
        onSuccess: () => {
            // ✅ invalidate the SAME query used by useVisitSchedule
            qc.invalidateQueries({
                queryKey: qk.clientAccess(clientId),
            });
            return qc.invalidateQueries({
                queryKey: qk.clientAccess(clientId),
            });
        },
    });
}


