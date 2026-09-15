import z from "zod"



export const financeSchema = z.object({
    clientId: z.string().uuid("Select a client"),
    periodStart: z.string().min(1, "Required"),
    periodEnd: z.string().min(1, "Required"),

});


export type FinanceFormData = z.infer<typeof financeSchema>;


export const paymentFormSchema = z.object({
    paymentProof: z
        .custom<FileList>()
        .refine((files) => files?.length > 0, {
            message: "Upload Payment proof",
        })
        .transform((files) => files[0]),

    paymentMethod: z
        .string()
        .min(1, "Select a payment method"),

    datePaid: z
        .string()
        .min(1, "Payment date is required"),

    paymentReference: z
        .string()
        .optional(),

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

export type PaymentFormType = z.infer<typeof paymentFormSchema>;




export const invoicePreferencesSchema = z.object({
    defaultBillingCycle: z.string().min(1, "Select a billing cycle"),

    invoiceNumberFormat: z
        .string()
        .min(1, "Invoice number format is required")
        .max(50, "Invoice number format is too long"),

    defaultInvoiceNotes: z
        .string()
        .max(500, "Invoice notes cannot exceed 500 characters")
        .optional(),

    autoSendInvoices: z.boolean(),
});

export type InvoicePreferencesFormType = z.infer<
    typeof invoicePreferencesSchema
>;