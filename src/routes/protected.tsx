// src/routes/protected.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/auth-store";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const isAuthed = useAuthStore((s) => s.isAuthed);
  const location = useLocation();

  if (!isAuthed) {
    return (
      <Navigate
        to={`/login?next=${encodeURIComponent(
          location.pathname + location.search
        )}`}
        replace
      />
    );
  }

  // 👇 return JSX, not an object
  return <>{children}</>;
}
