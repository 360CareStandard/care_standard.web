import z from "zod";

export const carePackageSchema = z.object({
    agencyId: z.string().uuid("Please enter a valid agency ID"),

    name: z
        .string()
        .min(1, "Please enter a name for the care package"),

    description: z
        .string()
        .trim()
        .min(10, "Please enter a description of at least 10 characters"),

    rate: z.string().min(1, "Rate is required"),

    amount: z.preprocess(
        (val) =>
            typeof val === "number" && Number.isNaN(val) ? undefined : val,
        z
            .number({
                error: "Amount must be a number",
            })
            .positive("Amount must be greater than 0"),
    ),
});

export type CarePackageFormInput = z.input<typeof carePackageSchema>;
export type CarePackageFormData = z.output<typeof carePackageSchema>;