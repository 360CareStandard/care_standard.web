import { z } from "zod";
import { SchedulingPreferencesSchema } from "./scheduling-preferences";
import { FundingSchema } from "./funding-source";
import { SafetySchema } from "./safety-checkin";

export const PackageTypeEnum = z.enum([
  "Domiciliary",
  "Live-in",
  "Night",
  "Complex",
]);

export const StatusEnum = z.enum(["Active", "Paused", "Ended"]);

// 1) This is the section we're building now
export const ServicePackageSchema = z.object({
  packageType: PackageTypeEnum,
  startDate: z.string().min(1, "Start date is required"),
  status: StatusEnum,
  authorisedHours: z.number("Enter hours per week").min(0),
  visitDuration: z.enum(["15", "30", "45", "60"]).optional(),
  doubleUpRequired: z.boolean().default(false),
  overnightCare: z.boolean().default(false),
  overnightStart: z.string().optional(),
  overnightEnd: z.string().optional(),
  overnightStartPeriod: z.enum(["AM", "PM"]).optional(),
  overnightEndPeriod: z.enum(["AM", "PM"]).optional(),
});

// 2) For now, use this as the page-level schema.
//    Later we can .merge() other sections into a full CareSetupSchema.
// export const CareSetupSchema = ServicePackageSchema;
export const CareSetupSchema = ServicePackageSchema.merge(
  SchedulingPreferencesSchema
)
  .merge(FundingSchema)
  .merge(SafetySchema);

// 3) Export the type used by RHF
// export type CareSetupForm = z.infer<typeof CareSetupSchema>;
export type CareSetupForm = z.input<typeof CareSetupSchema>;
export type CareSetupValues = z.infer<typeof CareSetupSchema>;
