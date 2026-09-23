// src/types/auth.ts
import type { User } from "./user";
export type LoginBody = {
  email: string;
  password?: string;
  magicToken?: string;
};
export type LoginResponse = {
  status: "success";
  data: { token: string; user: User, isSuperAdmin: boolean };
};
