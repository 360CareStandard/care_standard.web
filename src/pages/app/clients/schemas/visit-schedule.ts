import { z } from "zod";

const DayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);

export const VisitScheduleSchema = z
  .object({
    visitFrequency: z.enum(["daily", "weekly", "custom"]),
    daysOfWeek: z.array(DayEnum).optional(), // Only required for weekly frequency
    repeatEveryWeeks: z.number().int().min(1).optional(), // Only required for custom frequency
    visitStartTime: z.string().min(1, "Start time is required"),
    visitEndTime: z.string().min(1, "End time is required"),
    duration: z.number().int().min(1, "Duration must be at least 1 minute"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),
    noEndDate: z.boolean().default(false),
    carersNeeded: z.number().int().min(1, "At least 1 carer is needed"),
    preferredCarers: z.array(z.string()).default([]),
    requiredSkills: z.array(z.string()).default([]),
    activitiesRequired: z.array(z.string()).default([]),
    fundingSource: z.string().optional(),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    /* ----------------------------
       1️⃣ End date logic
    -----------------------------*/

    if (!data.noEndDate && !data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date is required unless no end date is selected",
        code: z.ZodIssueCode.custom,
      });
    }

    /* ----------------------------
       2️⃣ Day selection logic
    -----------------------------*/

    // if (
    //   (data.visitFrequency === "weekly" || data.visitFrequency === "custom") &&
    //   data.daysOfWeek.length === 0
    // ) {
    //   ctx.addIssue({
    //     path: ["daysOfWeek"],
    //     message: "Select at least one day",
    //     code: z.ZodIssueCode.custom,
    //   });
    // }

    /* ----------------------------
       3️⃣ Custom repeat logic
    -----------------------------*/

    if (data.visitFrequency === "custom" && !data.repeatEveryWeeks) {
      ctx.addIssue({
        path: ["repeatEveryWeeks"],
        message: "Repeat interval is required for custom frequency",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type VisitScheduleForm = z.infer<typeof VisitScheduleSchema>;
