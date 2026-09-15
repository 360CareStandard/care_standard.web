export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceMetadata {
    backfilled: boolean;
    billingCycle: string;
}

export interface InvoiceClient {
    id: string;
    firstname: string;
    lastname: string;
    addressLine1: string;
    city: string;
    zip: string;
}

export interface Invoice {
    totalHours: number;
    totalAmount: number;
    amountPaid: number;
    id: string;
    agencyId: string;
    clientId: string;
    invoiceNumber: string;
    status: InvoiceStatus;
    periodStart: string;
    periodEnd: string;
    issueDate: string;
    dueDate: string;
    currency: string;
    billToName: string;
    billToAddress: string;
    notes: string;
    sentAt: string | null;
    paidAt: string | null;
    paymentMethod: string | null;
    paymentReference: string | null;
    paymentProof: string | null;
    paymentNotes: string | null;
    paymentRecordedBy: string | null;
    createdBy: string | null;
    updatedBy: string | null;
    metadata: InvoiceMetadata;
    createdAt: string;
    updatedAt: string;
    client: InvoiceClient;
}

export interface InvoicesData {
    result: number;
    invoices: Invoice[];
    totalPages: number;
    currentPage: number;
}

export interface InvoicesResponse {
    status: "success";
    message: string;
    data: InvoicesData;
}