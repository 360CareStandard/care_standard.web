import { useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingButton } from "@/components/shared/loading-button";

// at the top of the component (or a constants file)
const btnBase =
  "h-11 rounded-[12px] px-5 text-[15px] font-medium min-w-[194px]";
const btnBrand =
  "bg-[oklch(50.83%_0.116_159.35)] hover:bg-[oklch(46%_0.116_159.35)] text-white";

function maskEmail(email?: string | null) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  const u = user ?? "";
  const masked = u.length <= 2 ? u : `${u[0]}•••${u.slice(-1)}`;
  return `${masked}@${domain}`;
}

export default function CheckEmailPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email =
    (useLocation().state as { email?: string } | undefined)?.email ??
    params.get("email") ??
    "";
  const masked = useMemo(() => maskEmail(email), [email]);

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* logo */}
      <div className="mb-8 flex justify-center">
        <img
          src="/logo/logo-care-standard.svg"
          alt="Care Standard 360+"
          className="h-12 w-auto"
          draggable={false}
        />
      </div>

      {/* card */}
      <div
        className={cn(
          "mx-auto w-full max-w-xl",
          "rounded-[22px] bg-white/95 backdrop-blur-sm",
          "px-8 py-6 md:px-10 md:py-7",
          "shadow-[0_12px_40px_-12px_rgba(2,121,77,.18)]"
        )}
      >
        <h1 className="text-center text-[22px] leading-7 font-medium tracking-tight text-slate-900">
          Check your email inbox
        </h1>
        <p className="mt-2 text-center text-[14px] leading-6 text-slate-600">
          {email ? (
            <>
              We sent a login link to <strong>{masked}</strong>. It expires in
              10 minutes.
            </>
          ) : (
            <>Check your inbox for a login link. It expires in 10 minutes.</>
          )}
        </p>
      </div>
      {/* actions */}
      <div className="mt-6 grid max-w-lg mx-auto gap-4 sm:grid-cols-2">
        <LoadingButton
          onClick={() =>
            navigate("/login", { replace: true, state: { email } })
          }
          className={cn(btnBase, btnBrand)}
          centerLabel
          iconLeft={<ArrowLeft className="h-4 w-4" aria-hidden />}
        >
          Change email
        </LoadingButton>

        <LoadingButton
          onClick={() =>
            (window.location.href = "mailto:support@care360.co.uk")
          }
          className={cn(btnBase, btnBrand)}
          centerLabel
          iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
        >
          Get support
        </LoadingButton>
      </div>
    </div>
  );
}
