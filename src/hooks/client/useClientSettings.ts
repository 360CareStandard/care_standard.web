import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientSettingsApi } from "@/api/client/settings";
import { ClientSettingsForm } from "@/pages/app/clients/schemas/settings";

export function useClientSettings(
    clientId: string,
) {
    return useQuery({
        // unique key for a single contact
        queryKey: qk.clientSettings(clientId),
        queryFn: () => ClientSettingsApi.get(clientId),
        enabled: Boolean(clientId),
    });
}
export function useCreateClientSettings(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: ClientSettingsForm) => {
            if (!clientId)
                throw new Error("clientId is required to submit settings");
            // adapt ClientSettingsApi function name to your implementation
            return ClientSettingsApi.post(clientId, body);
        },
        onSuccess: () => {
            // optionally update client query detail cache if needed
            return qc.invalidateQueries({
                queryKey: qk.clientSettings(clientId),
            });
        },
    });
}

export function useUpdateClientSettings(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ body }: { body: ClientSettingsForm }) => {
            if (!clientId) throw new Error("clientId is required");
            return ClientSettingsApi.update(clientId, body);
        },
        onSuccess: () => {
            // ✅ invalidate the SAME query used by useVisitSchedule
            qc.invalidateQueries({
                queryKey: qk.clientSettings(clientId),
            });
            return qc.invalidateQueries({
                queryKey: qk.clientSettings(clientId),
            });
        },
    });
}


