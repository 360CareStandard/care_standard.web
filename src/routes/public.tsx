// src/routes/PublicOnlyRoute.tsx
import { useAuthStore } from "@/stores/auth-store";
import { PropsWithChildren } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function PublicOnlyRoute({ children }: PropsWithChildren) {
  const { isAuthed } = useAuthStore();
  const location = useLocation();
  if (isAuthed) {
    const next = new URLSearchParams(location.search).get("next");
    return <Navigate to={next || "/app"} replace />;
  }
  return <>{children}</>;
}
