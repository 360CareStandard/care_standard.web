import { z } from "zod";

const DayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);
const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24hr HH:mm

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export const VisitScheduleSchema = z
  .object({
    visitFrequency: z.enum(["daily", "weekly", "custom"]),
    daysOfWeek: z.array(DayEnum).optional(),
    repeatEveryWeeks: z.number().int().min(1).optional(),

    visitStartTime: z
      .string()
      .min(1, "Start time is required")
      .regex(hhmm, "Use HH:mm (24-hour format)"),

    visitEndTime: z
      .string()
      .min(1, "End time is required")
      .regex(hhmm, "Use HH:mm (24-hour format)"),

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
    // 1) End date logic
    if (!data.noEndDate && !data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date is required unless no end date is selected",
        code: z.ZodIssueCode.custom,
      });
    }

    // 2) Custom repeat logic
    if (data.visitFrequency === "custom" && !data.repeatEveryWeeks) {
      ctx.addIssue({
        path: ["repeatEveryWeeks"],
        message: "Repeat interval is required for custom frequency",
        code: z.ZodIssueCode.custom,
      });
    }

    // 3) Time order logic (end must be after start)
    if (hhmm.test(data.visitStartTime) && hhmm.test(data.visitEndTime)) {
      const start = toMinutes(data.visitStartTime);
      const end = toMinutes(data.visitEndTime);

      if (end <= start) {
        ctx.addIssue({
          path: ["visitEndTime"],
          message: "End time must be after start time",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type VisitScheduleForm = z.infer<typeof VisitScheduleSchema>;
