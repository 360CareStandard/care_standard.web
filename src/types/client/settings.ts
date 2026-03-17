export interface ClientSettings {
    id: string;
    clientId: string;
    agencyId: string;

    enableFamilyAccess: boolean;
    missedVisitAlerts: boolean;
    criticalMedicationAlerts: boolean;
    geoLocationClockIn: boolean;

    shareCarePlanWithFamily: boolean;
    shareNotesWithFamily: boolean;
    shareHealthInfoWithFamily: boolean;

    metadata: Record<string, unknown>;

    createdAt: string;
    updatedAt: string;

    client: Client;
    agency: Agency;
}
export interface Client {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
}
export interface Agency {
    id: string;
    tradingName: string;
    legalName: string;
    country: string;
}
export interface GetClientSettingsResponse {
    status: "success" | "fail";
    message: string;
    data: {
        clientSettings: ClientSettings;
    };
}