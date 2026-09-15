interface Client {
    id: string;
    firstname: string;
    lastname: string;
}

export interface Payment {
    invoiceId: string;
    client: Client;
    invoiceNumber: string;
    amount: number;
    currency: string;
    status: string;
    datePaid: string | null;
    method: string | null;
}

interface PaymentData {
    result: number;
    payments: Payment[];
    totalPages: number;
    currentPage: number;
}

export interface PaymentsResponse {
    status: string;
    message: string;
    data: PaymentData;
}