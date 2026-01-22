import { z } from "zod";

export const AddStaffSkillSchema = z
  .object({
    skillName: z.string().min(1, "Skill name is required"),

    skillType: z.string().min(1, "Skill type is required"),

    note: z.string().max(1000, "Note is too long").optional(),

    hasCertificate: z.boolean(),

    expiredAt: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        "Invalid expiry date",
      ),
    certificateDocumentUrl: z.string().optional(),

    certificateDocument: z.any().optional(), // File validation handled below
  })
  .superRefine((data, ctx) => {
    // 🔒 Conditional validation
    if (data.hasCertificate) {
      if (!data.certificateDocument) {
        ctx.addIssue({
          path: ["certificateDocument"],
          message: "Certificate document is required",
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.expiredAt) {
        ctx.addIssue({
          path: ["expiredAt"],
          message: "Expiry date is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });
export type AddStaffSkillForm = z.infer<typeof AddStaffSkillSchema>;
