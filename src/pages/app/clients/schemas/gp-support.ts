// src/schemas/gp-support.ts
import { z } from "zod";

export const gpDetailsSchema = z.object({
  gpName: z.string().min(1, "GP name is required").optional(),
  practiceName: z.string().optional(),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?[0-9 ()-]{7,20}$/.test(v), {
      message: "Invalid phone number",
    }),
  email: z.string().email().optional(),
  practiceAddress: z.string().optional(),
});

export const healthcareProfessionalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || /^\+?[0-9 ()-]{7,20}$/.test(v), {
      message: "Invalid phone number",
    }),
  email: z.string().email().optional(),
  organisation: z.string().optional(),
  notes: z.string().optional(),
});

export const gpSupportSchema = z.object({
  gpDetails: gpDetailsSchema.optional().default({}),
  otherHealthcareProfessionals: z
    .array(healthcareProfessionalSchema)
    .optional()
    .default([]),
  //   metadata: z.record(z.string(), z.unknown()).optional().default({}),
  //   status: z
  //     .enum(["active", "inactive", "archived"])
  //     .optional()
  //     .default("active"),
});

export type GpSupportForm = z.infer<typeof gpSupportSchema>;
export default gpSupportSchema;
