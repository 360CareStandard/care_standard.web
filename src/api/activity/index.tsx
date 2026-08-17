// src/api/activity/index.ts

import { apiGet } from "@/utils/api-connect";

import type {
  AlertListParams,
  AlertListResponse,
  CareLogListParams,
  CareLogListResponse,
  SystemActivityListParams,
  SystemActivityListResponse,
} from "@/types/activity";

export const ActivityApi = {
  alertList: async (params?: AlertListParams) => {
    const safe = {
      priority: params?.priority,
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 20),
    };

    return apiGet<AlertListResponse>("/activity/alerts", safe).then(
      (r) => r.data,
    );
  },

  careLogList: async (params?: CareLogListParams) => {
    const safe = {
      status: params?.status,
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 20),
    };

    return apiGet<CareLogListResponse>("/activity/care-logs", safe).then(
      (r) => r.data,
    );
  },

  systemActivityList: async (params?: SystemActivityListParams) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 20),
    };

    return apiGet<SystemActivityListResponse>("/activity/system", safe).then(
      (r) => r.data,
    );
  },
};
