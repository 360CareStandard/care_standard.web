// src/pages/auth/LoginForm.tsx
import { useState } from "react";
import { TextField } from "@/components/shared/text-field";
import { LoadingButton } from "@/components/shared/loading-button";
import { useNavigate, useLocation } from "react-router-dom";
import { useRequestMagicLink } from "@/hooks/useMagicLink";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | boolean>("");
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/app";
  const { mutate, isPending } = useRequestMagicLink();

  const submit = () => {
    setError("");
    if (!emailRegex.test(email.trim())) {
      setError("Enter a valid email");
      return;
    }

    mutate(email.trim(), {
      onSuccess: () => {
        // take user to "check your email" screen
        navigate(
          `/login/check-email?email=${encodeURIComponent(
            email
          )}&next=${encodeURIComponent(next)}`,
          {
            replace: true,
            state: { email, next },
          }
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

      <div className="space-y-4">
        <TextField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
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
