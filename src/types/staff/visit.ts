// VisitSchedulesResponse.ts

export interface StaffVisitSchedulesResponse {
    status: "success" | "error";
    message: string;
    data: {
        visits: StaffVisit[];
        total: number;
        totalPages: number;
        currentPage: number;
    };
}

export type ScheduleType = "recurring" | "one-off";
export type VisitFrequency = "daily" | "weekly" | "monthly";
export type FundingSource = "nhs" | "local-authority" | "private" | string;
export type VisitStatus =
    | "scheduled"
    | "in-progress"
    | "completed"
    | "cancelled"
    | "missed"
    | string;

export interface StaffVisit {
    id: string;
    clientId: string;
    agencyId: string;

    scheduleType: ScheduleType | string;
    visitFrequency: VisitFrequency | string;

    daysOfWeek: string[] | null;
    repeatEveryWeeks: number | null;

    visitDate: string | null; // "YYYY-MM-DD" (if one-off)
    visitStartTime: string; // "HH:mm:ss"
    visitEndTime: string; // "HH:mm:ss"
    duration: number; // minutes

    startDate: string | null; // "YYYY-MM-DD"
    endDate: string | null; // "YYYY-MM-DD"
    noEndDate: boolean;

    carersNeeded: number;
    preferredCarers: string[];

    assignedStaffId: string | null;
    secondaryStaffId: string | null;

    requiredSkills: string[];
    activitiesRequired: string[];

    fundingSource: FundingSource;
    status: VisitStatus;

    actualCheckIn: string | null; // ISO string
    actualCheckOut: string | null; // ISO string
    actualDuration: number | null;

    checkInLatitude: number | null;
    checkInLongitude: number | null;
    checkOutLatitude: number | null;
    checkOutLongitude: number | null;

    activitiesCompleted: string[] | null;
    activitiesNotes: string | null;
    medicationAdministered: boolean | null;

    clientMood: string | null;
    clientCondition: string | null;

    incidentReported: boolean;
    incidentDetails: string | null;

    concernsRaised: boolean;
    concernDetails: string | null;

    clientSignature: string | null;
    signedAt: string | null; // ISO string

    missedReason: string | null;
    missedNotes: string | null;

    cancelledAt: string | null; // ISO string
    cancelledBy: string | null;
    cancellationReason: string | null;

    checkedInBy: string | null;
    checkedOutBy: string | null;

    parentScheduleId: string | null;

    createdAt: string; // ISO string
    updatedAt: string; // ISO string

    assignedStaff: AssignedStaff | null;
    client: VisitClient | null;
    parentSchedule: unknown | null; // replace when you know the shape
}

export interface AssignedStaff {
    id: string;
    staffRole: string;
    primaryPhoneNumber: string | null;
    primaryPhoneNumberType: string | null;
    profilePicture: string | null;
    user: StaffUser;
}

export interface StaffUser {
    firstname: string;
    lastname: string;
    email: string;
    phone: string | null;
}

export interface VisitClient {
    id: string;
    firstname: string;
    lastname: string;
    addressLine1: string | null;
    city: string | null;
    zip: string | null;
    imageUrl: string | null;
}