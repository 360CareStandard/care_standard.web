// src/api/activity/types.ts

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface Pagination {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

/* -------------------------------------------------------------------------- */
/*                                   ALERTS                                   */
/* -------------------------------------------------------------------------- */

export type AlertPriority = "low" | "medium" | "high";

export type AlertStatus = "open" | "under-review";

export type AlertType = "report";

export type IncidentType =
    | "near-miss"
    | "behavioural-concern"
    | "safeguarding-concern"
    | "incident";

export interface ActivityAlert {
    id: string;
    title: string;
    clientId: string;
    clientName: string;
    reportedByStaffId: string;
    reportedBy: string;
    description: string;
    status: AlertStatus;
    type: AlertType;
    incidentType: IncidentType;
    priority: AlertPriority;
    incidentDateTime: string;
    createdAt: string;
}

export interface AlertListData extends Pagination {
    alerts: ActivityAlert[];
}

export type AlertListResponse = ApiResponse<AlertListData>;

export interface AlertListParams {
    priority?: AlertPriority;
    page?: number;
    limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                                 CARE LOGS                                  */
/* -------------------------------------------------------------------------- */

export type CareLogStatus = "completed" | "pending" | "missed";

export interface CareLogCarer {
    id: string;
    name: string;
}

export interface CareLog {
    id: string;
    clientId: string;
    clientName: string;
    carerStaffId: string;
    carer: string;
    secondaryCarer: CareLogCarer | null;
    carers: CareLogCarer[];
    status: CareLogStatus;
    visitDate: string;
    visitStartTime: string;
    visitEndTime: string;
    duration: number;
    actualCheckIn: string | null;
    actualCheckOut: string | null;
    missedReason: string | null;
    missedNotes: string | null;
    createdAt: string;
}

export interface CareLogListData extends Pagination {
    careLogs: CareLog[];
}

export type CareLogListResponse = ApiResponse<CareLogListData>;

export interface CareLogListParams {
    status?: CareLogStatus;
    page?: number;
    limit?: number;
}

/* -------------------------------------------------------------------------- */
/*                              SYSTEM ACTIVITY                               */
/* -------------------------------------------------------------------------- */

export interface SystemActivity {
    id: string;

    // The API response you supplied currently returns an empty array,
    // so the actual fields are not known yet.
    [key: string]: unknown;
}

export interface SystemActivityListData extends Pagination {
    activities: SystemActivity[];
}

export type SystemActivityListResponse =
    ApiResponse<SystemActivityListData>;

export interface SystemActivityListParams {
    page?: number;
    limit?: number;
}