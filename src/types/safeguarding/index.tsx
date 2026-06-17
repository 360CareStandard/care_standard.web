export const incidentTypeOptions = [
  { value: "safeguarding-concern", label: "Safeguarding Concern" },
  { value: "incident", label: "Incident" },
  { value: "accident", label: "Accident" },
  { value: "near-miss", label: "Near-Miss" },
  { value: "complaint", label: "Complaint" },
  { value: "compliment", label: "Compliment" },
  { value: "other", label: "Other" },
] as const;

export const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;

export type IncidentType = (typeof incidentTypeOptions)[number]["value"];

export type Priority = (typeof priorityOptions)[number]["value"];

export interface User {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Staff {
  id: string;
  user: User;
}

export interface Client {
  id: string;
  firstname: string;
  lastname: string;
}

export interface Evidence {
  url: string;
  filename: string;
  mimeType: string;
  uploadedAt: string; // ISO date
}

export type SafeguardingStatus =
  | "open"
  | "closed"
  | "under-review"
  | "action-taken";

export interface SafeguardingReport {
  id: string;
  agencyId: string;
  reportedByStaffId: string;
  clientId: string;
  title: string;
  incidentType: IncidentType;
  priority: Priority;

  incidentDateTime: string;
  location: string;
  description: string;

  actionTaken: string | null;

  attachedEvidence: Evidence[];

  status: SafeguardingStatus;

  closedAt: string | null;
  closedByStaffId: string | null;

  metadata: Record<string, any>;

  createdAt: string;
  updatedAt: string;

  reportedBy: Staff;
  client: Client;
}
export interface SafeguardingListData {
  reports: SafeguardingReport[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface SafeguardingListResponse {
  status: "success" | "error";
  message: string;
  data: SafeguardingListData;
}

export interface SafeguardingDetailResponse {
  status: "success" | "error";
  message: string;
  data: SafeguardingReport;
}

export interface SafeguardingReportAuditResponse {
  status: "success" | "error";
  message: string;
  data: {
    total: number;
    timeline: SafeguardingReportAudit[];
    totalPages: number;
    currentPage: number;
  };
}

export interface SafeguardingReportAudit {
  id: string;
  agencyId: string;
  userId: string;
  module: string;
  entityType: string;
  entityId: string;
  action: string;
  description: string;
  previousValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, any>;
  createdAt: string;
  user: {
    firstname: string;
    lastname: string;
  };
}
