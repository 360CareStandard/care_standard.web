export interface StaffDocument {
  id: string;
  staffId: string;
  documentType: DocumentType;
  documentUrl: string;
  expired: boolean;
  expiryDate: string | null;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType =
  | "ID"
  | "Driving license"
  | "Proof of address"
  | "References"
  | "DBS record";

export interface StaffDocumentsResponse {
  status: "success";
  data: {
    documents: StaffDocument[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
