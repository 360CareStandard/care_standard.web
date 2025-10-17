// src/pages/auth/LoginForm.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { TextField } from "@/components/shared/text-field";
import { LoadingButton } from "@/components/shared/loading-button";
import { useRequestMagicLink } from "@/hooks/useMagicLink";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-link": "That link is invalid. Please request a new magic link.",
  expired:
    "Your magic link is invalid or has expired. Please request a new one.",
  server:
    "We couldn't verify your link due to a server issue. Please try again.",
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | boolean>("");

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const next = searchParams.get("next") || "/app";
  const { mutate, isPending } = useRequestMagicLink();

  // 👇 read ?error=... coming from magic-link redirects
  useEffect(() => {
    const errKey = searchParams.get("error");
    if (!errKey) return;

    setError(
      ERROR_MESSAGES[errKey] ?? "Something went wrong. Please try again."
    );

    // (optional) remove the error param from the URL so it doesn't persist on refresh
    const clean = new URLSearchParams(location.search);
    clean.delete("error");
    navigate(
      { pathname: location.pathname, search: clean.toString() },
      { replace: true }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, location.pathname, navigate]);

  const submit = () => {
    setError("");
    if (!emailRegex.test(email.trim())) {
      setError("Enter a valid email");
      return;
    }
    mutate(email.trim(), {
      onSuccess: () => {
        navigate(
          `/login/check-email?email=${encodeURIComponent(
            email
          )}&next=${encodeURIComponent(next)}`,
          { replace: true, state: { email, next } }
        );
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        if (status === 404) setError("There is no user with this email");
        else if (status === 429)
          setError("Too many attempts. Please try again shortly.");
        else setError("Could not send the magic link. Please try again.");
      },
    });
  };

  return (
    <div className="bg-white max-w-xl rounded-2xl p-8 backdrop-blur-sm">
      <div className="text-center mb-6 space-y-1">
        <h1 className="text-2xl font-semibold text-balance">Welcome Back!</h1>
        <p className="text-sm leading-relaxed text-pretty text-gray-600">
          We're so excited to see you again
        </p>
      </div>

      {/* optional global error banner */}
      {typeof error === "string" && error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <TextField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(""); // clear banner while typing
          }}
          error={false /* keep field-level error clean; we show banner above */}
          placeholder="Enter your email"
        />

        <LoadingButton
          loading={isPending}
          type="button"
          disabled={email.trim() === "" || isPending}
          onClick={submit}
          className="w-full disabled:bg-gray-300 h-11 disabled:text-gray-600 py-3 px-4 transition-colors duration-200"
        >
          Send Secure Link
        </LoadingButton>
      </div>
    </div>
  );
}
