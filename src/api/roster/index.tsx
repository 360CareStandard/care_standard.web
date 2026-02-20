
import { VisitScheduleResponse } from "@/types/client/visit-schedule";
import { ShiftRosterResponse } from "@/types/roster";
import { apiGet } from "@/utils/api-connect";

export const ShiftRosterApi = {

    list: (params?: { view?: string; date?: string; endDate?: string }) => {
        const safe = {
            view: params?.view ?? undefined,
            date: params?.date ?? undefined,
            endDate: params?.endDate ?? undefined,
        };

        return apiGet<ShiftRosterResponse>("/shift-roster/roster", safe).then(
            (r) => r.data,
        );
    },
    get: (shiftId: string) =>
        apiGet<VisitScheduleResponse>(
            `/shift-roster/shifts/${shiftId}`,
        ).then((r) => r.data),


};
