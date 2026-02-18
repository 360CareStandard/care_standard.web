import { CarePackageApi } from "@/api/package";
import { qk } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useCarePackage() {
  return useQuery({
    queryKey: qk.carePackage(),
    queryFn: () => CarePackageApi.list(),
    staleTime: 60_000,
  });
}
