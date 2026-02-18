import { Workspace } from "../workspace";
export interface ClientHealthDetailsResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientHealthDetails: ClientHealthDetails;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface ClientHealthDetails {
  id: string;
  clientId: string;
  agencyId: string;

  diagnosedConditions: DiagnosedCondition[];
  clinicalNotes: string;
  knownAllergies: KnownAllergy[];

  overallRiskLevel: "low" | "medium" | "high";
  riskCategories: string[];

  riskResponsiblePerson: string | null;
  mitigationStrategies: string;

  metadata: Record<string, any>;
  status: "active" | "archived";

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  client: ClientDetails;
}

export interface ClientDetails {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  // add other optional fields if API includes them
}

export interface DiagnosedCondition {
  name: string;
  notes: string;
  diagnosisDate: string; // YYYY-MM-DD
}

export interface KnownAllergy {
  type: "Drug" | "Food" | "Environment";
  notes: string;
  allergen: string;
  severity: "Mild" | "Moderate" | "Severe";
}
