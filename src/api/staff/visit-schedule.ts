// src/api/.ts

import { StaffVisitSchedulesResponse } from "@/types/staff/visit";
import { apiGet } from "@/utils/api-connect";

export const StaffVisitScheduleApi = {
    list: async (id: string) => {
        return apiGet<StaffVisitSchedulesResponse>(
            `/visit-schedule/staff/${id}/visits`,
        ).then((r) => r?.data);
    },

};
