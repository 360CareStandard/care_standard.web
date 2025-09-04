import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-dvh relative overflow-hidden bg-gradient-to-b from-[#02794D] to-[#043A68]">
      {/* Figma SVGs layered on top of the gradient */}
      {/* <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay auth-overlay"
      /> */}

      <div
        aria-hidden
        className="absolute inset-0 auth-rect pointer-events-none"
      />

      {/* lines (glow + pulse) */}
      <div
        aria-hidden
        className="absolute inset-0 auth-lines pointer-events-none"
      />

      {/* optional blobs (keep/remove as you like) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* page content area */}
      <div className="relative z-10 min-h-dvh flex items-center justify-center p-6">
        <Outlet />
      </div>
    </main>
  );
}
