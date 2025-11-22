import { z } from "zod";

const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional()
);

const VisitTimeEnum = z.enum(["Morning", "Afternoon", "Evening"]);

export const preferencesSchema = z.object({
  morningRoutine: optionalString.default(""),
  sleepingHabits: optionalString.default(""),
  dailyActivities: optionalString.default(""),
  preferredVisitTimes: z.array(VisitTimeEnum).default([]),
  religionOrFaith: optionalString.default(""),
  faithPractices: optionalString.default(""),
  culturalConsiderations: optionalString.default(""),
  dietaryRestrictions: z.array(z.string()).default([]),
  foodLikes: optionalString.default(""),
  foodDislikes: optionalString.default(""),
  favouriteMeals: optionalString.default(""),
  preferredLanguage: optionalString.default(""),
  interpreterNeeded: z.boolean().default(false),
  communicationAids: optionalString.default(""),
  interactionNotes: optionalString.default(""),

  metadata: z.record(z.string(), z.unknown()).default({}),
  status: z.enum(["active", "inactive", "archived"]).default("active"),
});

export type PreferencesForm = z.infer<typeof preferencesSchema>;
export default preferencesSchema;
