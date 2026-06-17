// src/hooks/useStaffKill.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { AgencySettingApi } from "@/api/agency/setting";

export function useAgencyLogo() {
    return useQuery({
        queryKey: ["agency-logo"],
        queryFn: () => AgencySettingApi.getLogo(),

        // staleTime: 60_000,
    });
}
export function useAgencyDocument() {
    return useQuery({
        queryKey: ["agency-documents"],
        queryFn: () => AgencySettingApi.getDocuments(),
        // staleTime: 60_000,
    });
}

export function useUploadAgencyLogo() {
    const qc = useQueryClient();

    return useMutation({
        // Accept a FormData
        mutationFn: (formData: FormData) => {
            return AgencySettingApi.postLogo(formData);
        },
        onSuccess: () => {
            return qc.invalidateQueries({ queryKey: qk.agencyLogo() });
        },
    });
}
export function useUploadAgencyDocument() {
    const qc = useQueryClient();

    return useMutation({
        // Accept a FormData
        mutationFn: (formData: FormData) => {
            return AgencySettingApi.postDocument(formData);
        },
        onSuccess: () => {
            return qc.invalidateQueries({ queryKey: qk.agencyDocument() });
        },
    });
}


export function useUpdateAgencyLogo() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => {
            return AgencySettingApi.updateLogo(formData);
        },
        onSuccess: () => {
            return qc.invalidateQueries({ queryKey: qk.agencyLogo() });
        },
    });
}

export function useDeleteAgencyDocument() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (documentId: string) => {
            return AgencySettingApi.deleteDocument(documentId);
        },
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: qk.agencyDocument() });
        },
    });
}
