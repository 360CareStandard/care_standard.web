

import { z } from "zod";


export const StaffBookAbsenceSchema = z
    .object({
        absenceType: z.string().min(1, "Absence type is required"),
        startDate: z.string().min(1, "Start date is required"),
        startTime: z.string().min(1, "Start time is required"),
        endTime: z.string().min(1, "End time is required"),
        endDate: z.string().min(1, "End date is required"),
        reason: z.string().min(1, "Reason is required")
    });

export type StaffBookAbsenceForm = z.infer<typeof StaffBookAbsenceSchema>;
