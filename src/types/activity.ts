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

export type SystemActivityAction = "access-granted" | (string & {});

export interface SystemActivityUser {
    id: string;
    name: string;
    email: string;
}

export interface SystemActivityTarget {
    userId: string;
    staffId: string;
    name: string;
    email: string;
}

export interface SystemActivity {
    id: string;
    action: SystemActivityAction;
    description: string;

    changedBy: SystemActivityUser;
    target: SystemActivityTarget;

    fromRole: string;
    toRole: string;

    previousRoles: string[];
    newRoles: string[];
    addedRoles: string[];
    removedRoles: string[];

    ipAddress: string;
    createdAt: string;
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


// "access-granted"
// "access-revoked"
// "role-changed"
// "user-created"
// "user-updated"
// "user-deactivated"
// "password-reset"