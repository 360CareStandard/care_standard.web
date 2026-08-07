import { z } from "zod";

export const EmploymentSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    employmentType: z.string().min(1, "Employment type is required"),
    status: z.string().min(1, "Status is required"),

    weeklyContractedHours: z.preprocess(
      (val) => (typeof val === "number" && Number.isNaN(val) ? undefined : val),
      z
        .number({
          error: "Weekly contracted hours must be a number",
        })
        .positive("Weekly contracted hours must be greater than 0"),
    ),

    reason: z.string().max(1000, "Reason is too long").optional(),

    terminatedDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        "Invalid termination date",
      ),
  })
  .superRefine((data, ctx) => {
    if (data.status === "terminated") {
      if (!data.terminatedDate) {
        ctx.addIssue({
          path: ["terminatedDate"],
          message: "Termination date is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export type EmploymentForm = z.infer<typeof EmploymentSchema>;
