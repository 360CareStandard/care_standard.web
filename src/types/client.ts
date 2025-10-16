// src/types/client.ts
export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientListResponse = {
  data: Client[];
  meta: { total: number; page: number; limit: number };
};

export type ClientResponse = { data: Client };

export type UpdateClientBody = Partial<
  Pick<Client, "firstName" | "lastName" | "email" | "phone">
>;
