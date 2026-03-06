
import { z } from "zod";



export const ClientSettingsSchema = z.object({

    enableFamilyAccess: z.boolean().default(false),
    missedVisitAlerts: z.boolean().default(false),
    criticalMedicationAlerts: z.boolean().default(false),
    geoLocationClockIn: z.boolean().default(false),
    shareCarePlanWithFamily: z.boolean().default(false),
    shareNotesWithFamily: z.boolean().default(false),
    shareHealthInfoWithFamily: z.boolean().default(false),

});

// Output matches what resolver returns
export type ClientSettingsForm = z.infer<typeof ClientSettingsSchema>;
