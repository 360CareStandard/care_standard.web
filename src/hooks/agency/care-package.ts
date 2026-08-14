import { CarePackageApi } from "@/api/package";
import { qk } from "@/lib/queryKeys";
import { CarePackageFormData } from "@/pages/schemas/care-package";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCarePackage() {
  return useQuery({
    queryKey: qk.carePackage(),
    queryFn: () => CarePackageApi.list(),
    staleTime: 60_000,
  });
}
export function useSingleCarePackage(packageId: string, enabled = false) {
  return useQuery({
    // unique key for a single contact
    queryKey: packageId ? qk.carePackage(packageId) : ["care-package"],
    queryFn: () => CarePackageApi.get(packageId),
    enabled: Boolean(packageId && enabled),
    // staleTime: 60_000,
  });
}


export function useCreateCarePackage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CarePackageFormData) => {
      return CarePackageApi.post(body);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.carePackage() });
    },
  });
}

export function useUpdateCarePackage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      packageId,
      body,
    }: {
      packageId: string;
      body: CarePackageFormData;
    }) => {
      if (!packageId) {
        throw new Error("packageId is required");
      }

      return CarePackageApi.update(packageId, body);
    },

    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: qk.carePackage(),
      });

      qc.invalidateQueries({
        queryKey: qk.carePackage(variables.packageId),
      });
    },
  });
}
export function useDeleteCarePackage(packageId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!packageId) throw new Error("PackageId is required to delete a care package");

      return CarePackageApi.delete(packageId);
    },
    onSuccess: () => {
      return qc.invalidateQueries({ queryKey: qk.carePackage() });
    },
  });
}