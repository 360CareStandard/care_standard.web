// types/care-plan.ts

export type CarePlanOutcomeStatus = "not-started" | "in-progress" | "achieved";

export type CarePlanStatus = "active" | "inactive" | "archived" | "completed";

export type CarePlanSeverity = "low" | "medium" | "high";

export interface CarePlanTask {
  name: string;
  description: string;
}

export interface CarePlanRisk {
  description: string;
  mitigation: string;
  severity: CarePlanSeverity;
}

export interface ResponsiblePerson {
  id: string;
  userId: string;
  agencyId: string;
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
  };
}
export interface CarePlan {
  id: string;
  clientId: string;
  agencyId: string;

  createdBy: string;
  updatedBy: string | null;

  assessmentType:
    | "personal-care"
    | "daily-living"
    | "mobility-falls"
    | "nutrition-hydration"
    | "mental-health"
    | "social-engagement"; // e.g. "personal-care", "daily-living"

  needs: string;
  goal: string;
  expectedOutcomes: string;
  outcomeStatus: CarePlanOutcomeStatus;

  reviewDueDate: string; // ISO date string: "YYYY-MM-DD"

  responsiblePersonId: string;
  // the API may return this later, so keep it optional
  responsiblePersonName?: string | null;

  tasks: CarePlanTask[];
  risks: CarePlanRisk[];
  responsiblePerson?: ResponsiblePerson;
  // extra optional fields that may be present on some records
  tags?: string[];
  notesSummary?: string;

  metadata: Record<string, unknown>;

  status: CarePlanStatus;

  createdAt: string; // ISO timestamps
  updatedAt: string;
  deletedAt: string | null;
}

// full fetch response shape
export interface CarePlansResponse {
  status: "success";
  message: string;
  data: {
    result: number;
    carePlans: CarePlan[];
    totalPages: number;
    currentPage: number;
  };
}
export interface CarePlanResponse {
  // status: "success" | "error" | string;
  message?: string;
  data?: {
    carePlans: CarePlan;
  };
}
