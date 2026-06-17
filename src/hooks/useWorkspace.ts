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
      const token = res.data?.token;
      if (token) setToken(token);
      if (res.data?.agency) setWorkspace(res.data.agency);

      // Remove all cached agency-scoped data so the next page
      // fetches fresh data for the new workspace.
      // We use removeQueries (not invalidate) so nothing re-fetches
      // on the current page — only the next page the user lands on.
      qc.removeQueries({ queryKey: ["client"] });
      qc.removeQueries({ queryKey: ["staff"] });
      qc.removeQueries({ queryKey: ["care-plan"] });
      qc.removeQueries({ queryKey: ["medication"] });
      qc.removeQueries({ queryKey: ["shift-roster"] });
      qc.removeQueries({ queryKey: ["safeguarding"] });
      qc.removeQueries({ queryKey: ["agency-logo"] });
      qc.removeQueries({ queryKey: ["agency-document"] });
      qc.removeQueries({ queryKey: ["care-package"] });
      qc.removeQueries({ queryKey: ["menu"] });

      // DO NOT touch ["workspace"] or ["me"] —
      // those are needed for the current layout to stay stable
    },
  });
}