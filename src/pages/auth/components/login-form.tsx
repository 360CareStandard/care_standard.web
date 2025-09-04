import { useState } from "react";
import { TextField } from "@/components/shared/text-field";
import { LoadingButton } from "@/components/shared/loading-button";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | boolean>("");
  const navigate = useNavigate();

  const submit = async () => {
    navigate("/login/check-email?email=" + encodeURIComponent(email), {
      replace: true,
      state: { email },
    });
    // fake server check
    // const exists = false;
    // setError(exists ? "" : "There is no user with this email");
  };

  return (
    <div className="bg-white max-w-xl rounded-2xl  p-8 backdrop-blur-sm">
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
          error={error} // pass "" or false to clear the error
          placeholder="Enter your email"
        />

        <LoadingButton
          // loading
          type="button"
          disabled={email.trim() === ""}
          onClick={submit}
          className="w-full disabled:bg-gray-300 h-11  disabled:text-gray-600 py-3 px-4 transition-colors duration-200"
        >
          Send Secure Link
        </LoadingButton>
      </div>
    </div>
  );
}
