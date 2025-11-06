// src/hooks/useClients.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { ClientsApi } from "@/api/client/profile";
import { ClientFormData } from "@/pages/app/clients/schemas/add-client";

export function useClients(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.clients(params),
    queryFn: () => ClientsApi.list(params),
    select: (res) => res,
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

    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}
