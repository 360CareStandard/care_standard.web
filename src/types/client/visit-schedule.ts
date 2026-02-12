export type UUID = string;
export type ISODateString = string; // e.g. "2026-02-12"
export type ISODateTimeString = string; // e.g. "2026-02-12T11:00:12.090Z"
export type TimeString = string; // e.g. "11:57:00"

export type ScheduleType = "recurring" | "one-off";

export type VisitFrequency = "daily" | "weekly" | "custom";

export type VisitStatus =
  | "scheduled"
  | "completed"
  | "missed"
  | "cancelled"
  | "in-progress";

export type FundingSource = "private" | "nhs";

export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface VisitScheduleType {
  id: UUID;
  clientId: UUID;
  agencyId: UUID;

  scheduleType: ScheduleType;
  visitFrequency: VisitFrequency;

  daysOfWeek: DayOfWeek[] | null;
  repeatEveryWeeks: number;

  visitDate: ISODateString | null;

  visitStartTime: TimeString;
  visitEndTime: TimeString;
  duration: number; // in minutes

  startDate: ISODateString;
  endDate: ISODateString;
  noEndDate: boolean;

  carersNeeded: number;

  preferredCarers: UUID[];
  assignedStaffId: UUID | null;
  secondaryStaffId: UUID | null;

  requiredSkills: string[];
  activitiesRequired: string[];

  fundingSource: FundingSource;
  status: VisitStatus;

  actualCheckIn: ISODateTimeString | null;
  actualCheckOut: ISODateTimeString | null;
  actualDuration: number | null;

  checkInLatitude: number | null;
  checkInLongitude: number | null;
  checkOutLatitude: number | null;
  checkOutLongitude: number | null;

  activitiesCompleted: string[] | null;
  activitiesNotes: string | null;
  medicationAdministered: string[] | null;

  notes: string | null;
  visitNotes: string | null;
  carerNotes: string | null;

  clientMood: string | null;
  clientCondition: string | null;

  incidentReported: boolean;
  incidentDetails: string | null;

  concernsRaised: boolean;
  concernDetails: string | null;

  clientSignature: string | null;
  signedAt: ISODateTimeString | null;

  missedReason: string | null;
  missedNotes: string | null;

  cancelledAt: ISODateTimeString | null;
  cancelledBy: UUID | null;
  cancellationReason: string | null;

  checkedInBy: UUID | null;
  checkedOutBy: UUID | null;

  parentScheduleId: UUID | null;

  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface VisitSchedulesResponse {
  // status: "success" | "error" | string;
  message?: string;
  data: VisitScheduleType[];
}
export interface VisitScheduleResponse {
  // status: "success" | "error" | string;
  message?: string;
  data: VisitScheduleType;
}
