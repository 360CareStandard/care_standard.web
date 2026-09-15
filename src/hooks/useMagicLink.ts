// src/hooks/useMagicLink.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "@/api/auth";
import { qk } from "@/lib/queryKeys";
import { useAuthStore } from "@/stores/auth-store";

export function useRequestMagicLink() {
  return useMutation({
    mutationFn: (email: string) => AuthApi.requestMagicLink(email),
  });
}

export function useVerifyMagicCallback() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: AuthApi.verifyMagicToken, // ({ token, email, agencyId }) => Promise<AxiosResponse<LoginResponse>>
    retry: 0,
    onSuccess: (res) => {
      console.log(res);

      const { token, user } = res.data.data;
      setAuth({ token, user }); // token persisted (or token-only if you chose that)
      qc.setQueryData(qk.me, { data: user });
    },
  });
}
