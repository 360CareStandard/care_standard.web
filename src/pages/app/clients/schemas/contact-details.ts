export type ContactDetails = {
  fullName: string;
  relationship:
    | "Spouse"
    | "Son"
    | "Daughter"
    | "Sibling"
    | "Parent"
    | "Friend"
    | "Neighbor"
    | "Carer"
    | "Other";
  phone: string;
  email: string;
  address: string;
  notes: string;
  primaryContact: boolean;
  emergencyContact: boolean;
  familyAccessApp: boolean;
};
