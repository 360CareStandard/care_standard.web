// src/hooks/useLogout.ts
import { useAuthStore } from "@/stores/auth-store";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const clear = useAuthStore((s) => s.clearAuth);
  const qc = useQueryClient();
  return () => {
    clear();
    qc.clear();
    window.location.replace("/login");
  };
}
