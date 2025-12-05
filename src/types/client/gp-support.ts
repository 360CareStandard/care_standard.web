import { Workspace } from "../workspace";
export interface ClientGPAndSupportResponse {
  status: "success" | "error";
  message: string;
  data: {
    clientGPAndSupport: ClientGPAndSupport;
    agency: Workspace;
    country: string;
    id: string; // same as agency.id
    legalName: string;
    tradingName: string;
  };
}

export interface ClientGPAndSupport {
  id: string;
  clientId: string;
  agencyId: string;

  gpDetails: GPDetails;

  otherHealthcareProfessionals: OtherHealthcareProfessional[];

  createdAt: string;
  updatedAt: string;

  client: ClientDetails;
}

export interface ClientDetails {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  // add other optional fields if API includes them
}

export interface GPDetails {
  gpName: string;
  practiceName: string;
  practiceAddress: string;
  email: string;
  phone: string;
}

export type Role =
  | "Therapist"
  | "District Nurse"
  | "Social Worker"
  | "Consultant";

export interface OtherHealthcareProfessional {
  role: Role;
  email: string;
  phone: string;
  organisation: string;
  notes: string;
  // NOTE: Backend returned no "name", but your UI expects `name`
  // If it truly doesn't exist, remove name from UI.
  // If you want it optional:
  name: string;
}
