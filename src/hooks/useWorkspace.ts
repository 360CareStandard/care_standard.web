import { AuthApi } from "@/api/auth";
import { qk } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useWorkspace() {
  return useQuery({
    queryKey: qk.workspace,
    queryFn: () => AuthApi.workspace(),
    select: (res) => res, // { data, meta }
    staleTime: 60_000,
  });
}
