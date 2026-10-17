import { LoaderCircle } from "lucide-react";

type BrandedLoadingStateProps = {
  title: string;
  description: string;
};

export function BrandedLoadingState({
  title,
  description,
}: BrandedLoadingStateProps) {
  return (
    <div className="flex w-full flex-col items-center gap-8">
      <img
        src="/logo/logo-care-standard.svg"
        alt="Care Standard 360+"
        className="h-16 w-auto drop-shadow-md"
      />

      <section
        aria-live="polite"
        aria-busy="true"
        className="w-full max-w-sm rounded-2xl border border-white/70 bg-white px-8 py-9 text-center shadow-xl shadow-slate-950/10"
      >
        <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-emerald-50 text-primary">
          <LoaderCircle
            aria-hidden="true"
            className="h-6 w-6 motion-safe:animate-spin"
            strokeWidth={2}
          />
        </span>
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </section>
    </div>
  );
}
