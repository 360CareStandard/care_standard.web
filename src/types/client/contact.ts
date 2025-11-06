export type ClientContact = {
  id: string;
  clientId: string;
  agencyId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  relationshipToClient: string;
  isEmergencyContact: boolean;
  isPrimaryContact: boolean;
  hasAppAccess: boolean;
  notes?: string;
  status: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export interface ClientContactsResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    contacts: ClientContact[];
  };
}
export interface ClientContactResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    contact: ClientContact;
  };
}
