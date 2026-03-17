import { StaffVisitScheduleApi } from "@/api/staff/visit-schedule";
import { qk } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useStaffVisitScheduleList(staffId?: string) {
    return useQuery({
        queryKey: qk.staffVisitSchedules(staffId),
        queryFn: () => StaffVisitScheduleApi.list(staffId as string),
        enabled: !!staffId,
    });
}