import { ClientStatus } from "../client/client";

// You can swap these to enums later if your backend is strict.
export type PhoneNumberType = "mobile" | "work" | string;
export type StaffStatus = "Active" | "Inactive" | string;
export type Gender = "Male" | "Female" | "Other" | string;

export type ScheduleType = "recurring" | "one-off" | string;
export type VisitScheduleStatus = "scheduled" | "completed" | "cancelled" | string;
export type FundingSource = "local-authority" | "nhs" | string;

export interface ApiResponse<T> {
    status: "success" | "error" | string;
    message: string;
    data: T;
}

export interface StaffUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
}

export interface VisitSchedule {
    id: string;
    scheduleType: ScheduleType;

    // NOTE: backend returns null for recurring schedules
    visitDate: string | null; // e.g. "2026-02-25" or null

    // NOTE: backend returns "HH:mm:ss"
    visitStartTime: string; // "08:00:00"
    visitEndTime: string;   // "10:04:00"

    duration: number; // minutes
    status: VisitScheduleStatus;
    carersNeeded: number;

    assignedStaffId: string;
    secondaryStaffId: string | null;

    preferredCarers: string[];
    activitiesRequired: string[];

    fundingSource: FundingSource;

    isAssignedStaff: boolean;
    isSecondaryStaff: boolean;
    isPreferredCarer: boolean;
}

export interface AssignedClient {
    id: string;
    firstname: string;
    lastname: string;

    addressLine1: string;
    city: string;
    zip: string;

    phone: string;
    imageUrl: string | null;
    carePackageName: string;
    status: ClientStatus;

    totalSchedules: number;
    activeSchedules: number;

    visitSchedules: VisitSchedule[];
}

export interface StaffWithAssignedClients {
    id: string;
    userId: string;
    agencyId: string;

    primaryPhoneNumber: string;
    primaryPhoneNumberType: PhoneNumberType;

    secondaryPhoneNumber: string | null;
    secondaryPhoneNumberType: PhoneNumberType | null;

    preferredName: string | null;

    // NOTE: your payload uses "tittle" (typo?) — keep it as-is to match API.
    tittle: string | null;

    pronouns: string | null;
    staffRole: string;
    status: StaffStatus;

    gender: Gender;
    dob: string; // "YYYY-MM-DD"

    adminAccessLevel: boolean;

    profilePicture: string | null;
    highlights: string | null;

    createdAt: string; // ISO date-time
    updatedAt: string; // ISO date-time

    user: StaffUser;
    assignedClients: AssignedClient[];

    clientCount: number;
    totalVisitSchedules: number;
}

// ✅ This is the final response type for your sample payload:
export type GetStaffWithAssignedClientsResponse =
    ApiResponse<StaffWithAssignedClients>;