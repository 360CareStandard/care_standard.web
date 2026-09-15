export interface FinanceAnalytics {
    totalBilled: number;
    outstanding: number;
    paid: number;
    overdue: number;
}

export interface RecentInvoiceClient {
    id: string;
    firstname: string;
    lastname: string;
}

export interface RecentInvoice {
    totalAmount: number;
    amountPaid: number;
    id: string;
    invoiceNumber: string;
    clientId: string;
    status: string;
    currency: string;
    issueDate: string;
    dueDate: string;
    client: RecentInvoiceClient;
}

export interface FinanceOverviewData {
    analytics: FinanceAnalytics;
    recentInvoices: RecentInvoice[];
}

export interface FinanceOverviewResponse {
    status: string;
    message: string;
    data: FinanceOverviewData;
}