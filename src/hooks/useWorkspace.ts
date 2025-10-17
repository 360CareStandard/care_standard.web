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
    onSuccess: (res) => {
      const token = res.data?.token;
      if (token) setToken(token); // some backends issue a new token scoped to the agency
      if (res.data?.agency) setWorkspace(res.data.agency);
      qc.invalidateQueries(); // bust anything agency-scoped
    },
  });
}
