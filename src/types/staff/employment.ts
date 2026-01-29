export type employmentDetails = {
  createdAt: string;
  endDate: string | null;
  id: string;
  reason: string | null;
  staffId: string;
  startDate: string;
  status: "active" | "inactive" | "terminated";
  employmentType: string | null;
  terminatedDate: string | null;
  updatedAt: string;
  weeklyContractedHours: string | null;
};

export interface StaffEmploymentResponse {
  status: "success" | "error";
  data: {
    employmentDetails: employmentDetails[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

// export interface StaffEmploymentResponse {
//   // status: "success" | "error" | string;
//   message?: string;
//   data?: {
//     employmentDetails: employmentDetails[];
//   };
// }
// export interface EmploymentDetailsResponse {
//   // status: "success" | "error" | string;
//   status?: string;
//   data?: employmentDetails[];
//   pagination: {
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   };
// }
