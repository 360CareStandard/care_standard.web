export type UUID = string;

export type ISODateString = string;
// e.g. "2026-02-12"

export type ISODateTimeString = string;
// e.g. "2026-02-12T11:00:12.090Z"

export type TimeString = string;
// e.g. "11:57:00"

export type ScheduleType = "recurring" | "one-off";

export type VisitFrequency = "daily" | "weekly" | "custom";

export type VisitStatus =
  | "scheduled"
  | "completed"
  | "missed"
  | "cancelled"
  | "in-progress"
  | "active";

export type FundingSource = "private" | "nhs";

export type DayOfWeek =
  | "mon"
  | "tue"
  | "wed"
  | "thu"
  | "fri"
  | "sat"
  | "sun";

export interface StaffUser {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
}

export interface StaffDetails {
  id: UUID;

  /**
   * May not be returned by every visit-schedule endpoint.
   */
  staffRole?: string;

  primaryPhoneNumber: string;
  primaryPhoneNumberType: string;

  user: StaffUser;

  profilePicture: string | null;
}

export interface NoteDetails {
  id: UUID;
  note: string;
  metadata?: Record<string, unknown>;
}

export interface ActivitiesNotes {
  [activity: string]: string;
}

export interface VisitScheduleType {
  // ---------------------------------------------------------
  // Identity
  // ---------------------------------------------------------

  id: UUID;
  clientId: UUID;
  agencyId: UUID;

  // ---------------------------------------------------------
  // Schedule configuration
  // ---------------------------------------------------------

  scheduleType: ScheduleType;
  visitFrequency: VisitFrequency;

  daysOfWeek: DayOfWeek[] | null;
  repeatEveryWeeks: number;

  visitDate: ISODateString | null;

  visitStartTime: TimeString;
  visitEndTime: TimeString;

  /**
   * Planned/scheduled duration in minutes.
   */
  duration: number;

  startDate: ISODateString;
  endDate: ISODateString;
  noEndDate: boolean;

  // ---------------------------------------------------------
  // Staffing
  // ---------------------------------------------------------

  carersNeeded: number;

  preferredCarers: UUID[];

  assignedStaffId: UUID | null;
  secondaryStaffId: UUID | null;

  // ---------------------------------------------------------
  // Requirements
  // ---------------------------------------------------------

  requiredSkills: string[];

  activitiesRequired: string[];

  // ---------------------------------------------------------
  // Funding / status
  // ---------------------------------------------------------

  fundingSource: FundingSource;

  status: VisitStatus;

  // ---------------------------------------------------------
  // Actual attendance
  // ---------------------------------------------------------

  actualCheckIn: ISODateTimeString | null;
  actualCheckOut: ISODateTimeString | null;

  /**
   * Actual time spent on the visit in minutes.
   */
  actualDuration: number | null;

  // ---------------------------------------------------------
  // Check-in / check-out location
  // API currently returns these as strings.
  // ---------------------------------------------------------

  checkInLatitude: string | null;
  checkInLongitude: string | null;

  checkOutLatitude: string | null;
  checkOutLongitude: string | null;

  // ---------------------------------------------------------
  // Visit activities / care delivery
  // ---------------------------------------------------------

  activitiesCompleted: string[] | null;

  /**
   * Maps an activity name to its note.
   *
   * Example:
   * {
   *   Toileting: "No issues"
   * }
   */
  activitiesNotes: ActivitiesNotes | null;

  medicationAdministered: string[] | null;

  // ---------------------------------------------------------
  // Notes
  // ---------------------------------------------------------

  notes: NoteDetails[];

  visitNotes: string | null;
  carerNotes: string | null;

  // ---------------------------------------------------------
  // Client outcome
  // ---------------------------------------------------------

  clientMood: string | null;
  clientCondition: string | null;

  // ---------------------------------------------------------
  // Incidents
  // ---------------------------------------------------------

  incidentReported: boolean;
  incidentDetails: string | null;

  // ---------------------------------------------------------
  // Concerns
  // ---------------------------------------------------------

  concernsRaised: boolean;
  concernDetails: string | null;

  // ---------------------------------------------------------
  // Client signature
  // ---------------------------------------------------------

  clientSignature: string | null;
  signedAt: ISODateTimeString | null;

  // ---------------------------------------------------------
  // Missed visit
  // ---------------------------------------------------------

  missedReason: string | null;
  missedNotes: string | null;

  // ---------------------------------------------------------
  // Cancellation
  // ---------------------------------------------------------

  cancelledAt: ISODateTimeString | null;
  cancelledBy: UUID | null;
  cancellationReason: string | null;

  // ---------------------------------------------------------
  // Attendance audit
  // ---------------------------------------------------------

  checkedInBy: UUID | null;
  checkedOutBy: UUID | null;

  // ---------------------------------------------------------
  // Recurring schedule relationship
  // ---------------------------------------------------------

  parentScheduleId: UUID | null;

  // ---------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------

  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;

  // ---------------------------------------------------------
  // Expanded staff relations from backend
  // ---------------------------------------------------------

  assignedStaff?: StaffDetails | null;

  secondaryStaff?: StaffDetails | null;

  preferredCarersDetails: StaffDetails[];
}

export interface VisitSchedulesResponse {
  message?: string;
  data: VisitScheduleType[];
}

export interface VisitScheduleResponse {
  message?: string;
  data: VisitScheduleType;
}