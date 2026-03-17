

import { z } from "zod";



export const ClientExportSchema = z.object({
    format: z.string().trim().min(1, "Please select a status"),
    includeBasicProfile: z.boolean().default(false),
    includeVisitHistory: z.boolean().default(false),
    includeCarePlan: z.boolean().default(false),
    includeHealthAndMedications: z.boolean().default(false),
    includeNotesAndMedia: z.boolean().default(false),
    includeCareLog: z.boolean().default(false),

});

// Output matches what resolver returns
export type ClientExportForm = z.infer<typeof ClientExportSchema>;
