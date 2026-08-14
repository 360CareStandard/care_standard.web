

import z from "zod"





export const carePackageSchema = z.object({
    agencyId: z.string().uuid("Please enter a valid agency ID"),
    name: z.string().min(1, "Please enter a name for the care package"),
    description: z
        .string()
        .trim()
        .min(10, "Please enter a description of at least 10 characters"),
});

export type CarePackageFormData = z.infer<typeof carePackageSchema>;
