
import { FinanceFormData, InvoicePreferencesFormType } from "@/pages/schemas/finance";
import { ChargesResponse } from "@/types/finance/charges";
import { InvoicesResponse } from "@/types/finance/invoice";
import { InvoicePreferencesResponse } from "@/types/finance/invoice-preference";
import { FinanceOverviewResponse } from "@/types/finance/overview";
import { PaymentsResponse } from "@/types/finance/payments";
import { InvoiceResponse } from "@/types/finance/single-invoice";
import { apiGet, apiPost } from "@/utils/api-connect";

export const FinanceApi = {
    getOverview: () =>
        apiGet<FinanceOverviewResponse>(`/finance/overview`).then(
            (r) => r.data,
        ),
    listInvoices: async (params?: { q?: string; page?: number; limit?: number }) => {
        const safe = {
            page: Number(params?.page ?? 1),
            limit: Number(params?.limit ?? 10),
            search: params?.q ?? undefined,
        };

        return apiGet<InvoicesResponse>("/finance/invoices", safe).then(
            (r) => r.data,
        );
    },

    listCharges: async (params?: { q?: string; page?: number; limit?: number }) => {
        const safe = {
            page: Number(params?.page ?? 1),
            limit: Number(params?.limit ?? 10),
            status: params?.q ?? undefined,
        };

        return apiGet<ChargesResponse>("/finance/charges", safe).then(
            (r) => r.data,
        );
    },
    listPayments: async (params?: { q?: string; page?: number; limit?: number }) => {
        const safe = {
            page: Number(params?.page ?? 1),
            limit: Number(params?.limit ?? 10),
            status: params?.q ?? undefined,
        };

        return apiGet<PaymentsResponse>("/finance/payments", safe).then(
            (r) => r.data,
        );
    },

    getSingleInvoice: (id: string) =>
        apiGet<InvoiceResponse>(`/finance/invoices/${id}`).then(
            (r) => r.data,
        ),


    exportInvoice: async () => {
        const response = await apiGet("/finance/invoices/export");

        return response;
    },
    generateInvoice: async (body: FinanceFormData) =>
        apiPost<{ status: "success" }>(
            `/finance/invoices`,
            body),
    createInvoicePreferences: async (body: InvoicePreferencesFormType) =>
        apiPost<{ status: "success" }>(
            `/finance/billing/settings`,
            body),
    confirmPayment: (formData: FormData, id: string) =>
        apiPost<{ status: "success" }>(`/finance/payments/${id}/confirm`, formData),

    getInvoicePreferences: () =>
        apiGet<InvoicePreferencesResponse>(`/finance/billing/settings`).then(
            (r) => r.data,
        ),
};
