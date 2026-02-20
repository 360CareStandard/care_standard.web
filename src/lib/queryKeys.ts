// src/lib/queryKeys.ts
export const qk = {
  me: ["me"] as const,
  menu: (p?: any) => ["menu", p] as const,
  carePackage: (p?: any) => ["care-package", p] as const,
  clientList: (params?: { page?: number; limit?: number; q?: string }) => [
    "client",
    "list",
    params,
  ],

  client: (id: string) => ["client", id] as const,
  clientContacts: (clientId?: string) => ["client-contacts", clientId] as const,
  // unique key for a single contact
  clientContact: (clientId?: string, contactId?: string) =>
    ["client-contact", clientId, contactId] as const,
  clientVisitSchedules: (clientId?: string) =>
    ["client-visit-schedule", clientId] as const,
  // unique key for a single contact
  clientVisitSchedule: (clientId?: string, scheduleId?: string) =>
    ["client-visit-schedule", clientId, scheduleId] as const,
  // unique key for a single contact
  clientCare: (clientId?: string) => ["client-care", clientId] as const,
  clientLegal: (clientId?: string) => ["client-legal", clientId] as const,
  clientHealth: (clientId?: string) => ["client-health", clientId] as const,
  clientGpSupport: (clientId?: string) =>
    ["client-gp-support", clientId] as const,
  clientHomeEnvironment: (clientId?: string) =>
    ["client-home-enviroment", clientId] as const,
  clientPreferences: (clientId?: string) =>
    ["client-preferences", clientId] as const,

  carePlan: (clientId?: string, carePlanId?: string) =>
    ["care-plan", clientId, carePlanId] as const,
  medication: (clientId?: string, medicationId?: string, status?: string) =>
    ["medication", status, clientId, medicationId] as const,
  workspace: ["workspace"] as const,

  //staff
  // staffs: (params?: Record<string, unknown>) => ["staff", params] as const,
  // staff: (id: string) => ["staff", id] as const,
  staffList: (params?: { page?: number; limit?: number; q?: string }) => [
    "staff",
    "list",
    params,
  ],

  staffInfinite: (params?: { limit?: number; q?: string }) => [
    "staff",
    "infinite",
    params,
  ],

  staff: (id: string) => ["staff", "detail", id],
  staffContacts: (staffId?: string) => ["staff-contacts", staffId] as const,
  // unique key for a single contact
  staffContact: (staffId?: string, contactId?: string) =>
    ["staff-contact", staffId, contactId] as const,
  staffWork: (staffId?: string) => ["staff-work", staffId] as const,
  staffEmployment: (staffId?: string) => ["staff-employment", staffId] as const,
  staffSkill: (staffId?: string) => ["staff-skill", staffId] as const,
  staffDocument: (staffId?: string) => ["staff-document", staffId] as const,
  staffAvailability: (staffId?: string) =>
    ["staff-employment", staffId] as const,

  //Shift Roster
  shiftRosterList: (params?: { view?: string; date?: string; endDate?: string }) => [
  "shift-roster",
  params?.view ?? "daily",
  params?.date ?? "",
  params?.endDate ?? "",
] as const,
  shiftRoster: (id: string) => ["shift-roster", id],
};
