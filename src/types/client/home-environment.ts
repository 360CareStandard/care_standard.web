import { Workspace } from "../workspace";
export interface ClientHomeEnvironmentResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientHomeEnvironment: ClientHomeEnvironment;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface ClientHomeEnvironment {
  id: string;
  clientId: string;
  agencyId: string;

  livingSituation: {
    livesAlone: boolean;
    supportType: "Own House" | "Council Housing" | "Supported Living" | "Other";
    propertyType: "Flat" | "House" | "Supported Housing" | "Residential Care";
    householdMembers: {
      name: string;
      relationship: string;
    }[];
  };

  accessAndSecurity: {
    buzzerCode?: string;
    keySafeCode?: string;
    accessMethod?: string;
    specialAccessNotes?: string;
  };

  environmentAndEquipment: {
    pets?: string;
    knownHazards: string[]; // e.g. ["Clutter", "Stairs"]
    equipmentPresent: string[]; // e.g. ["Hospital Bed"]
  };

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
