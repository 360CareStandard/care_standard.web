// /src/pages/auth/MagicLinkCallback.tsx
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

type VerifyResponse = {
  accessToken: string; // your app JWT
  user: { id: string; name: string; email: string };
  workspaces: Array<{ id: string; name: string; role?: string }>;
  activeWorkspaceId?: string | null; // optional (server can pick)
};

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api"; // e.g. http://localhost:4000

export default function MagicLinkCallback() {
  const nav = useNavigate();
  const loc = useLocation();

  const [state, setState] = React.useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [message, setMessage] = React.useState<string>("Verifying your link…");

  React.useEffect(() => {
    const sp = new URLSearchParams(loc.search);
    const token = sp.get("token");
    const agencyId = sp.get("agencyId") ?? undefined;
    const next = sp.get("next") ?? undefined;

    if (!token) {
      setState("error");
      setMessage("This login link is missing a token.");
      return;
    }

    (async () => {
      try {
        // 1) Verify magic link with backend
        const res = await fetch(`${API_BASE}/auth/magic/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // if your API sets httpOnly session cookies
          body: JSON.stringify({ token, agencyId }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Verification failed");
        }

        const data = (await res.json()) as VerifyResponse;

        // 2) Persist session (choose cookie or localStorage as your app standard)
        // If your API sets httpOnly cookies on its own, you might not need to store the token here.
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("workspaces", JSON.stringify(data.workspaces));

        // Optionally remember the server-chosen workspace
        if (data.activeWorkspaceId) {
          localStorage.setItem("activeWorkspaceId", data.activeWorkspaceId);
        }

        // 3) Clean the token from the URL (no sensitive stuff lingering)
        const url = new URL(window.location.href);
        url.searchParams.delete("token");
        url.searchParams.delete("agencyId");
        window.history.replaceState({}, "", url.toString());

        setState("success");
        setMessage("You're in. Redirecting…");

        // 4) Route them
        const chosen =
          data.activeWorkspaceId ??
          (data.workspaces.length === 1 ? data.workspaces[0].id : null);

        if (next) {
          nav(next, { replace: true });
        } else if (chosen) {
          nav(`/app/w/${encodeURIComponent(chosen)}`, { replace: true });
        } else {
          nav("/workspace", { replace: true }); // your selection page
        }
      } catch (err: any) {
        setState("error");
        setMessage(
          err?.message?.includes("expired")
            ? "This login link has expired. Please request a new one."
            : "We couldn’t verify this link. Please try again."
        );
      }
    })();
  }, [loc.search, nav]);

  return (
    <div>
      <div className="mx-4 max-w-md w-full rounded-2xl bg-white/95 p-6 shadow-xl">
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">
            {state === "verifying"
              ? "Verifying…"
              : state === "success"
              ? "Success"
              : "Oops"}
          </h1>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>

        {state === "error" && (
          <div className="mt-6 flex flex-col gap-3">
            <a
              href="/login"
              className="inline-flex justify-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Back to login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
