import z from "zod"



export const financeSchema = z.object({
    clientId: z.string().uuid("Select a client"),
    periodStart: z.string().min(1, "Required"),
    periodEnd: z.string().min(1, "Required"),

});


export type FinanceFormData = z.infer<typeof financeSchema>;
