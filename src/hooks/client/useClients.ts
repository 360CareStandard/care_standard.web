// src/hooks/useClients.ts
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientsApi } from "@/api/client/profile";
import { ClientFormData } from "@/pages/app/clients/schemas/add-client";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api-error";

export function useClientScroll(params?: { q?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: qk.clientInfinite(params),
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      ClientsApi.list({
        q: params?.q,
        limit: params?.limit ?? 10,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      const pagination = lastPage;

      const page = Number(pagination?.currentPage ?? 1);
      const totalPages = Number(pagination?.totalPages);

      return page < totalPages ? page + 1 : undefined;
    },

    staleTime: 60_000,
  });
}


export function useClients(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.clientList(params),
    queryFn: () => ClientsApi.list(params),
    select: (res) => res,
    staleTime: 60_000,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();

  return useMutation<
    { status: "success" },
    AxiosError<ApiError<ClientFormData>>,
    FormData
  >({
    mutationFn: ClientsApi.post,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client"] });
    },
  });
}
export function useUpdateClient(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => ClientsApi.update(id, formData),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client"] });
      qc.invalidateQueries({ queryKey: qk.client(id) });
    },
  });
}

export function useClient(id?: string, enabled = true) {
  return useQuery({
    queryKey: id ? qk.client(id) : ["client", "nil"],
    queryFn: () => ClientsApi.get(id!),

    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}
