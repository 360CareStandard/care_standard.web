import { z } from "zod";
export const medicationMetadataSchema = z
  .object({
    source: z.string().optional(),
    createdVia: z.string().optional(),
  })
  .optional();

export const FREQUENCY_DOSE_COUNT: Record<string, number> = {
  "Once daily": 1,
  "Twice daily": 2,
  "Three times daily": 3,
  "Four times daily": 4,
};

/** Who administers the medication */
export const administeredByEnum = z.enum(["carer", "self", "mixed", "family"]);

/** Common routes – backend can still accept string */
export const routeEnum = z.enum([
  "oral",
  "topical",
  "injection",
  "inhaled",
  "rectal",
]);

/** Medication lifecycle */
export const medicationStatusEnum = z.enum([
  "active",
  "paused",
  "completed",
  "discontinued",
]);

export const medicationSchema = z
  .object({
    // createdBy: z.string().min(1, "Created by is required"),

    medicationName: z.string().min(1, "Medication name is required"),
    dosage: z.string().min(1, "Dosage is required"),

    route: routeEnum,
    frequency: z.string().min(1, "Frequency is required"),
    doseInstruction: z.string().optional(),

    doseTimes: z.array(z.string()).min(1, "At least one dose time is required"),

    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().nullable(),
    noEndDate: z.boolean().default(false),

    prescriberName: z.string().min(1, "Prescriber name is required"),
    additionalInstructions: z.string().optional(),

    administeredBy: administeredByEnum,
    linkedCareDomain: z.string().optional(),

    metadata: medicationMetadataSchema,

    // status: medicationStatusEnum.default("active"),
  })
  .refine((data) => data.noEndDate === true || Boolean(data.endDate), {
    path: ["endDate"],
    message: "End date is required unless no end date is selected",
  })
  .refine(
    (data) =>
      data.frequency === "As required" ||
      data.doseTimes.length === FREQUENCY_DOSE_COUNT[data.frequency],
    {
      path: ["doseTimes"],
      message: "Dose times must match selected frequency",
    }
  )

  .superRefine((data, ctx) => {
    // Business rule: either endDate OR noEndDate must make sense
    if (!data.noEndDate && !data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date is required unless 'No end date' is selected",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.noEndDate && data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        message: "End date must be empty when 'No end date' is selected",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export type MedicationForm = z.infer<typeof medicationSchema>;
export default medicationSchema;
