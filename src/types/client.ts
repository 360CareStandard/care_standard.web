// src/types/client.ts

export type RiskLevel = "low" | "medium" | "high" | string;
export type Gender = "male" | "female" | null | string;
export type PhoneType = "home" | "mobile" | "work" | null | string;
export type ClientStatus = "active" | "inactive" | string | null;

export interface Agency {
  id: string;
  tradingName: string;
  legalName: string;
  country: string | null;
}

export interface Client {
  id: string;
  agencyId: string;
  primaryContactUserId: string | null;
  firstname: string;
  lastname: string;
  middlename?: string; // sometimes empty string
  preferredname?: string;
  pronouns?: string | null;
  dob?: string | null; // ISO date string e.g. "2002-06-07"
  title?: string | null;
  gender?: Gender;
  nationality?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  city?: string | null;
  county?: string | null;
  accessDetails?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  latitude?: string | null; // server returns stringified coords
  longitude?: string | null;
  secureCheckInZone?: number | null;
  phone?: string | null;
  phoneType?: PhoneType;
  secondaryPhone?: string | null;
  secondaryPhoneType?: PhoneType;
  email?: string | null;
  wellbeingDetails?: string | null;
  riskLevel?: RiskLevel;
  status?: ClientStatus;
  metadata?: Record<string, unknown>;
  createdAt?: string; // ISO
  updatedAt?: string; // ISO
  agency?: Agency | null;
}

export interface ClientsData {
  result: number;
  clients: Client[];
  totalPages: number;
  currentPage: number | string;
}

export interface ClientsResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: ClientsData;
}

export interface UpdateClientBody extends Partial<Client> {}
