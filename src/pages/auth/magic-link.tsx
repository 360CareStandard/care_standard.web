// src/pages/auth/magic-link.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyMagicCallback } from "@/hooks/useMagicLink";

export default function MagicLinkCallback() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const qs = new URLSearchParams(search);

  const token = qs.get("token") || "";
  const email = qs.get("email") || "";
  const agencyId = qs.get("agencyId") || undefined;
  const next = qs.get("next") || "/app";

  const { mutate, isPending } = useVerifyMagicCallback();

  useEffect(() => {
    if (!token || !email) {
      navigate("/login?error=invalid-link", { replace: true });
      return;
    }
    mutate(
      { token, email, agencyId },
      {
        onSuccess: () => navigate(next, { replace: true }),
        onError: (err: any) => {
          const code = err?.response?.status;
          // Your API shows 404 with {status:"fail", message:"Invalid or expired token"}
          if (code === 404 || code === 400 || code === 401) {
            navigate("/login?error=expired", { replace: true });
          } else {
            navigate("/login?error=server", { replace: true });
          }
        },
      }
    );
  }, [token, email, agencyId, next, mutate, navigate]);

  return (
    <section className="relative z-10 min-h-dvh grid place-items-center p-6 text-white">
      <div className="flex flex-col items-center gap-6">
        <img
          src="/logo/logo-care-standard.svg"
          alt="care-standard"
          className="h-16 w-auto drop-shadow-md"
        />
        <div className="flex items-center gap-3 text-sm opacity-90">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
          {isPending ? "Signing you in…" : "Processing magic link…"}
        </div>
      </div>
    </section>
  );
}
