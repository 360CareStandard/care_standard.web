import { z } from "zod";

export const StaffDocumentSchema = z
  .object({
    // documentFile: z.any().optional(),
    documentFile: z.instanceof(File).optional(),

    documentType: z.string().min(1, "Document type is required"),
    documentUrl: z.string().url().optional(),
    expired: z.boolean(),
    expiryDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        "Invalid expiry date",
      ),
    reason: z.string().max(1000, "Reason is too long").optional(),
  })
  .superRefine((data, ctx) => {
    /* -----------------------------
       1️⃣ Document file requirement
    ------------------------------*/

    if (!data.documentFile && !data.documentUrl) {
      ctx.addIssue({
        path: ["documentFile"],
        message: "Document file is required",
        code: z.ZodIssueCode.custom,
      });
    }

    /* -----------------------------
       2️⃣ Expiry conditional logic
    ------------------------------*/

    if (data.expired && !data.expiryDate) {
      ctx.addIssue({
        path: ["expiryDate"],
        message: "Expiry date is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type StaffDocumentForm = z.infer<typeof StaffDocumentSchema>;
