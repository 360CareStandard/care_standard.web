import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientExportForm } from "@/pages/app/clients/schemas/export";
import { ClientExportApi } from "@/api/client/export";


export function useCreateClientExport(clientId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: ClientExportForm) => {
            if (!clientId)
                throw new Error("clientId is required to submit form");
            return ClientExportApi.post(clientId, body);
        },
        onSuccess: () => {
            // optionally update client query detail cache if needed
            return qc.invalidateQueries({
                queryKey: qk.clientExport(clientId),
            });
        },
    });
}

