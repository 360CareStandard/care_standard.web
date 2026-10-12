import { Workspace } from "../workspace";

export interface ClientCarePlanResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientCarePlan: ClientClientCarePlan;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface CarerDetails {
  id: string;
  staffRole: string;
  primaryPhoneNumber: string;
  primaryPhoneNumberType: string;
  profilePicture: string | null;
  preferredName: string;
  gender: string;
  status: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
}

interface EscalationContact {
  id: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  relationshipToClient: string;
  isEmergencyContact: boolean;
  isPrimaryContact: boolean;
  hasAppAccess: boolean;
  notes: string;
  status: string;
  metadata: Record<string, unknown>;
}

export interface ClientClientCarePlan {
  carePackage: {
    id: string;
    name: string;
    description: string;
  };
  id: string; // UUID
  clientId: string;
  agencyId: string;
  packageId: string;
  authorisedHoursPerWeek: number;
  authorizationNumber: string;
  avoidedCarers: string[];
  budgetCap: number | null;
  carePlan: ClientCarePlanDetails;
  checkInMethod: "gps" | "nfc" | "qr code" | "qr-code" | "qr_code";
  client: ClientDetails;
  continuityPriority: boolean;
  createdAt: string; // ISO datetime
  doubleUpVisitRequired: boolean;
  escalationContact?: EscalationContact;
  fundingType?: "NHS" | "local authority" | "private" | "mixed" | null;
  funder?: string | null;
  fundingSource?: "NHS" | "local authority" | "private" | "mixed" | null;
  languageRequirements: string[];
  lateVisitAlertThreshold?: number | null;
  loneWorkerAlertEnabled: boolean;
  overnightCareEndTime?: string | null; // "HH:mm:ss"
  overnightCareRequired: boolean;
  overnightCareStartTime?: string | null; // "HH:mm:ss"
  overnightCareType?: "sleep-in" | "waking-night" | null;
  preferredCarers: string[];
  requiredSkills: string[];
  startDate: string; // ISO date string, e.g. "2025-11-01T00:00:00.000Z"
  status: "active" | "paused" | "ended";
  updatedAt: string; // ISO datetime
  escalationContactId: string; // UUID
  visitDurationPreset?: "15" | "30" | "45" | "60";
  visitPeriodPreset?: string;
  preferredCarersDetails: CarerDetails[];
  avoidedCarersDetails: CarerDetails[];
}

export interface ClientCarePlanDetails {
  id: string;
  name: string;
}

export interface ClientDetails {
  id: string;
  firstname: string;
  lastname: string;
  // add other optional fields if API includes them
}
