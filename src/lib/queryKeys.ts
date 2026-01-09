// src/lib/queryKeys.ts
export const qk = {
  me: ["me"] as const,
  menu: (p?: any) => ["menu", p] as const,
  carePackage: (p?: any) => ["care-package", p] as const,
  clients: (params?: Record<string, unknown>) => ["clients", params] as const,

  clientContacts: (clientId?: string) => ["client-contacts", clientId] as const,
  // unique key for a single contact
  clientContact: (clientId?: string, contactId?: string) =>
    ["client-contact", clientId, contactId] as const,
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

  client: (id: string) => ["client", id] as const,
  carePlan: (clientId?: string, carePlanId?: string) =>
    ["care-plan", clientId, carePlanId] as const,
  medication: (clientId?: string, medicationId?: string, status?: string) =>
    ["medication", status, clientId, medicationId] as const,
  workspace: ["workspace"] as const,

  //staff
  staff: (params?: Record<string, unknown>) => ["staff", params] as const,
};
