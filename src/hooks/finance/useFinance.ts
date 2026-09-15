import { FinanceApi } from "@/api/finance";
import { qk } from "@/lib/queryKeys";
import { FinanceFormData } from "@/pages/schemas/finance";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useFinanceOverview() {
    return useQuery({
        queryKey: qk.financeOverview(),
        queryFn: () => FinanceApi.getOverview(),
        // staleTime: 60_000,
    });
}

export function useExportInvoices() {
    return useQuery({
        queryKey: ["finance-export"],
        queryFn: () => FinanceApi.exportInvoice(),
        // staleTime: 60_000,
    });
}

export function useInvoicesList(params?: {
    q?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: qk.financeInvoices(params),
        queryFn: () => FinanceApi.listInvoices(params),
        select: (res) => res,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
}
export function useChargesList(params?: {
    q?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: qk.financeCharges(params),
        queryFn: () => FinanceApi.listCharges(params),
        select: (res) => res,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
}
export function usePaymentList(params?: {
    q?: string;
    page?: number;
    limit?: number;
}) {
    return useQuery({
        queryKey: qk.financePayments(params),
        queryFn: () => FinanceApi.listPayments(params),
        select: (res) => res,
        staleTime: 60_000,
        placeholderData: keepPreviousData,
    });
}
export function useInvoice(id?: string, enabled = true) {
    return useQuery({
        queryKey: id ? qk.safeguarding(id) : ["safeguarding", "nil"],
        queryFn: () => FinanceApi.getSingleInvoice(id!),

        enabled: Boolean(id) && enabled,
        staleTime: 60_000,
    });
}


export function useGenerateInvoice() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (body: FinanceFormData) => {

            return FinanceApi.generateInvoice(body);
        },
        onSuccess: () => {
            // optionally update client query detail cache if needed
            return qc.invalidateQueries({ queryKey: ["finance"] });
        },
    });
} 