export interface StaffUser {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}

export interface StaffRole {
    name: "Carer" | "StaffAdmin";
    description: string;
}

export interface StaffPermissions {
    id: string;
    user: StaffUser;
    roles: StaffRole[];
    status: "Active" | "Inactive" | "Terminated";
    adminAccessLevel: boolean;
    platformAccess: boolean;
    mobileAppAccess: boolean;
}

export interface StaffPermissionResponse {
    status: "success";
    message: string;
    data: {
        staffPermissions: StaffPermissions;
    };
}