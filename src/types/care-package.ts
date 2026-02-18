import { Workspace } from "./workspace";

export interface CarePackage {
  id: string;
  agencyId: string;
  name: string;
  description: string;
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
