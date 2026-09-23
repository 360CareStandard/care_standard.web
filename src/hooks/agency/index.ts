import {
    keepPreviousData,
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { AgencyApi } from "@/api/agency";
import { qk } from "@/lib/queryKeys";
import { CreateAgencyFormData } from "@/pages/schemas/add-agency";

// --------------------------------------------------
// List agencies
// --------------------------------------------------

export function useAgenciesList(params?: {
    q?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: qk.agencyList(params),

        queryFn: () => AgencyApi.list(params),

        staleTime: 60_000,

        placeholderData: keepPreviousData,
    });
}

// --------------------------------------------------
// Infinite agencies
// --------------------------------------------------

export function useAgencyScroll(params?: {
    q?: string;
    limit?: number;
}) {
    return useInfiniteQuery({
        queryKey: qk.agencyInfinite(params),

        initialPageParam: 1,

        queryFn: ({ pageParam }) =>
            AgencyApi.list({
                q: params?.q,
                limit: params?.limit ?? 10,
                page: pageParam,
            }),

        getNextPageParam: (lastPage) => {
            const currentPage = Number(lastPage.currentPage);
            const totalPages = Number(lastPage.totalPages);

            return currentPage < totalPages
                ? currentPage + 1
                : undefined;
        },

        staleTime: 60_000,
    });
}

// --------------------------------------------------
// Get single agency
// --------------------------------------------------

export function useAgency(
    agencyId?: string,
    enabled = true,
) {
    return useQuery({
        queryKey: qk.agencyDetail(agencyId!),

        queryFn: () => AgencyApi.get(agencyId!),

        enabled: Boolean(agencyId) && enabled,

        staleTime: 60_000,
    });
}

// --------------------------------------------------
// Create agency
// --------------------------------------------------

export function useCreateAgency() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: CreateAgencyFormData) =>
            AgencyApi.post(body),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["agency"] });
        },
    });
}

// --------------------------------------------------
// Update agency
// --------------------------------------------------


export function useUpdateAgency(agencyId: string) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({
            agencyId,
            body,
        }: {
            agencyId: string;
            body: CreateAgencyFormData;
        }) => AgencyApi.update(agencyId, body),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["agency"] });
            qc.invalidateQueries({ queryKey: qk.agencyDetail(agencyId) });
        },
    });
}

// --------------------------------------------------
// Suspend agency
// --------------------------------------------------

export function useSuspendAgency() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (agencyId: string) =>
            AgencyApi.suspend(agencyId),

        onSuccess: (_, agencyId) => {
            qc.invalidateQueries({ queryKey: ["agency"] });
            qc.invalidateQueries({ queryKey: qk.agencyDetail(agencyId) });
        },
    });
}

// --------------------------------------------------
// Activate agency
// --------------------------------------------------

export function useActivateAgency() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (agencyId: string) =>
            AgencyApi.activate(agencyId),

        onSuccess: (_, agencyId) => {
            qc.invalidateQueries({ queryKey: ["agency"] });
            qc.invalidateQueries({ queryKey: qk.agencyDetail(agencyId) });
        },
    });
}

// --------------------------------------------------
// Delete agency
// --------------------------------------------------

export function useDeleteAgency() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (agencyId: string) =>
            AgencyApi.remove(agencyId),

        onSuccess: (_, agencyId) => {
            qc.invalidateQueries({ queryKey: ["agency"] });
            qc.invalidateQueries({ queryKey: qk.agencyDetail(agencyId) });
        },
    });
}