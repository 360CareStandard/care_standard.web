// src/schemas/home-environment.ts
import { z } from "zod";

/**
 * Helper: treat empty-string as undefined (useful for date/inputs)
 */
const optionalString = z.preprocess(
  (v) => (typeof v === "string" && v.trim() === "" ? undefined : v),
  z.string().optional()
);

const householdMemberSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
});

const livingSituationSchema = z.object({
  livesAlone: z.boolean().optional().default(false),
  householdMembers: z.array(householdMemberSchema).optional().default([]),
  propertyType: z
    .enum(["Flat", "House", "Supported Housing", "Residential Care"])
    .optional(),
  // <-- changed to API values
  supportType: z
    .enum(["Own House", "Council Housing", "Supported Living", "Other"])
    .optional(),
});

const accessAndSecuritySchema = z.object({
  accessMethod: z.string().optional(),
  keySafeCode: optionalString,
  buzzerCode: optionalString,
  specialAccessNotes: optionalString,
});

const environmentAndEquipmentSchema = z.object({
  equipmentPresent: z.array(z.string()).optional().default([]),
  pets: optionalString,
  knownHazards: z.array(z.string()).optional().default([]),
});

// Top-level schema with typed defaults to avoid the TS overload error
export const homeEnvironmentSchema = z.object({
  livingSituation: livingSituationSchema.optional().default({
    livesAlone: false,
    householdMembers: [],
    propertyType: "Flat",
    supportType: "Own House",
  } as z.infer<typeof livingSituationSchema>),

  accessAndSecurity: accessAndSecuritySchema.optional().default({
    accessMethod: "",
    keySafeCode: undefined,
    buzzerCode: undefined,
    specialAccessNotes: undefined,
  } as z.infer<typeof accessAndSecuritySchema>),

  environmentAndEquipment: environmentAndEquipmentSchema.optional().default({
    equipmentPresent: [],
    petsPresent: false,
    pets: undefined,
    knownHazards: [],
    // assistiveTechnology: [],
    // hazardNotes: undefined,
  } as z.infer<typeof environmentAndEquipmentSchema>),

  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  status: z
    .enum(["active", "inactive", "archived"])
    .optional()
    .default("active"),
});

export type HomeEnvironmentForm = z.infer<typeof homeEnvironmentSchema>;
export default homeEnvironmentSchema;
