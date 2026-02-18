export type StaffContact = {
  id: string;
  userId: string;
  relationship: string;
  nextOfKinFullName: string;
  phone: string;
  email: string;
  notes: string;
  address: string;
  availiableForUrgentSituation: boolean;
  mainPointOfContact: boolean;
  hasAppAccess: boolean;
  gender?: string;
  createdAt: string;
  updatedAt: string;
};

export interface StaffContactsResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    nextOfKins: StaffContact[];
  };
}
export interface StaffContactResponse {
  // status: "success" | "error" | string;
  status?: string;
  data?: StaffContact;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
