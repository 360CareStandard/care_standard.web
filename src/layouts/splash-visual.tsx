import { BrandedLoadingState } from "@/components/shared/branded-loading-state";

export default function SplashVisual({ message = "Loading…" }) {
  return (
    <main aria-label="Loading" className="min-h-dvh relative overflow-hidden">
      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#02794D] to-[#043A68]" />
      {/* the same SVG overlay you use in AuthLayout (global CSS class) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 mix-blend-overlay auth-overlay"
      />
      <section className="relative z-10 grid min-h-dvh place-items-center p-6">
        <BrandedLoadingState
          title="Loading your workspace"
          description={message}
        />
      </section>
    </main>
  );
}
