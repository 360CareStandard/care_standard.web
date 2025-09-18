// schemas/scheduling-preferences.ts
import { z } from "zod";

export const VisitPresetEnum = z.enum(["AM", "PM", "Evening", "Custom"]);

export const SkillEnum = z.enum([
  "Medication",
  "Dementia Care",
  "PEG Feeding",
  "Catheter Care",
  "Moving & Handling",
]);

export const LanguageEnum = z.enum(["No requirement", "English", "Spanish"]);

export const SchedulingPreferencesSchema = z.object({
  // multi-select checkboxes
  visitPresets: z.array(VisitPresetEnum).default([]),

  // switch
  continuityPriority: z.boolean().default(false),

  // simple string arrays (we’ll capture free text “chips” of names/emails for now)
  preferredCarers: z.array(z.string().min(1)).default([]),
  avoidCarers: z.array(z.string().min(1)).default([]),

  // multi-select checkboxes
  requiredSkills: z.array(SkillEnum).default([]),

  // select
  languageRequirement: LanguageEnum.default("No requirement"),
});

export type SchedulingPreferencesForm = z.input<
  typeof SchedulingPreferencesSchema
>;
