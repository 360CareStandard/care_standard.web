// schemas/care-setup-full.ts
import { z } from "zod";

/**
 * Helper: accept numeric strings or numbers, produce number
 */
// const NumberLike = z.union([z.string(), z.number()]).transform((val) => {
//   if (typeof val === "number") return val;
//   const parsed = Number(val);
//   return Number.isFinite(parsed) ? parsed : undefined;
// });
export const SkillEnum = z.enum([
  "Medication",
  "Dementia Care",
  "PEG Feeding",
  "Catheter Care",
  "Moving & Handling",
]);

export const LanguageEnum = z.enum(["No requirement", "English", "Spanish"]);
/**
 * Status: API shows "active" etc. (lowercase) — make tolerant of case by normalizing.
 */
export const StatusEnum = z.enum(["active", "paused", "ended"]);
export const VisitPresetEnum = z.enum(["AM", "PM", "Evening", "Custom"]);
export const CheckInMethodEnum = z.enum(["gps", "nfc", "qr code"]);

/**
 * Visit duration preset allowed values in API: "30", "15" etc.
 * Accepts either string or number but stores string form.
 */
export const VisitDurationEnum = z.enum(["15", "30", "45", "60"]);

/**
 * Time-of-day must be "HH:mm:ss" for API. We validate simple pattern here.
 */
const TimeHHMMSS = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, "Time must be HH:mm:ss");

/**
 * Escalation contact: allow empty string -> undefined, or a uuid
 */
// const EmptyOrUuid = z
//   .string()
//   .optional()
//   .or(z.literal(""))
//   .transform((v) => (v && v.trim() !== "" ? v : undefined))
//   .pipe(z.string().uuid().optional());

/**
 * Language list — API accepts array of strings
 */
// const LanguageString = z.string();

/**
 * Main full schema mapping to the API payload
 */
export const CareSetupApiSchema = z.object({
  // top-level meta
  // agencyId: z.string().uuid(),
  packageId: z.string().trim().min(1, "Please select a package"),

  // service package block
  // .refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s),
  // startDate: z.string().refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s), {
  //   message: "startDate must be is required",
  // }),
  startDate: z.string().trim().min(1, "Please enter a date"),
  status: StatusEnum,
  visitDurationPreset: VisitDurationEnum.optional(),
  authorisedHoursPerWeek: z
    .union([z.number(), z.nan()])
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),

  // Booleans
  doubleUpVisitRequired: z.boolean().default(false).optional(),
  overnightCareRequired: z.boolean().default(false).optional(),

  // overnight specifics (only required if overnightCareRequired true)
  overnightCareType: z.enum(["sleep-in", "waking-night"]).optional(), // API example used "sleep-in"
  overnightCareStartTime: TimeHHMMSS.optional(),
  overnightCareEndTime: TimeHHMMSS.optional(),
  // Scheduling / preferences
  visitPeriodPreset: z.string().optional(), // can be "Custom" or others
  continuityPriority: z.boolean().default(false),
  preferredCarers: z.array(z.string()).default([]),
  avoidedCarers: z.array(z.string()).default([]),
  requiredSkills: z.array(z.string()).default([]),
  // languageRequirements: z.array(LanguageString).default([]),
  languageRequirements: z
    .array(z.union([LanguageEnum, z.string().min(1)]))
    .default([]),
  // Funding
  fundingSource: z.string().optional(),
  funder: z.string().optional(),
  authorizationNumber: z.string().optional(),
  budgetCap: z
    .union([z.number(), z.nan()])
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),
  // Safety / checkin
  checkInMethod: z
    .string()
    .transform((s) => (typeof s === "string" ? s.toLowerCase() : s))
    .refine(
      (s) => ["gps", "nfc", "qr code", "qr-code", "qr_code"].includes(s) || !s,
      {
        message: "Invalid check in method",
      },
    )
    .optional(),
  lateVisitAlertThreshold: z
    .union([z.number(), z.nan()])
    .transform((v) => (Number.isNaN(v) ? null : v))
    .nullable()
    .optional(),
  escalationContactId: z.string().uuid().optional(), // name matches API field in example: null
  loneWorkerAlertEnabled: z.boolean().default(false),
});
// export type CareSetupForm = z.infer<typeof CareSetupApiSchema>;
export type CareSetupForm = z.input<typeof CareSetupApiSchema>;
