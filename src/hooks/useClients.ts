// src/hooks/useClients.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientsApi } from "@/api/client";
import { ClientFormData } from "@/pages/app/clients/schemas/add-client";

export function useClients(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.clients(params),
    queryFn: () => ClientsApi.list(params),
    select: (res) => res, // { data, meta }
    staleTime: 60_000,
  });
}

export function useCreateClient(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: ClientFormData) => ClientsApi.post(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.clients(params) });
    },
  });
}

export function useClient(id?: string, enabled = true) {
  return useQuery({
    queryKey: id ? qk.client(id) : ["client", "nil"],
    queryFn: () => ClientsApi.get(id!),
    select: (res) => res.data,
    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}

// nslookup events.naijacuisine.com.au

// Optional infinite version
// export function useClientsInfinite(params?: { q?: string; limit?: number }) {
//   return useInfiniteQuery({
//     queryKey: qk.clients({ ...params, infinite: true }),
//     queryFn: ({ pageParam = 1 }) => ClientsApi.list({ ...params, page: pageParam }),
//     getNextPageParam: (last, pages) => {
//       const loaded = pages.reduce((n, p) => n + p.data.length, 0)
//       return loaded < last.meta.total ? pages.length + 1 : undefined
//     },
//     select: (res) => ({
//       items: res.pages.flatMap(p => p.data),
//       total: res.pages[0]?.meta.total ?? 0,
//     }),
//   })
// }
