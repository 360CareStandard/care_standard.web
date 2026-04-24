import { incidentTypeOptions, priorityOptions } from "@/types/safeguarding";
import z from "zod"



export const safeguardingSchema = z.object({
    clientId: z.string().uuid("Please enter a valid client ID"),
    reportedByStaffId: z.string().uuid("Please enter a valid staff ID"),
    incidentType: z.enum(
        incidentTypeOptions.map((o) => o.value) as [string, ...string[]]
    ),
    priority: z.enum(
        priorityOptions.map((o) => o.value) as [string, ...string[]]
    ),
    incidentDateTime: z.string().min(1, "Please enter the date and time of the incident"),
    location: z.string().trim().min(1, "Please enter a location"),
    description: z.string().trim().min(10, "Please enter a description of at least 10 characters"),
    evidence: z.any().optional(),
});



export type SafeguardingFormData = z.infer<typeof safeguardingSchema>;
