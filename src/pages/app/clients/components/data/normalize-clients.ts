// src/utils/normalizeClients.ts
import type {
  ClientsResponse,
  Client as ClientRaw,
  ClientStatus,
} from "@/types/client/client";

export interface ClientNormalized {
  id: string;
  name: string; // firstname + lastname
  firstname: string;
  lastname: string;
  gender: string | null;
  preferredname?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  country?: string | null;
  riskLevel?: string | null;
  status: ClientStatus;
  createdAt?: string | null;
  updatedAt?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  agency?: {
    id: string;
    tradingName: string;
    country?: string | null;
  } | null;
  raw: ClientRaw; // keep original if you need other fields
}

export function normalizeClientsResponse(res: ClientsResponse) {
  const raw = res.data;
  if (!raw)
    return {
      clients: [] as ClientNormalized[],
      totalPages: 0,
      currentPage: 1,
      result: 0,
    };

  const clients: ClientNormalized[] = raw.clients.map((c) => {
    const lat = c.latitude ? Number(c.latitude) : null;
    const lng = c.longitude ? Number(c.longitude) : null;

    return {
      id: c.id,
      name: `${c.firstname ?? ""} ${c.lastname ?? ""}`.trim(),
      firstname: c.firstname,
      lastname: c.lastname,
      preferredname: c.preferredname ?? null,
      email: c.email ?? null,
      phone: c.phone ?? null,
      gender: c.gender ?? null,
      city: c.city ?? null,
      country: c.country ?? null,
      riskLevel: c.riskLevel ?? null,
      status: c.status ?? "inactive",
      createdAt: c.createdAt ?? null,
      updatedAt: c.updatedAt ?? null,
      latitude: Number.isFinite(lat) ? lat : null,
      longitude: Number.isFinite(lng) ? lng : null,
      agency: c.agency
        ? {
            id: c.agency.id,
            tradingName: c.agency.tradingName,
            country: c.agency.country ?? null,
          }
        : null,
      raw: c,
    };
  });

  const currentPage =
    typeof raw.currentPage === "string"
      ? parseInt(raw.currentPage, 10) || 1
      : raw.currentPage ?? 1;

  return {
    clients,
    totalPages: raw.totalPages,
    currentPage,
    result: raw.result,
  };
}
