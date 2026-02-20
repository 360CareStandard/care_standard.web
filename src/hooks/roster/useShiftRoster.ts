import { ShiftRosterApi } from "@/api/roster";
import { qk } from "@/lib/queryKeys";
import {  useQuery } from "@tanstack/react-query";
import { keepPreviousData } from "@tanstack/react-query";


export function useShiftRosterList(params?: {
  view?: string;
  date?: string;
  endDate?: string;
}) {
  return useQuery({
    queryKey: qk.shiftRosterList(params),
    queryFn: () => ShiftRosterApi.list(params),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}


export function useShiftDetails(shiftId?: string | null, enabled?: boolean) {
  return useQuery({
    queryKey: qk.shiftRoster(shiftId ?? ""),
    queryFn: () => ShiftRosterApi.get(shiftId as string),
    enabled: Boolean(enabled && shiftId),
    staleTime: 60_000,
  });
}