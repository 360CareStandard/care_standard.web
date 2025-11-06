import { CarePlanApi } from "@/api/package";
import { qk } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useCarePlan() {
  return useQuery({
    queryKey: qk.carePlan(),
    queryFn: () => CarePlanApi.list(),
    staleTime: 60_000,
  });
}
