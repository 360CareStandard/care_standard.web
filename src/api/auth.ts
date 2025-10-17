// src/api/auth.ts

import { publicApi } from "@/lib/axios";
import { post, get, postPublic } from ".";
import type { LoginBody, LoginResponse } from "@/types/auth";
import {
  AgenciesResponse,
  SelectAgencyReq,
  SelectAgencyRes,
} from "@/types/workspace";

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
  // 👇 correct the type here
  workspace: () => get<AgenciesResponse>("/agency/all"),

  // 👇 new: select agency
  selectAgency: (body: SelectAgencyReq) =>
    post<SelectAgencyRes>("/auth/select-agency", body),
};
