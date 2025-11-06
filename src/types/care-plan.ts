import { Workspace } from "./workspace";

export interface CarePlan {
  id: string;
  agencyId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  agency: Workspace;
}

export interface CarePlanData {
  result: number;
  carePlans: CarePlan[];
  totalPages: number;
  currentPage: number | string;
}
export interface CarePlanResponse {
  status: "success" | "error" | string;
  message?: string;
  data?: CarePlanData;
}
