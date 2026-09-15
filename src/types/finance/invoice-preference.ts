export type BillingCycle =
    | "weekly"
    | "fortnightly"
    | "four-weekly"
    | "monthly";
export interface InvoicePreferencesResponse {
    status: string;
    message: string;
    data: InvoicePreferences;
}

export interface InvoicePreferences {
    id: string;
    defaultBillingCycle: BillingCycle;
    autoSendInvoices: boolean;
    invoiceNumberFormat: string;
    agencyId: string;
    updatedAt: string;
    createdAt: string;
    defaultInvoiceNotes: string | null;
    updatedBy: string | null;
}