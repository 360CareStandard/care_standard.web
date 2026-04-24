import { SafeguardingListResponse } from "@/types/safeguarding";
import { apiGet, apiPatch, apiPost } from "@/utils/api-connect";

export const SafeguardingApi = {
  list: async (params?: {
    status?: string;
    priority?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const safe = {
      page: Number(params?.page ?? 1),
      limit: Number(params?.limit ?? 10),
      status: params?.status ?? undefined,
      priority: params?.priority ?? undefined,
      dateFrom: params?.dateFrom ?? undefined,
      dateTo: params?.dateTo ?? undefined,
    };
    return apiGet<SafeguardingListResponse>("/safeguarding", safe).then(
      (r) => r.data,
    );
  },

  get: (id: string) =>
    apiGet<SafeguardingListResponse>(`/safeguarding/${id}`).then((r) => r.data),
  action: (
    id: string,
    payload: {
      status: string; // open, close
      actionTaken: string;
    },
  ) =>
    apiPatch<{ status: "success" }>(`/safeguarding/${id}/take-action`, payload),

  post: (formData: FormData) =>
    apiPost<{ status: "success" }>("/safeguarding", formData),
};
