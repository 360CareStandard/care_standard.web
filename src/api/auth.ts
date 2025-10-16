// src/api/auth.ts

import { publicApi } from "@/lib/axios";
import { post, get, postPublic } from ".";
import type { LoginBody, LoginResponse } from "@/types/auth";
import type { User } from "@/types/user";

export const AuthApi = {
  login: (body: LoginBody) =>
    postPublic<LoginResponse>("/auth/request-magic-link", body),
  requestMagicLink: (email: string) =>
    postPublic<
      { status: "success" } | { status: "error"; message: string },
      { email: string }
    >("/auth/request-magic-link", { email }),
  verifyMagicToken: (args: {
    token: string;
    email: string;
    agencyId?: string;
  }) =>
    publicApi.get<LoginResponse>("/auth/magic", {
      params: {
        token: args.token,
        email: args.email,
        agencyId: args.agencyId, // optional if your API needs it
      },
    }),
  me: () => get<{ data: User }>("/users/me"),
  // logout route optional; without refresh, simply clear client state
};
