export type ContactDetails = {
  contactName: string;
  relationshipToClient:
    | "spouse"
    | "son"
    | "daughter"
    | "sibling"
    | "parent"
    | "friend"
    | "neighbor"
    | "guardian"
    | "carer"
    | "other";
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  notes: string;
  isPrimaryContact: boolean;
  isEmergencyContact: boolean;
  hasAppAccess: boolean;
};
