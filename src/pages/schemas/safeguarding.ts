import { incidentTypeOptions, priorityOptions } from "@/types/safeguarding";
import z from "zod"



export const safeguardingSchema = z.object({
    clientId: z.string().uuid("Select a client"),
    reportedByStaffId: z.string().uuid("Select a carer"),
    incidentType: z.enum(
        incidentTypeOptions.map((o) => o.value) as [string, ...string[]]
    ),
    priority: z.enum(
        priorityOptions.map((o) => o.value) as [string, ...string[]]
    ),
    title: z.string().min(1, "Please enter a title for the incident"),
    incidentDateTime: z.string().min(1, "Please enter the date and time of the incident"),
    location: z.string().trim().min(1, "Please enter a location"),
    description: z.string().trim().min(10, "Please enter a description of at least 10 characters"),
    evidence: z.file().optional(),
});



export type SafeguardingFormData = z.infer<typeof safeguardingSchema>;
