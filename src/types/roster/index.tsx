

export type ShiftStatus = "scheduled" | "completed" | "missed" | "ongoing" | string;

export type Shift = {
    id: string;
    visitStartTime: string; // "HH:mm:ss"
    visitEndTime: string;   // "HH:mm:ss"
    duration: number;
    status: ShiftStatus;
    scheduleType: string;
    client: { id: string; firstname: string; lastname: string };
    isSecondary: boolean;
};


export type RosterRowResponse = {
    firstname: string;        // "Lexus Nissan"
    lastname: string;
    shiftCount: number;    // "(11 hrs)" etc
    staffId: string;
    staffRole: string;
    shifts: Shift[];
};
export type ShiftRosterData = {
    roster: RosterRowResponse[];
    date: string;         // "2026-02-20"
    totalStaff: number;
    totalShifts: number;
}
export type ShiftRosterResponse = {
    data: ShiftRosterData
};

//For UI
export type RosterRow = {
    rowId: string;
    title: string;        // "Lexus Nissan"
    subtitle?: string;    // "(11 hrs)" etc
    shifts: Shift[];
};