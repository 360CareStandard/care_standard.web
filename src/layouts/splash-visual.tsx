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
      {/* center content */}
      <section className="relative z-10 min-h-dvh grid place-items-center p-6 text-white">
        <div className="flex flex-col items-center gap-6">
          <img
            src="/logo/logo-care-standard.svg"
            alt="care-standard"
            className="h-16 w-auto drop-shadow-md"
          />
          <div className="flex items-center gap-3 text-sm opacity-90">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
            {message}
          </div>
        </div>
      </section>
    </main>
  );
}
