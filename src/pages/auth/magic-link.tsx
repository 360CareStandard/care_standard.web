import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useVerifyMagicCallback } from "@/hooks/useMagicLink";
import { BrandedLoadingState } from "@/components/shared/branded-loading-state";

export default function MagicLinkCallback() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const qs = new URLSearchParams(search);

  const token = qs.get("token") || "";
  const email = qs.get("email") || "";
  const agencyId = qs.get("agencyId") || undefined;

  const { mutateAsync } = useVerifyMagicCallback();

  useEffect(() => {
    if (!token || !email) {
      navigate("/login?error=invalid-link", { replace: true });
      return;
    }

    const verifyMagicLink = async () => {
      try {
        const response = await mutateAsync({
          token,
          email,
          agencyId,
        });

        const { isSuperAdmin } = response.data.data;

        if (isSuperAdmin) {
          navigate("/care-standard360", { replace: true });
        } else {
          navigate("/select-workspace", { replace: true });
        }
      } catch (err: any) {
        const code = err?.response?.status;

        if (code === 404 || code === 400 || code === 401) {
          navigate("/login?error=expired", { replace: true });
        } else {
          navigate("/login?error=server", { replace: true });
        }
      }
    };

    verifyMagicLink();
  }, [token, email, agencyId, mutateAsync, navigate]);
  return (
    <section className="relative z-10 grid min-h-dvh place-items-center p-6">
      <BrandedLoadingState
        title="Welcome back"
        description="We’re securely checking your sign-in link and preparing your workspace."
      />
    </section>
  );
}
