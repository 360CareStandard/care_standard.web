import { z } from "zod";

const DayEnum = z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);

export const StaffAvailabilitySchema = z
  .object({
    frequency: z.enum(["daily", "weekly", "custom"]),

    selectedDays: z.array(DayEnum).default([]),

    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional(),

    noEndDate: z.boolean().default(false),

    isActive: z.boolean().optional(),

    repeatUnit: z.string().optional(),
    repeatEvery: z
      .number()
      .int()
      .min(1, "Repeat interval must be at least 1")
      .optional(),
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

    if (
      (data.frequency === "weekly" || data.frequency === "custom") &&
      data.selectedDays.length === 0
    ) {
      ctx.addIssue({
        path: ["selectedDays"],
        message: "Select at least one day",
        code: z.ZodIssueCode.custom,
      });
    }

    /* ----------------------------
       3️⃣ Custom repeat logic
    -----------------------------*/

    if (data.frequency === "custom" && !data.repeatEvery) {
      ctx.addIssue({
        path: ["repeatInterval"],
        message: "Repeat interval is required for custom frequency",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type StaffAvailabilityForm = z.infer<typeof StaffAvailabilitySchema>;
