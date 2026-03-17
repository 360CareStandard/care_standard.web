export type FamilyAccessUser = {
    id: string;
    firstname: string;
    lastname: string;
    email?: string;
};

export type FamilyAccessAgency = {
    id: string;
    tradingName: string;
};

export type FamilyAccessItem = {
    id: string;
    clientId: string;
    agencyId: string;
    invitedById: string;
    linkedUserId: string;

    fullName: string;
    email: string;
    phone: string;
    relationshipToClient: string;
    accessLevel: string;

    invitationStatus: string;
    status: string;

    invitedAt: string;
    acceptedAt: string | null;
    expiresAt: string;
    revokedAt: string | null;

    notes: string | null;
    metadata: Record<string, any>;

    createdAt: string;
    updatedAt: string;

    agency: FamilyAccessAgency;
    client: FamilyAccessUser;
    invitedBy: FamilyAccessUser;
    linkedUser: FamilyAccessUser;
};

export interface FamilyAccessListResponse {
    // status: "success" | "error" | string;
    message?: string;
    data?: {
        familyAccess: FamilyAccessItem[];
    };
}

export interface FamilyAccessSingleResponse {
    // status: "success" | "error" | string;
    status?: string;
    message?: string;
    data?: FamilyAccessItem;
}