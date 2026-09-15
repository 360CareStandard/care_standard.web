export type ChargeStatus = "billed" | "unbilled";

export interface Charge {
    id: string;
    client: string;
    date: string;
    duration: string;
    rate: string;
    rateName: string;
    amount: string;
    status: ChargeStatus;
}

export interface ChargesData {
    result: number;
    charges: Charge[];
    totalPages: number;
    currentPage: number;
}

export interface ChargesResponse {
    status: string;
    message: string;
    data: ChargesData;
}