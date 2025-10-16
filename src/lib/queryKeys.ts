// src/lib/queryKeys.ts
export const qk = {
  me: ["me"] as const,
  menu: (p?: any) => ["menu", p] as const,
  clients: (params?: Record<string, unknown>) => ["clients", params] as const,
  client: (id: string) => ["client", id] as const,
};
