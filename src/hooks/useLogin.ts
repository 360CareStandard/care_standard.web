// src/hooks/useLogin.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthApi } from "@/api/auth";
import type { LoginBody } from "@/types/auth";
import { useAuthStore } from "@/stores/auth-store";
import { qk } from "@/lib/queryKeys";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginBody) => AuthApi.login(body),
    onSuccess: (res) => {
      const { token, user } = res.data;
      setAuth({ token, user });
      qc.setQueryData(qk.me, { data: user });
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next");
      window.location.replace(next || "/");
    },
  });
}
