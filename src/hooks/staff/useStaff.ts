// src/hooks/useClients.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/queryKeys";
import { StaffProfileApi } from "@/api/staff/profile";
import { StaffFormData } from "@/pages/app/staff/schemas/add-staff";
import { AxiosError } from "axios";
import { ApiError } from "@/types/api-error";
import { keepPreviousData } from "@tanstack/react-query";

import { useInfiniteQuery } from "@tanstack/react-query";

export function useStaffScroll(params?: { q?: string; limit?: number }) {
  return useInfiniteQuery({
    queryKey: qk.staffInfinite(params),
    initialPageParam: 1,

    queryFn: ({ pageParam }) =>
      StaffProfileApi.list({
        q: params?.q,
        limit: params?.limit ?? 10,
        page: pageParam,
      }),

    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;

      const page = Number(pagination.page);
      const totalPages = Number(pagination.totalPages);

      return page < totalPages ? page + 1 : undefined;
    },

    staleTime: 60_000,
  });
}

export function useStaff(params?: {
  q?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: qk.staffList(params),
    queryFn: () => StaffProfileApi.list(params),
    select: (res) => res,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}

export function useStaffDetails(id?: string, enabled = true) {
  return useQuery({
    queryKey: id ? qk.staff(id) : ["staff", "nil"],
    queryFn: () => StaffProfileApi.get(id!),

    enabled: Boolean(id) && enabled,
    staleTime: 60_000,
  });
}

export function useCreateStaff() {
  const qc = useQueryClient();

  return useMutation<
    { status: "success" },
    AxiosError<ApiError<StaffFormData>>,
    FormData
  >({
    mutationFn: StaffProfileApi.post,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
    },
  });
}

export function useUpdateStaff(staffId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      StaffProfileApi.update(staffId, formData),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff"] });
      qc.invalidateQueries({ queryKey: qk.staff(staffId) });
    },
  });
}
export function useStaffWithClients(id: string) {
  return useQuery({
    queryKey: qk.staffWithClients(id),
    queryFn: () => StaffProfileApi.getStaffWithClients(id),
    select: (res) => res,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
}