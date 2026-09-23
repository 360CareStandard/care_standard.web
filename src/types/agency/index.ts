export interface AgencyNewOwner {
    id: string;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    phone: string;
}

export interface AgencyNewCounts {
    members: number;
    staff: number;
    clients: number;
}

export interface AgencyNew {
    id: string;
    name: string;
    legalName: string;
    tradingName: string;
    country: string;
    logo: string | null;
    status: string;
    owner: AgencyNewOwner;
    counts: AgencyNewCounts;
    createdAt: string;
    updatedAt: string;
}

export interface AgenciesNewData {
    agencies: AgencyNew[];
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface AgenciesNewResponse {
    status: string;
    message: string;
    data: AgenciesNewData;
}

export interface AgencyStatusBreakdown {
    [status: string]: number;
}

export interface AgencyStat {
    total: number;
    byStatus: AgencyStatusBreakdown;
}

export interface AgencyStats {
    members: AgencyStat;
    staff: AgencyStat;
    clients: AgencyStat;
}

export interface AgencyMemberUser {
    id: string;
    firstname: string;
    lastname: string;
    name: string;
    email: string;
    phone: string;
}

export interface AgencyMember {
    membershipId: string;
    status: string;
    roles: string[];
    joinedAt: string;
    user: AgencyMemberUser;
}

export interface AgencySingle {
    id: string;
    name: string;
    legalName: string;
    tradingName: string;
    country: string;
    logo: string | null;
    status: string;
    settings: Record<string, unknown>;
    documents: unknown[];
    createdAt: string;
    updatedAt: string;
    owner: AgencyNewOwner;
    stats: AgencyStats;
    members: AgencyMember[];
    statusHistory: unknown[];
}

export interface AgenciesNewSingleData {
    agency: AgencySingle;
}

export interface AgenciesNewSingleResponse {
    status: string;
    message: string;
    data: AgenciesNewSingleData;
}

export interface AgencyDetail {
    id: string;
    name: string;
    legalName: string;
    tradingName: string;
    country: string;
    logo: string | null;
    status: string;
    settings: Record<string, unknown>;
    documents: unknown[];
    createdAt: string;
    updatedAt: string;
    owner: AgencyNewOwner;
    stats: AgencyStats;
    members: AgencyMember[];
    statusHistory: unknown[];
}