// src/schemas/assessment.ts
import { z } from "zod";

/**
 * Helper: treat empty-string as undefined
 */
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional()
);

// from the left menu + api example
export const ASSESSMENT_TYPES = [
  "personal-care",
  "daily-living",
  "mobility-falls",
  "nutrition-hydration",
  "mental-health",
  "social-engagement",
] as const;
export const AssessmentType = z.enum([
  "personal-care",
  "daily-living",
  "mobility-falls",
  "nutrition-hydration",
  "mental-health",
  "social-engagement",
]);
// export type AssessmentType = (typeof ASSESSMENT_TYPES)[number];

export const OUTCOME_STATUSES = [
  "not-started",
  "in-progress",
  "achieved",
] as const;
export type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

export const RISK_SEVERITIES = ["low", "medium", "high"] as const;
export type RiskSeverity = (typeof RISK_SEVERITIES)[number];

const assessmentTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: optionalString,
});

const assessmentRiskSchema = z.object({
  description: z.string().min(1, "Risk description is required"),
  mitigation: optionalString,
  severity: z.enum(RISK_SEVERITIES),
});

export const assessmentSchema = z.object({
  assessmentType: AssessmentType,

  needs: z.string().min(1, "Needs is required"),
  goal: z.string().min(1, "Goal is required"),
  expectedOutcomes: z
    .string()
    .min(1, "Expected outcomes is required")
    .describe("Text description of the expected outcomes"),

  outcomeStatus: z.enum(OUTCOME_STATUSES).default("not-started").optional(),

  reviewDueDate: optionalString, // yyyy-mm-dd from <input type="date" />

  responsiblePersonId: z.string().uuid().optional(),
  responsiblePersonName: optionalString,

  tasks: z.array(assessmentTaskSchema).optional().default([]),

  risks: z.array(assessmentRiskSchema).optional().default([]),

  tags: z.array(z.string()).optional().default([]),

  notesSummary: optionalString,

  metadata: z.record(z.string(), z.unknown()).optional().default({}),

  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export type AssessmentForm = z.infer<typeof assessmentSchema>;
export default assessmentSchema;
