// src/hooks/useClients.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api-error";
import { SafeguardingApi } from "@/api/safeguarding";
import { SafeguardingFormData } from "@/pages/schemas/safeguarding";

export function useSafeguardingInfinite(params?: {
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
    limit?: number;
}) {
    return useInfiniteQuery({
        queryKey: qk.safeguardingList(params),
        initialPageParam: 1,

        queryFn: ({ pageParam }) =>
            SafeguardingApi.list({
                ...params,
                page: pageParam,
                limit: params?.limit ?? 10,
            }),

        getNextPageParam: (lastPage) => {
            const current = lastPage.currentPage;
            const total = lastPage.totalPages;

            return current < total ? current + 1 : undefined;
        },

        staleTime: 60_000,
    });
}
export function useSafeguardingList(params?: {
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: qk.safeguardingList(params),
        queryFn: () => SafeguardingApi.list(params),
        select: (res) => res,
        staleTime: 60_000,
    });
}

export function useCreateSafeguardingReport() {
    const qc = useQueryClient();

    return useMutation<
        { status: "success" },
        AxiosError<ApiError<SafeguardingFormData>>,
        FormData
    >({
        mutationFn: SafeguardingApi.post,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["safeguarding"] });
        },
    });
}
export function useSafeguardingAction() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            status,
            actionTaken,
        }: {
            id: string;
            status: string;
            actionTaken: string;
        }) => SafeguardingApi.action(id, { status, actionTaken }),

        onSuccess: () => {
            qc.invalidateQueries({
                queryKey: ["safeguarding"],
                exact: false, // ✅ VERY IMPORTANT
            });
        },
    });
}

export function useSafeguarding(id?: string, enabled = true) {
    return useQuery({
        queryKey: id ? qk.safeguarding(id) : ["safeguarding", "nil"],
        queryFn: () => SafeguardingApi.get(id!),

        enabled: Boolean(id) && enabled,
        staleTime: 60_000,
    });
}
