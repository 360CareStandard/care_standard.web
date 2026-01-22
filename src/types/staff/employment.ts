export type employmentDetails = {
  id: string;
  staffId: string;
  relationship: string;
  address: string;
  latitude: string;
  longitude: string;
  map: string;
  modeOfTransport: string;
  rateCard: string;
  travelRateCard: string;
  note: string;
  isEmail: boolean;
  isPhone: boolean;
  isText: boolean;
  isApp: boolean;
  gender?: string;
  createdAt: string;
  updatedAt: string;
};

export interface StaffEmploymentResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    employmentDetails: employmentDetails[];
  };
}
export interface EmploymentDetailsResponse {
  // status: "success" | "error" | string;
  status?: string;
  data?: employmentDetails;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
