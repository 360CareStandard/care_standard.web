import { Workspace } from "../workspace";

export interface ClientLegalProfileResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientLegalProfile: ClientLegalProfile;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface ClientLegalProfile {
  id: string;
  clientId: string;
  agencyId: string;
  powerOfAttorney: "health" | "financial" | "none" | null; // adjust based on possible values
  poaHolderName: string | null;
  poaContact: string | null;
  poaValidFrom: string | null; // ISO date string (e.g., "2025-11-05")
  mentalCapacity: "has-capacity" | "lacks-capacity" | "unknown" | null;
  dnarActive: boolean;
  dnarReason: string | null;
  dnarSignedDate: string | null; // ISO date string
  hasDoLS: boolean;
  hasLPS: boolean;
  hasCourtOrder: boolean;
  hasGuardianship: boolean;
  legalReferenceNumber: string | null;
  legalResponsibleAuthority: string | null;
  legalStartDate: string | null; // ISO date string
  legalEndDate: string | null; // ISO date string
  dataSharingConsent: boolean;
  dataSharingConsentDate: string | null; // ISO date string
  dataSharingConsentSignedBy: string | null;
  dataSharingScope: string | null;
  photoConsent: boolean;
  photoConsentDate: string | null;
  contactConsentEmail: boolean;
  contactConsentSMS: boolean;
  contactConsentPhone: boolean;
  familyAppPermission: boolean;
  legalDocuments: string[]; // Array of URLs
  reviewDueDate: string | null; // ISO date string
  responsiblePerson: string | null;
  notesSummary: string | null;
  metadata: Record<string, unknown>;
  status: "active" | "inactive" | "pending" | string; // adjust as needed
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface ClientLegalProfileDetails {
  id: string;
  name: string;
}

export interface ClientDetails {
  id: string;
  firstname: string;
  lastname: string;
  // add other optional fields if API includes them
}
