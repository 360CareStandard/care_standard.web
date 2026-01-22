import { z } from "zod";

export const EmploymentSchema = z
  .object({
    startDate: z.string().min(1, "Start date is required"),
    employmentType: z.string().min(1, "Employment type is required"),
    status: z.string().min(1, "Status is required"),

    weeklyContractedHours: z
      .number()
      .min(0, "Weekly contracted hours must be a positive number")
      .optional(),

    reason: z.string().max(1000, "Reason is too long").optional(),

    terminationDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        "Invalid termination date",
      ),
  })
  .superRefine((data, ctx) => {
    // 🔒 Conditional validation
    if (data.status === "terminated") {
      if (!data.terminationDate) {
        ctx.addIssue({
          path: ["terminationDate"],
          message: "Termination date is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export type EmploymentForm = z.infer<typeof EmploymentSchema>;
