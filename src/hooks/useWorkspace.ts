import { AuthApi } from "@/api/auth";
import { qk } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useWorkspace() {
  return useQuery({
    queryKey: qk.workspace,
    queryFn: () => AuthApi.workspace(),
    select: (res) => res, // { data, meta }
    staleTime: 60_000,
  });
}

export function useSelectWorkspace() {
  const qc = useQueryClient();
  const setToken = useAuthStore((s) => s.setToken);
  const setWorkspace = useAuthStore((s) => s.setWorkspace);

  return useMutation({
    mutationFn: (body: { agencyId: string }) => AuthApi.selectAgency(body),
    onSuccess: async (res) => {
      // Clear agency-scoped data before changing the active credentials so
      // no cached records from the previous agency can render after the switch.
      // Keep only the user and workspace-list queries used by the current layout.
      qc.removeQueries({
        predicate: (query) =>
          query.queryKey[0] !== qk.me[0] &&
          query.queryKey[0] !== qk.workspace[0],
      });

      const token = res.data?.token;
      if (token) setToken(token);
      if (res.data?.agency) setWorkspace(res.data.agency);
    },
  });
}
