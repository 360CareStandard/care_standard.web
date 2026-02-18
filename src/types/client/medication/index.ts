// types/medication.ts

export type MedicationRoute =
  | "oral"
  | "topical"
  | "injection"
  | "inhaled"
  | "rectal";

export type MedicationStatus =
  | "active"
  | "paused"
  | "completed"
  | "discontinued"
  | "stopped";

export type MedicationFrequency =
  | "Once daily"
  | "Twice daily"
  | "Three times daily"
  | "Four times daily"
  | "As required";

export type MedicationAdministeredBy = "carer" | "self" | "mixed" | "family";

export interface Medication {
  id: string;
  clientId: string;
  agencyId: string;

  medicationName: string;
  dosage: string; // "500mg"
  route: MedicationRoute;
  frequency: MedicationFrequency;

  doseInstruction: string; // "two tablets"
  doseTimes: string[]; // ["08:00", "20:00"]

  startDate: string; // YYYY-MM-DD
  endDate: string | null;
  noEndDate: boolean;

  prescriberName: string;
  additionalInstructions: string;

  administeredBy: MedicationAdministeredBy;
  linkedCareDomain: string;

  status: MedicationStatus;

  stoppedAt: string | null;
  stopReason: string | null;

  createdBy: string;
  updatedBy: string | null;

  metadata: Record<string, unknown>;

  createdAt: string; // ISO timestamp
  updatedAt: string;
  deletedAt: string | null;
}

// full fetch response shape
export interface MedicationsResponse {
  status: "success";
  message: string;
  data: {
    result: number;
    medications: Medication[];
    totalPages: number;
    currentPage: number;
  };
}
export interface MedicationResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    medications: Medication;
  };
}
