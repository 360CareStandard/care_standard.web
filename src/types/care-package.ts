import { Workspace } from "./workspace";

export interface CarePackage {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  rate: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  agency: Workspace;
}

export interface CarePackageData {
  result: number;
  carePackages: CarePackage[];
  totalPages: number;
  currentPage: number | string;
}
export interface CarePackageResponse {
  status: "success" | "error" | string;
  message?: string;
  data?: CarePackageData;
}
export interface CarePackageSingleResponse {
  status: "success" | "error" | string;
  message?: string;
  data?: CarePackage;
}

