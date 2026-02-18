// src/schemas/medical.ts
import { z } from "zod";

/**
 * Helper: treat empty-string as undefined (useful for date inputs)
 */
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional()
);

export const diagnosedConditionSchema = z.object({
  name: z.string().min(1),
  diagnosisDate: optionalString, // 'YYYY-MM-DD' expected
  notes: optionalString,
});

export const allergySchema = z.object({
  type: z.string().min(1), // e.g. "Food" | "Drug" | "Environmental"
  allergen: z.string().min(1),
  severity: z.enum(["Mild", "Moderate", "Severe"]),
  notes: optionalString,
});

export const medicalFormSchema = z.object({
  diagnosedConditions: z.array(diagnosedConditionSchema).optional().default([]),
  clinicalNotes: optionalString,
  knownAllergies: z.array(allergySchema).optional().default([]),
  overallRiskLevel: z
    .enum(["low", "medium", "high"])
    .optional()
    .default("medium"),
  riskCategories: z.array(z.string()).optional().default([]),
  riskResponsiblePerson: optionalString,
  mitigationStrategies: optionalString,
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  status: z
    .enum(["active", "inactive", "archived"])
    .optional()
    .default("active"),
});

// src/schemas/medical.ts (end)
export type MedicalForm = z.infer<typeof medicalFormSchema>;
export default medicalFormSchema;
