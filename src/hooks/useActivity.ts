// src/hooks/useActivity.ts

import {
    keepPreviousData,
    useQuery,
} from "@tanstack/react-query";

import { qk } from "@/lib/queryKeys";
import { ActivityApi } from "@/api/activity";

import type {
    AlertListParams,
    CareLogListParams,
    SystemActivityListParams,
} from "@/types/activity";

export function useActivityAlerts(params?: AlertListParams) {
    return useQuery({
        queryKey: qk.activityAlerts(params),

        queryFn: () => ActivityApi.alertList(params),

        placeholderData: keepPreviousData,

        staleTime: 60_000,

        retry: 2,
    });
}

export function useCareLogs(params?: CareLogListParams) {
    return useQuery({
        queryKey: qk.careLogs(params),

        queryFn: () => ActivityApi.careLogList(params),

        placeholderData: keepPreviousData,

        staleTime: 60_000,

        retry: 2,
    });
}

export function useSystemActivities(
    params?: SystemActivityListParams,
) {
    return useQuery({
        queryKey: qk.systemActivities(params),

        queryFn: () => ActivityApi.systemActivityList(params),

        placeholderData: keepPreviousData,

        staleTime: 60_000,

        retry: 2,
    });
}