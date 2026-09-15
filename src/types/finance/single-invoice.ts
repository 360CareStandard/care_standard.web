export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type InvoiceCurrency = "GBP" | "USD" | "EUR";

export interface InvoiceClient {
    id: string;
    firstname: string;
    lastname: string;
    addressLine1: string;
    addressLine2?: string | null;
}

export interface InvoiceVisitBreakdownRow {
    date: string;
    time: string;
    duration: string;
    rate: string;
    rateName: string;
    amount: string;
}

export interface InvoiceVisitBreakdown {
    rows: InvoiceVisitBreakdownRow[];
    totalHours: string;
    totalAmount: string;
}

export interface Invoice {
    id: string;
    clientId: string;
    invoiceNumber: string;

    status: InvoiceStatus;
    currency: InvoiceCurrency;

    totalHours: number;
    totalAmount: number;
    amountPaid: number;

    periodStart: string;
    periodEnd: string;
    issueDate: string;
    dueDate: string;

    billToName: string;
    billToAddress: string;
    notes: string;

    sentAt: string | null;
    paidAt: string | null;

    paymentMethod: string | null;
    paymentReference: string | null;
    paymentProof: string | null;
    paymentNotes: string | null;

    createdAt: string;
    updatedAt: string;

    client: InvoiceClient;

    visitBreakdown: InvoiceVisitBreakdown;
}

export interface InvoiceResponse {
    status: string;
    message: string;
    data: Invoice;
}