import z from "zod"
const existingDocumentSchema = z.object({
    id: z.string(),
    url: z.string().url(),
    filename: z.string(),
    size: z.number(),
    type: z.string(),
});



export const agencyLogoSchema = z.object({
    logo: z.file().optional(),
});
export const agencyDocumentSchema = z.object({
    documents: z
        .array(z.instanceof(File))
        .min(1, "Select at least one document"),

    existingDocuments: z.array(existingDocumentSchema).optional(),
});


export type AgencyLogoFormData = z.infer<typeof agencyLogoSchema>;
export type AgencyDocumentFormData = z.infer<typeof agencyDocumentSchema>;